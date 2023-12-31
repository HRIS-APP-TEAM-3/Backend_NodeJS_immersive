FROM node:18-alpine
ENV NODE_ENV=production
WORKDIR /usr/src/app
COPY ["package.json", "package-lock.json*", "npm-shrinkwrap.json*", "./"]
RUN npm install --production --silent && mv node_modules ../
RUN npm install -g pm2
COPY . .
EXPOSE 8000
RUN chown -R node /usr/src/app
USER node
CMD ["npm", "run", "start-prod"]
