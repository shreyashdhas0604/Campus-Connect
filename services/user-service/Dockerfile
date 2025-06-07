FROM node:18-alpine
WORKDIR /usr/src/app
COPY package*.json ./
RUN npm install
RUN npm install -g nodemon ts-node typescript
COPY . .
RUN npx prisma generate
EXPOSE 8081
CMD ["npm", "run", "dev"]
