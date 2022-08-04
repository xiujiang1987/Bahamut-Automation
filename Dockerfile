FROM jacoblincool/playwright:chromium as chromium

RUN pnpm i -g bahamut-automation
COPY example/config.yml /config.yml
CMD ba -c /config.yml -o browser.type=chromium -o browser.executablePath=$(echo /root/.cache/ms-playwright/chromium-*/chrome-linux/chrome)

FROM jacoblincool/playwright:firefox as firefox

RUN pnpm i -g bahamut-automation
COPY example/config.yml /config.yml
CMD ba -c /config.yml -o browser.type=firefox -o browser.executablePath=$(echo /root/.cache/ms-playwright/firefox-*/firefox/firefox)

FROM jacoblincool/playwright:webkit as webkit

RUN pnpm i -g bahamut-automation
COPY example/config.yml /config.yml
CMD ba -c /config.yml -o browser.type=webkit -o browser.executablePath=$(echo /root/.cache/ms-playwright/webkit-*/minibrowser-wpe/MiniBrowser)

FROM jacoblincool/playwright:chrome as chrome

RUN pnpm i -g bahamut-automation
COPY example/config.yml /config.yml
CMD ba -c /config.yml -o browser.type=chromium -o browser.executablePath=/usr/bin/google-chrome -o browser.channel=chrome

FROM jacoblincool/playwright:msedge as msedge

RUN pnpm i -g bahamut-automation
COPY example/config.yml /config.yml
CMD ba -c /config.yml -o browser.type=chromium -o browser.executablePath=/usr/bin/microsoft-edge -o browser.channel=msedge

FROM jacoblincool/playwright:all as all

RUN pnpm i -g bahamut-automation
COPY example/config.yml /config.yml
CMD ba -c /config.yml

# Not available for arm/v7
FROM jacoblincool/playwright:chromium-light as chromium-light

RUN pnpm i -g bahamut-automation
COPY example/config.yml /config.yml
CMD ba -c /config.yml -o browser.type=chromium -o browser.executablePath=/usr/bin/chromium
