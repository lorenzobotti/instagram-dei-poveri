FROM node AS dev

WORKDIR /usr/app
COPY . .

RUN npm install
RUN npm install -g typescript nodemon ts-node

ENV PORT 80
CMD ["nodemon", "src/main.ts"]
# CMD ["cat", "/usr/app/src/main.ts"]


# -----------------------

FROM node AS builder

WORKDIR /usr/app
COPY . .

RUN npm install
RUN npm install -g typescript

CMD ["tsc"]

# -----------------------

FROM builder AS prod

COPY --from=builder /usr/app/dist ./src
COPY --from=builder /usr/app/node_modules ./node_modules

ENV NODE_ENV=production
CMD ["node", "dist/main.js"]