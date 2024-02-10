export class BabyActionModel {
  constructor(
    public type: string,
    public creationTime: Date,
    public desciption: string,
    public imagePath: string
  ) {}
}
