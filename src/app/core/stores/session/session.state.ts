import type { User } from '../../../models/user.model';

export type SessionStatus = 'initializing' | 'ready' | 'signed-out';

export interface SessionState {
  user: User | null;
  userimageUrl: string | null;
  status: SessionStatus;
  loginError: string | null;
}

export const initialSessionState: SessionState = {
  user: null,
  userimageUrl: null,
  status: 'initializing',
  loginError: null,
};
