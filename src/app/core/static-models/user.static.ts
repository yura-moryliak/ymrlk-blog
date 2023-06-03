export class UserStatic {

  get arePasswordIdentical(): boolean {
    return this.passwordsIdentical;
  }

  public userName: string;
  public email: string;

  private id: string;
  private password: string;
  private passwordsIdentical!: boolean;

  constructor(
    userName: string,
    email: string,
    password: string,
    confirmPassword: string
  ) {
    this.id = Math.random().toString();
    this.userName = userName;
    this.email = email;
    this.password = password;

    this.checkPasswords(password, confirmPassword);
  }

  private checkPasswords = (password: string, confirmPassword: string): boolean =>
    this.passwordsIdentical = password === confirmPassword;
}

export class StaticUsersList {

  static admin: UserStatic = new UserStatic('admin', 'admin@admin.com', 'admin', 'admin');
  static user: UserStatic = new UserStatic('user', 'user@admin.com', 'user', 'user');
  static ymrlk: UserStatic = new UserStatic('ymrlk', 'moryliak.y@gmail.com', '12345', '12345');

}
