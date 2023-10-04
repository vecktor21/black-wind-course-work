FROM node:18-alpine
RUN yarn add net-tools
WORKDIR /app
COPY package-lock.json .
WORKDIR /app/server
COPY server/package.json .
COPY server/package-lock.json .
#RUN apk add --update --no-cache python3 && ln -sf python3 /usr/bin/python
#RUN apk add --no-cache make gcc g++ python3 
RUN npm install 
#RUN npm rebuild bcrypt --build-from-source 
#RUN apk del make gcc g++ python
#RUN npm install -g package.json
COPY server/ .
EXPOSE 5000
CMD ["node","index.js"]
