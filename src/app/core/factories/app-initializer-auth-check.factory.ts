import {AuthService} from '../services/auth.service';

export function appInitializerAuthCheckFactory(authService: AuthService): () => void {
  return (): void => {
    if (authService.getAccessToken()) {
      authService.updateLoggedInStatus(true);
    }
  }
}
