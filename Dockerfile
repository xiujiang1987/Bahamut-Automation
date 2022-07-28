FROM ubuntu:latest as base

SHELL [ "/bin/bash", "-ic" ]
RUN rm /var/cache/ldconfig/aux-cache && /sbin/ldconfig.real && apt update && apt -y install curl libatomic1
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
RUN nvm install --lts
RUN npm i -g pnpm

FROM base as builder

WORKDIR /app
COPY . .
RUN pnpm i && pnpm build

FROM base as pure

WORKDIR /app
COPY --from=builder /app .
RUN pnpm i -P

COPY example/config.yml /config.yml
CMD node dist/core/cli/index.js -c /config.yml

FROM pure as chromium
RUN node /app/dist/core/cli/index.js install chromium

FROM pure as firefox
RUN node /app/dist/core/cli/index.js install firefox

FROM pure as webkit
RUN node /app/dist/core/cli/index.js install webkit

FROM chromium as all
RUN node /app/dist/core/cli/index.js install firefox
RUN node /app/dist/core/cli/index.js install webkit
