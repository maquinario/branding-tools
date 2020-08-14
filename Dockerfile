FROM node:12
WORKDIR /usr/src/branding-tools
COPY ./package.json .
RUN npm install --only=prod