FROM node:17.1-alpine
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Start the React app
CMD ["npm", "start"]