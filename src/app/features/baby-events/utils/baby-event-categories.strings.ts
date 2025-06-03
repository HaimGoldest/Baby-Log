import { BabyEventCategory } from '../../../models/baby.model';

export default function GetCategoryName(category: BabyEventCategory): string {
  switch (category.id) {
    // case 'milestone':

    case 'Bottle':
      return 'בקבוק';
    case 'Breastfeeding':
      return 'הנקה';
    case 'BreastPump':
      return 'שאיבה';
    case 'Diaper':
      return 'החלפת טיטול';
    case 'Poo':
      return 'קקי';
    case 'Shower':
      return 'מקלחת';
    case 'Awake':
      return 'התעורר';
    case 'Sleep':
      return 'נרדם';
    case 'Fever':
      return 'חום';
    case 'Medication':
      return 'קבלת תרופה';
    case 'Vomit':
      return 'הקאה';
    case 'Vaccine':
      return 'חיסון';
    case 'Notes':
      return 'כללי';
    default:
      return category.id;
  }
}
