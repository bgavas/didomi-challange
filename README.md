# Requirements
- Node version >= 16
- Yarn package manager
- Postgre SQL

# Getting Started
- Clone project from `git clone https://github.com/bgavas/didomi-challange`
- Create a database (You can name the database anything. You will later configure environment variables for the db name)
- Create extension on your database `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";` (More info about creating extension below)
- Set your credentials inside the `.env` file 
- Install dependencies with yarn `yarn install`
- Run migrations `yarn migrate`
- Start the server `yarn start`

# Testing
- Create a test database (You can name the database anything. You will later configure environment variables for the db name)
- Create extension on your test database `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";` (More info about creating extension below)
- Set your credentials inside the `.env.test` file
- Run tests `yarn test`

# Creating extension
- Connect to your postgre server with `psql`
- Connect to your database `\c dbName`
- Run the command `CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`

# Notes
- `.env*` files are supposed to be git-ignored in a real life project, but for easy editing I didn't ignore them
- You can find swagger docs under `http://localhost:4545/docs/#/`

# Sample Requests
## User
- Create User
  - POST: http://localhost:4545/api/users
  - Payload: 
  ```
  {
    "email": "didomi@test.com"
  }
  ```

- Delete User
  - DELETE: http://localhost:4545/api/users/:userId

- Get User
  - GET: http://localhost:4545/api/users/:userId

- Get Users
  - GET: http://localhost:4545/api/users

## Event
- Create event
  - POST: http://localhost:4545/api/events/consents
  - Payload:
  ```
  {
    "userId": "userId",
    "consents": [{
      "id": "email_notifications",
      "enabled": false
    }, {
      "id": "sms_notifications",
      "enabled": true
    }]
  }
  ```
