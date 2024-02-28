# ------------------------------------------------------
# Server Build
# ------------------------------------------------------
FROM node:16.20.2-buster as serverBuilder

# Set working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY server/package*.json ./

RUN npm install

# copy server 
COPY ./server ./
COPY ./client/src/interface.ts ../client/src/interface.ts
COPY ./tsconfig.json ../tsconfig.json

# Start the server
CMD ["npm", "start"]