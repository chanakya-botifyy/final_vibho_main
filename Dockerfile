FROM node:18-alpine

# Create app directory
WORKDIR /usr/src/app

# Install app dependencies
# A wildcard is used to ensure both package.json AND package-lock.json are copied
COPY package*.json ./
COPY server/package*.json ./server/

# Install dependencies
RUN npm ci
RUN cd server && npm ci

# Bundle app source
COPY . .

# Build the frontend
RUN npm run build

# Expose port
EXPOSE 3001

# Start the server
CMD ["node", "server/index.js"]