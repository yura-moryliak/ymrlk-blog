import {AuthService} from '../services/auth.service';
import {UsersService} from '../services/users.service';

export function appUserPrefetchInitializerFactory(authService: AuthService, usersService: UsersService) {
  return authService.getAccessToken() ?
    () => usersService.getUserByUUID() :
    () => null;
}
