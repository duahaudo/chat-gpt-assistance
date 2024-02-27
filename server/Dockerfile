# ------------------------------------------------------
# Server Build
# ------------------------------------------------------
FROM node:16.20.2-buster as serverBuilder

# Set working directory in the container
WORKDIR /usr/src/app

# copy server 
COPY ./server ./
RUN npm install

COPY ./client/src/interface.ts ../client/src/interface.ts
COPY ./tsconfig.json ../tsconfig.json

# Start the server
CMD ["npm", "start"]