FROM mcr.microsoft.com/playwright:v1.21.0-focal

WORKDIR /usr/src/app
COPY package.json pnpm-lock.yaml dist ./
RUN npx -y pnpm i -P

COPY example/config.yml /config.yml
CMD node lib/core/cli.js -m 1 -c /config.yml
