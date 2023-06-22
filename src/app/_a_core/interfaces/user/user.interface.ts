export interface UserInterface {
  firstName?: string;
  lastName?: string;
  email?: string;
  subdomain?: string;
  bio?: string;
  location?: string;
  socialProfiles?: Array<{ title: string, url: string }>;
  avatarSrc?: string;
  uuid?: string;
  phoneNumber?: string
  joinedSince?: Date;
}
