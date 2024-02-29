# ------------------------------------------------------
# Client Build
# ------------------------------------------------------
FROM node:20-alpine3.18 as clientBuilder

# Set working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY client/package*.json ./

# Install dependencies
RUN npm install

# Copy the rest of the client code
COPY ./client .
COPY ./tsconfig.json ../tsconfig.json

# Build the client
CMD ["npm", "start"]