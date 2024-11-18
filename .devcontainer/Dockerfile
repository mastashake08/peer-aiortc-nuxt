# Use Node.js LTS as the base image
FROM node:18-bullseye

# Set up environment variables
ENV NODE_ENV=development

# Install system dependencies
RUN apt-get update && apt-get install -y \
    git \
    curl \
    && rm -rf /var/lib/apt/lists/*

# Create a workspace directory
WORKDIR /workspace

# Install global dependencies
RUN npm install -g npm@latest nuxi@latest

# Set user to non-root for security
RUN useradd -ms /bin/bash node
USER node

# Expose Nuxt development server port
EXPOSE 3000

CMD ["npm", "run", "dev"]