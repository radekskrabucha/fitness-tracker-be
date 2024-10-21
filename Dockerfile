# Use Node.js 22-alpine as the base image
FROM node:22-alpine AS builder

# Set the working directory in the container
WORKDIR /usr/src/app

# Add build argument for NODE_ENV with a default value
ARG NODE_ENV=production
# Set environment variable
ENV NODE_ENV=${NODE_ENV}

# Copy package.json and pnpm-lock.yaml before installing dependencies
COPY package.json pnpm-lock.yaml ./

# Install pnpm globally and install project dependencies based on the frozen lockfile
RUN npm install -g pnpm && pnpm install --frozen-lockfile

# Copy the rest of your app's source code
COPY . .

# Build your app
RUN pnpm run build

# --- Production stage ---
FROM node:22-alpine AS production

# Set the working directory
WORKDIR /usr/src/app

# Add build argument for NODE_ENV with a default value
ARG NODE_ENV=production
# Set environment variable
ENV NODE_ENV=${NODE_ENV}

# Copy only the built app and necessary files for production
COPY --from=builder /usr/src/app/dist ./dist
COPY package.json pnpm-lock.yaml ./

# Install production dependencies only
RUN npm install -g pnpm && pnpm install --frozen-lockfile --prod

# Expose the port your app will run on
EXPOSE ${PORT:-4000}

# Run your app
CMD ["pnpm", "start"]
