import {EnvConfigsInterface} from '../app/core/interfaces/env-configs.interface';

export const environment: EnvConfigsInterface = {
  production: false,
  client: {
    baseUrl: 'http://localhost:4200'
  },
  api: {
    baseUrl: 'http://localhost:3000/api'
  }
};
