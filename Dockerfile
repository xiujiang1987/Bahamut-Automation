FROM --platform=$BUILDPLATFORM jacoblincool/playwright:pnpm as common-builder

WORKDIR /app
COPY . .
RUN pnpm i && pnpm build

FROM jacoblincool/playwright:pnpm as builder

COPY --from=common-builder /app /app
WORKDIR /app
RUN pnpm rebuild && pnpm prune --prod

FROM jacoblincool/playwright:chromium as chromium

COPY --from=builder /app /app
RUN cd /app && pnpm link --global
COPY example/config.yml /config.yml
CMD ba -c /config.yml -o browser.type=chromium -o browser.executablePath=$(echo /root/.cache/ms-playwright/chromium-*/chrome-linux/chrome)

FROM jacoblincool/playwright:firefox as firefox

COPY --from=builder /app /app
RUN cd /app && pnpm link --global
COPY example/config.yml /config.yml
CMD ba -c /config.yml -o browser.type=firefox -o browser.executablePath=$(echo /root/.cache/ms-playwright/firefox-*/firefox/firefox)

FROM jacoblincool/playwright:webkit as webkit

COPY --from=builder /app /app
RUN cd /app && pnpm link --global
COPY example/config.yml /config.yml
CMD ba -c /config.yml -o browser.type=webkit -o browser.executablePath=$(echo /root/.cache/ms-playwright/webkit-*/minibrowser-wpe/MiniBrowser)

FROM jacoblincool/playwright:chrome as chrome

COPY --from=builder /app /app
RUN cd /app && pnpm link --global
COPY example/config.yml /config.yml
CMD ba -c /config.yml -o browser.type=chromium -o browser.executablePath=/usr/bin/google-chrome -o browser.channel=chrome

FROM jacoblincool/playwright:msedge as msedge

COPY --from=builder /app /app
RUN cd /app && pnpm link --global
COPY example/config.yml /config.yml
CMD ba -c /config.yml -o browser.type=chromium -o browser.executablePath=/usr/bin/microsoft-edge -o browser.channel=msedge

FROM jacoblincool/playwright:all as all

COPY --from=builder /app /app
RUN cd /app && pnpm link --global
COPY example/config.yml /config.yml
CMD ba -c /config.yml

# Not available for arm/v7
FROM jacoblincool/playwright:chromium-light as chromium-light

COPY --from=builder /app /app
RUN cd /app && npm link
COPY example/config.yml /config.yml
CMD ba -c /config.yml -o browser.type=chromium -o browser.executablePath=/usr/bin/chromium
