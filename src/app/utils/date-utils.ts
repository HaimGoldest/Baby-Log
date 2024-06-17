export class DateUtils {
  static convertDateToString(date: Date): string {
    return date.toISOString();
  }

  static convertStringToDate(date: string): Date {
    return new Date(date);
  }
}
