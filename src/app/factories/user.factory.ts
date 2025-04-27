import { UserStatus } from '../enums/user-status.enum';
import { BabyEventCategory } from '../models/baby.model';
import { User } from '../models/user.model';
import { User as FirebaseUser } from 'firebase/auth';

export class UserFactory {
  /**
   * Create a full User object from partial user data and Firebase auth data
   */
  public static createUserObject(
    user: Partial<User> | null,
    authData: FirebaseUser
  ): User {
    const defaults = this.createDefaultUser(authData);

    return {
      uid: user?.uid ?? defaults.uid,
      name: user?.name ?? defaults.name,
      email: user?.email ?? defaults.email,
      status: user?.status ?? defaults.status,
      dueDate: user?.dueDate ?? defaults.dueDate,
      babyEventsPreferences:
        user?.babyEventsPreferences ?? defaults.babyEventsPreferences,
      babiesUids: user?.babiesUids ?? defaults.babiesUids,
    };
  }

  /**
   * Create default user structure
   */
  private static createDefaultUser(authData: FirebaseUser): User {
    return {
      uid: authData.uid,
      name: authData.displayName ?? 'Unknown User',
      email: authData.email ?? 'Unknown Email',
      status: UserStatus.VIP,
      dueDate: undefined,
      babyEventsPreferences: this.createDefaultBabyEventPreferences(),
      babiesUids: [],
    };
  }

  /**
   * Default Baby Event Preferences
   */
  private static createDefaultBabyEventPreferences(): BabyEventCategory[] {
    return [
      {
        name: 'Bottle',
        defaultComment: '',
        imagePath: '../../assets/images/icons8-baby-bottle-96.png',
        isCategoryEnabled: true,
        isDefaultCommentEnabled: false,
      },
      {
        name: 'Breastfeeding',
        defaultComment: '',
        imagePath: '../../assets/images/icons8-breastfeeding-96.png',
        isCategoryEnabled: true,
        isDefaultCommentEnabled: false,
      },
      {
        name: 'Breast Pump',
        defaultComment: '',
        imagePath: '../../assets/images/icons8-breast-pump-96.png',
        isCategoryEnabled: true,
        isDefaultCommentEnabled: false,
      },
      {
        name: 'Diaper',
        defaultComment: '',
        imagePath: '../../assets/images/icons8-diaper-96.png',
        isCategoryEnabled: true,
        isDefaultCommentEnabled: false,
      },
      {
        name: 'Poo',
        defaultComment: '',
        imagePath: '../../assets/images/icons8-pile-of-poo-3d-fluency-96.png',
        isCategoryEnabled: true,
        isDefaultCommentEnabled: false,
      },
      {
        name: 'Shower',
        defaultComment: '',
        imagePath: '../../assets/images/icons8-shower-96.png',
        isCategoryEnabled: true,
        isDefaultCommentEnabled: false,
      },
      {
        name: 'Awake',
        defaultComment: '',
        imagePath: '../../assets/images/icons8-sun-96.png',
        isCategoryEnabled: true,
        isDefaultCommentEnabled: false,
      },
      {
        name: 'Sleep',
        defaultComment: '',
        imagePath: '../../assets/images/icons8-moon-96.png',
        isCategoryEnabled: true,
        isDefaultCommentEnabled: false,
      },
      {
        name: 'Fever',
        defaultComment: '',
        imagePath: '../../assets/images/icons8-thermometer-96.png',
        isCategoryEnabled: true,
        isDefaultCommentEnabled: false,
      },
      {
        name: 'Medication',
        defaultComment: '',
        imagePath: '../../assets/images/icons8-pill-96.png',
        isCategoryEnabled: true,
        isDefaultCommentEnabled: false,
      },
      {
        name: 'Vomit',
        defaultComment: '',
        imagePath: '../../assets/images/icons8-face-vomiting-96.png',
        isCategoryEnabled: true,
        isDefaultCommentEnabled: false,
      },
      {
        name: 'Vaccine',
        defaultComment: '',
        imagePath: '../../assets/images/icons8-syringe-96.png',
        isCategoryEnabled: false,
        isDefaultCommentEnabled: false,
      },
      {
        name: 'Notes',
        defaultComment: '',
        imagePath: '../../assets/images/icons8-task-96.png',
        isCategoryEnabled: true,
        isDefaultCommentEnabled: false,
      },
    ];
  }
}
