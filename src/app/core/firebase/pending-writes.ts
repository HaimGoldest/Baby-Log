import { Signal, signal } from '@angular/core';
import { toObservable } from '@angular/core/rxjs-interop';
import { Observable, filter, firstValueFrom, of, timeout } from 'rxjs';

/**
 * - `saving`: an edit or delete is in flight. It runs as a transaction, which
 *   is never applied locally, so the item keeps its old data until the server
 *   round-trip ends.
 * - `syncing`: an add is already shown from the local cache and is waiting for
 *   the server to acknowledge it, which lasts until reconnect while offline.
 */
export type PendingKind = 'saving' | 'syncing';

/**
 * Per-item write state for a list stored in a Firestore array field, keyed by
 * item uid.
 *
 * Keyed by uid rather than held by the component that started the write: list
 * rows are recycled by virtual scrolling and re-created by snapshots, so state
 * on the component can end up on the wrong row or be lost mid-write.
 *
 * In memory only. Firestore reports pending writes per document, and every
 * item shares one document, so the SDK cannot say which item is unsynced; a
 * write still queued in IndexedDB after a reload is no longer marked.
 *
 * Must be created in an injection context (e.g. as a service field), since it
 * observes `items`.
 */
export class PendingWrites<T extends { uid: string }> {
  /**
   * Cap on holding a mark once the write has resolved. The write succeeded by
   * then, so releasing early can only show stale data for a moment, never a
   * false success.
   */
  private static readonly LANDING_TIMEOUT_MS = 5000;

  private readonly state = signal<ReadonlyMap<string, PendingKind>>(new Map());
  private readonly items$: Observable<readonly T[]>;

  constructor(items: Signal<readonly T[]>) {
    this.items$ = toObservable(items);
  }

  public kindOf(uid: string): PendingKind | null {
    return this.state().get(uid) ?? null;
  }

  /**
   * Marks `uid` as `kind` while `write` runs, and clears it however the write
   * settles.
   *
   * With `landed`, the mark is held after `write` resolves until the list
   * satisfies it: a transaction commits straight to the server and the
   * listener may deliver the result after the commit resolves, so releasing on
   * commit would briefly show the old data, or a deleted item, unlocked.
   *
   * A write for a uid that is already pending is ignored. The UI disables the
   * actions while pending, so this only guards against programmatic races.
   */
  public async track(
    uid: string,
    kind: PendingKind,
    write: () => Promise<void>,
    landed?: (items: readonly T[]) => boolean,
  ): Promise<void> {
    if (this.state().has(uid)) return;

    this.mark(uid, kind);
    try {
      await write();
      if (landed) await this.whenItems(landed);
    } finally {
      this.mark(uid, null);
    }
  }

  /**
   * Resolves once `predicate` holds for the list, or when the cap runs out.
   *
   * Never rejects: it only runs after the write succeeded, so a failure here
   * must not reach the caller as a failed write.
   */
  private whenItems(
    predicate: (items: readonly T[]) => boolean,
  ): Promise<unknown> {
    return firstValueFrom(
      this.items$.pipe(
        filter(predicate),
        timeout({
          first: PendingWrites.LANDING_TIMEOUT_MS,
          with: () => of(null),
        }),
      ),
    ).catch(() => null);
  }

  private mark(uid: string, kind: PendingKind | null): void {
    this.state.update((current) => {
      const next = new Map(current);
      if (kind) {
        next.set(uid, kind);
      } else {
        next.delete(uid);
      }
      return next;
    });
  }
}
