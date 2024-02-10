import { GuidService } from '../services/guid.service';

export class BabyModel {
  public guid: string;

  constructor(
    private guidService: GuidService,
    public name: string,
    public birthDate: Date
  ) {
    this.guid = guidService.newGuid();
  }
}
