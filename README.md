# Hono OpenAPI Template

This project is a template for building APIs using Hono, OpenAPI, and TypeScript.

## Features

- Built with Hono and TypeScript
- OpenAPI integration for API documentation
- Database integration with Drizzle ORM
- Testing setup with Vitest
- Linting and formatting with ESLint and Prettier
- Environment variable management with dotenv

## Getting Started

### Prerequisites

- Node.js (version specified in package.json)
- pnpm (recommended) or npm
- A Neon DB account and project (for database integration)

To get started with this template, follow these steps:

1. **Clone the repository**: Use the following command to clone the repository:

```bash
git clone git@github.com:radekskrabucha/hono-template.git
```

2. **Install dependencies**: Navigate to the project directory and run the following command to install the dependencies:

```bash
pnpm install
```

3. **Copy env file**: Copy the `.env.example` file to `.env` and fill in the values.

```bash
cp .env.example .env
```

4. **Set up the database**:

   - Create a new project in your Neon DB account
   - Copy the connection string from your Neon DB project
   - Paste the connection string into the `DATABASE_URL` variable in your `.env` file

5. **Start the development server**: Run the following command to start the development server:

```bash
pnpm dev
```

6. **Open the project documentation**: Open your browser and navigate to `http://localhost:4000/api/swagger`. You should see the project documentation.

## Project Structure

- `src/`: Source code
  - `db/`: Database related files (schema, migrations)
  - `lib/`: Utility libraries
  - `middleware/`: Custom middleware
  - `routes/`: API routes
  - `types/`: TypeScript type definitions
  - `utils/`: Utility functions
- `index.ts`: Entry point of the application

## Testing

Run tests using:

```
pnpm test
```

## Linting and Formatting

- Lint: `pnpm run lint`
- Format: `pnpm run format`

## Running with Docker

### Run with Docker Compose

To run the application using Docker Compose, use the following command:

```bash
pnpm run docker:compose
```

This command uses the `docker-compose.yml` file in the project root to set up and run the application.

For different environments, you can set the NODE_ENV variable:

- Development:

  ```
  NODE_ENV=development pnpm run docker:compose
  ```

- Testing:

  ```
  NODE_ENV=test pnpm run docker:compose
  ```

- Production:
  ```
  NODE_ENV=production pnpm run docker:compose
  ```

Make sure to set the `DATABASE_URL` environment variable in your `.env` file to your actual database URL.

### Alternative: Manual Docker Commands

If you prefer to run Docker commands manually, you can use the following instructions:

1. Build the Docker image:

   ```
   docker build -t hono-openapi-app .
   ```

2. Run the container:

   ```bash
   docker run -p 4000:4000 \
     -e DATABASE_URL=postgres://username:password@host:5432/database \
     -e NODE_ENV=development \
     -e LOG_LEVEL=debug \
     -e PORT=4000 \
     hono-openapi-app
   ```

   This command does the following:

   - Maps the container's port 4000 to the host's port 4000
   - Sets environment variables:
     - `DATABASE_URL`: Replace with your actual Neon database URL
     - `NODE_ENV`: Set to 'development' (can be changed to 'production' or 'test' as needed)
     - `LOG_LEVEL`: Set to 'debug' (can be adjusted to 'trace', 'info', 'warn', 'error', 'fatal', or 'silent' as needed)
     - `PORT`: Set to 4000 (can be changed if you want to use a different port)
   - Uses the `hono-openapi-app` image we built earlier

Note: Make sure you have Docker and Docker Compose installed on your system before running these commands.
