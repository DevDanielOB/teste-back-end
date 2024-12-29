FROM node:20.17-slim

WORKDIR /usr/app

COPY package.json ./
COPY .env ./
COPY wait-for-sqlserver.sh ./
COPY nest-cli.json ./
COPY tsconfig.build.json ./
COPY tsconfig.json ./
COPY src ./src


ENV PORT=3498
ENV TYPEORM_APPLY_MIGRATION_ON_STARTUP='Y'

RUN npm install
RUN npm run build

RUN chmod +x wait-for-sqlserver.sh

RUN rm -rf /usr/app/dist/infra/database/migrations

RUN npm prune --production --force

RUN chown -R node:node /usr/app

USER node

WORKDIR /usr/app/dist


EXPOSE ${PORT}

CMD ["npm", "run", "start:prod"]
