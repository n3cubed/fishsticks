# Base Image
FROM node:22-alpine

WORKDIR /app
# install dependencies
COPY ./package.json ./
RUN npm install
COPY . .

# Default command
CMD ["npm", "start"]