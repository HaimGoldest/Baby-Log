import { User } from '../models/user.model';

export class UserFactory {
  public static createUserObject(user: User, authData: any): User {
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

  private static createDefaultUser(authData: any): User {
    return {
      uid: '',
      name: '',
      email: '',
      status: '',
      dueDate: undefined,
      babyEventsPref: [],
      babiesUids: [],
    };
  }
}
