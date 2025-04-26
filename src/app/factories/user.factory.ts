import { UserStatus } from '../enums/user-status.enum';
import { User } from '../models/user.model';
import { User as FirebaseUser } from 'firebase/auth';

export class UserFactory {
  public static createUserObject(user: User, authData: FirebaseUser): User {
    if (user) {
      return {
        uid: user.uid,
        name: user.name,
        email: user.email,
        status: user.status,
        dueDate: user.dueDate,
        babyEventsPref: user.babyEventsPref,
        babiesUids: user.babiesUids,
      };
    }
    return this.createDefaultUser(authData);
  }

  private static createDefaultUser(authData: FirebaseUser): User {
    return {
      uid: authData.uid,
      name: authData.displayName ?? 'Unknown User',
      email: authData.email ?? 'Unknown Email',
      status: UserStatus.VIP,
      dueDate: undefined,
      babyEventsPref: [],
      babiesUids: [],
    };
  }
}
