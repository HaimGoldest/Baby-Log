import { Injectable } from '@angular/core';
import { Guid } from 'guid-typescript';

@Injectable({
  providedIn: 'root',
})
export class GuidService {
  constructor() {}

  // Generate a new GUID
  newGuid(): string {
    const newGuid: Guid = Guid.create();
    return newGuid.toString();
  }

  // Parse a GUID from a string
  parsedGuid(guid: string) {
    const parsedGuid: Guid | null = Guid.parse(guid);
    if (parsedGuid !== null) {
      console.log(parsedGuid.toString());
    } else {
      console.error('Invalid GUID string');
    }
  }
}
