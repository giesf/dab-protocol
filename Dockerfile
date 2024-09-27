# Use the official Bun image as a base
FROM bun:latest

# Set the working directory
WORKDIR /app

# Copy package files and install dependencies
COPY package.json bun.lockb ./
RUN bun install

# Copy the rest of your application code
COPY . .

# Expose the port your app runs on
EXPOSE 3000

# Command to run your application
CMD ["bun", "start"]
