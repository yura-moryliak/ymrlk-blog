import {EnvConfigsInterface} from '../app/_a_core/interfaces/env-configs.interface';

export const environment: EnvConfigsInterface = {
  production: true,
  client: {
    baseUrl: 'https://ymrlk-blog.onrender.com'
  },
  api: {
    baseUrl: 'https://ymrlk-blog-api.onrender.com/api'
  }
};
