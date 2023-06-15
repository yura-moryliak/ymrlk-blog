export interface UserInterface {
  firstName?: string;
  lastName?: string;
  email?: string;
  subdomain?: string;
  bio?: string;
  location?: string;
  socialProfiles?: Array<{ title: string, link: string }>;
  avatarSrc?: string;
  uuid?: string;
}
