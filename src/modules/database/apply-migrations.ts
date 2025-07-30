import { exec } from 'child_process';
import { DatabaseEnvironment } from '../../shared/environment/classes/database.env';

export async function applyMigrations(envDatabase: DatabaseEnvironment) {
  if (envDatabase?.executeMigrationOnStartup) {
    return new Promise((resolve) => {
      exec('npm run typeorm migration:run', (error, stdout) => {
        if (error) {
          console.error(`Error executing migration: ${error}`);

          return resolve(false);
        }
        if (stdout) {
          console.info(`${stdout}`);
          return resolve(true);
        }

        console.log('All migrations applied successfully');
        return resolve(true);
      });
    });
  }
  return null;
}
