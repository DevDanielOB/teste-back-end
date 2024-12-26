import datasource from './datasource';
import { DataSource } from 'typeorm';
import { TypeormExtensions } from './extensions';

export const databaseProviders = [
  {
    provide: DataSource,
    useFactory: async () => {
      const sourceData = await datasource.initialize();
      TypeormExtensions.config(sourceData);
      return sourceData;
    },
  },
];
