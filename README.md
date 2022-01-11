# Requirements
- Node version >= 16
- Yarn package manager
- Postgre SQL

# Getting Started
- Clone project from `git clone https://github.com/bgavas/didomi-challange`
- Create a database (You can name the database anything. You will later configure environment variables for the db name)
- Set your credentials inside the `.env` file 
- Install dependencies with yarn `yarn install`
- Run migrations `yarn migrate`
- Start the server `yarn start`

# Testing
- Create a test database (You can name the database anything. You will later configure environment variables for the db name)
- Set your credentials inside the `.env.test` file
- Run tests `yarn test`

# Notes
- `.env*` files are supposed to be git-ignored in a real life project, but for easy editing I didn't ignore them
- If you run into `uuid-ossp` issues, create an extension on your created databases `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`
