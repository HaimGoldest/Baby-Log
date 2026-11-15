import { Gender } from '../../enums/gender.enum';
import BabyInfoStrings from './baby-info.strings';

const MS_PER_DAY = 24 * 60 * 60 * 1000;

interface UnitWords {
  one: string;
  two: string;
  many: string;
}

/**
 * The baby's age as a short Hebrew phrase, such as "בן 4 חודשים ו־5 ימים" or
 * "בת שנה וחודשיים": the two largest calendar units that are not zero, with
 * days dropped from the first birthday on. Returns an empty string for a birth
 * date in the future.
 */
export function formatBabyAge(
  birthDate: Date,
  gender: Gender,
  today: Date = new Date(),
): string {
  const age = calendarAge(birthDate, today);
  if (!age) return '';

  const strings = BabyInfoStrings;
  const isFemale = gender === Gender.Female;
  const years = { one: strings.YEAR, two: strings.TWO_YEARS, many: strings.YEARS };
  const months = { one: strings.MONTH, two: strings.TWO_MONTHS, many: strings.MONTHS };
  const days = { one: strings.DAY, two: strings.TWO_DAYS, many: strings.DAYS };

  let units: [number, UnitWords][];
  if (age.years > 0) {
    units = [[age.years, years], [age.months, months]];
  } else if (age.months > 0) {
    units = [[age.months, months], [age.days, days]];
  } else {
    units = [[age.days, days]];
  }

  const [first, second] = units
    .filter(([count]) => count > 0)
    .map(([count, words]) => countPhrase(count, words));

  if (!first) {
    return isFemale ? strings.BORN_TODAY_FEMALE : strings.BORN_TODAY_MALE;
  }

  const phrase = second ? `${first} ${withAnd(second)}` : first;
  return `${isFemale ? strings.AGE_FEMALE : strings.AGE_MALE} ${phrase}`;
}

/**
 * Whole years, months and days from birth to today, by calendar date (time of
 * day ignored). A birthday on a day the current month lacks (e.g. the 31st)
 * falls on that month's last day. Null when the birth date is in the future.
 */
function calendarAge(
  birth: Date,
  today: Date,
): { years: number; months: number; days: number } | null {
  let totalMonths =
    (today.getFullYear() - birth.getFullYear()) * 12 +
    today.getMonth() -
    birth.getMonth();
  if (today.getDate() < birth.getDate()) totalMonths -= 1;
  if (totalMonths < 0) return null;

  const anchorMonth = birth.getMonth() + totalMonths;
  const anchorMonthLength = new Date(
    birth.getFullYear(),
    anchorMonth + 1,
    0,
  ).getDate();
  const anchor = Date.UTC(
    birth.getFullYear(),
    anchorMonth,
    Math.min(birth.getDate(), anchorMonthLength),
  );
  const now = Date.UTC(today.getFullYear(), today.getMonth(), today.getDate());

  return {
    years: Math.floor(totalMonths / 12),
    months: totalMonths % 12,
    days: Math.round((now - anchor) / MS_PER_DAY),
  };
}

/** Hebrew counts: a singular and a dual form, then "<n> <plural>". */
function countPhrase(count: number, words: UnitWords): string {
  if (count === 1) return words.one;
  if (count === 2) return words.two;
  return `${count} ${words.many}`;
}

/** "ו" attaches straight onto a word, and through a maqaf onto a numeral. */
function withAnd(phrase: string): string {
  const and = BabyInfoStrings.AND;
  return /^\d/.test(phrase) ? `${and}־${phrase}` : `${and}${phrase}`;
}
