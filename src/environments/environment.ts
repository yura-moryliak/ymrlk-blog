import {EnvConfigsInterface} from '../app/core/interfaces/env-configs.interface';

export const environment: EnvConfigsInterface = {
  production: true,
  api: {
    baseUrl: 'https://ymrlk-blog-api.onrender.com/api'
  },
  tokens: {
    refresh: {
      domain: 'ymrlk-blog-api.onrender.com',
      path: '/',
      expiresIn: 525600,
      httpOnly: true
    }
  }
};
