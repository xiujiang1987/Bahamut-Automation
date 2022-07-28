FROM ubuntu:latest as base

SHELL [ "/bin/bash", "-ic" ]
RUN bash -c 'rm /var/cache/ldconfig/aux-cache && /sbin/ldconfig.real && apt update && apt -y install curl libatomic1'
RUN curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
RUN nvm install --lts && npm i -g pnpm

FROM base as builder

WORKDIR /app
COPY . .
RUN pnpm i && pnpm build && pnpm i -P

FROM base as chromium-base
RUN pnpm dlx playwright-core install --with-deps chromium

FROM base as firefox-base
RUN pnpm dlx playwright-core install --with-deps firefox

FROM base as webkit-base
RUN pnpm dlx playwright-core install --with-deps webkit

FROM chromium-base as all-base
RUN pnpm dlx playwright-core install --with-deps firefox
RUN pnpm dlx playwright-core install --with-deps webkit

FROM chromium-base as chromium

WORKDIR /app
COPY --from=builder /app .

COPY example/config.yml /config.yml
CMD node dist/core/cli/index.js -c /config.yml

FROM firefox-base as firefox

WORKDIR /app
COPY --from=builder /app .

COPY example/config.yml /config.yml
CMD node dist/core/cli/index.js -c /config.yml

FROM webkit-base as webkit

WORKDIR /app
COPY --from=builder /app .

COPY example/config.yml /config.yml
CMD node dist/core/cli/index.js -c /config.yml

FROM all-base as all

WORKDIR /app
COPY --from=builder /app .

COPY example/config.yml /config.yml
CMD node dist/core/cli/index.js -c /config.yml
