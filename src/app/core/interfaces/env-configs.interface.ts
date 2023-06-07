export interface EnvConfigsInterface {
  production: boolean;
  api: {
    baseUrl: string;
  },
  tokens: {
    refresh: {
      domain: string;
      path: string;
      expiresIn: number;
      httpOnly: boolean;
    }
  }
}
