# ------------------------------------------------------
# Client Build
# ------------------------------------------------------
FROM node:16.20.2-buster as clientBuilder

# Set working directory in the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY client/package*.json ./client/

# Install dependencies
RUN cd client && npm install

# Copy the rest of the client code
COPY ./client ./client

# Build the client
RUN cd client && npm run build


# ------------------------------------------------------
# Server Build
# ------------------------------------------------------
FROM node:16.20.2-buster as serverBuilder

# Set working directory in the container
WORKDIR /usr/src/app

COPY --from=clientBuilder /usr/src/app/client/build /usr/src/app/client/build

# copy server 
COPY ./server ./server
RUN cd server && npm install

# Copy package.json and package-lock.json
COPY package*.json ./

# Install dependencies
RUN npm install

COPY .  .

# Build the client
CMD ["npm", "start"]