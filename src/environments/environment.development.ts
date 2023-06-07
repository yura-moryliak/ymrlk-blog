import {EnvConfigsInterface} from '../app/core/interfaces/env-configs.interface';

export const environment: EnvConfigsInterface = {
  production: false,
  api: {
    baseUrl: 'http://localhost:3000/api'
  },
  tokens: {
    refresh: {
      domain: 'localhost',
      path: '/',
      expiresIn: 525600,
      httpOnly: true
    }
  }
};
