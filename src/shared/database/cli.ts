import 'reflect-metadata';
import * as path from 'path';
import * as process from 'process';
import { exec } from 'child_process';

const args = process.argv.slice(2);

const databaseFolder = path.resolve(__dirname);
const migrationsFolder = path.resolve(databaseFolder, 'migrations');
const dataSource = path.join(databaseFolder, `datasource.ts`);

const parameters = [...args];

if (parameters.includes('query')) {
  const index = parameters.findIndex((parametro) => parametro === 'query');
  parameters[index + 1] = `"${parameters[index + 1]}"`;
}

if (
  ['migration:create', 'migration:generate'].some((command) =>
    parameters.includes(command),
  )
) {
  const namedFileIndex = parameters.findIndex(
    (parameter) =>
      parameter.startsWith('--name=') || parameter.startsWith('-n='),
  );
  const simpleNameIndex = parameters.findIndex(
    (parameter) => parameter === '--name' || parameter === '-n',
  );

  let fileName = '';

  if (namedFileIndex !== -1) {
    fileName = parameters[namedFileIndex].split('=').pop();
    parameters[namedFileIndex] = `"${path.join(migrationsFolder, fileName)}"`;
  } else if (simpleNameIndex !== -1) {
    fileName = parameters[simpleNameIndex + 1];

    parameters[simpleNameIndex + 1] = `"${path.join(
      migrationsFolder,
      fileName,
    )}"`;
    parameters.splice(simpleNameIndex, 1);
  }
}

if (
  [
    'migration:generate',
    'migration:run',
    'migration:revert',
    'query',
    'migration:show',
  ].includes(parameters[0])
) {
  parameters.push(`--dataSource="${dataSource}"`);
}

const typeORMCommand = `node --require ts-node/register -r tsconfig-paths/register  ./node_modules/typeorm/cli ${parameters.join(
  ' ',
)}`;

exec(typeORMCommand, { maxBuffer: 1024 * 1024 * 2 }, (error, stdout) => {
  console.log(stdout);

  if (error) {
    console.error(error);
  }

  if (error) {
    process.exit(1);
  }
});
