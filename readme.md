# Get it running

## Prerequisites

Node.js and [pnpm]() must be installed. This project uses [pnpm's workspace](https://pnpm.io/workspaces) feature for the monorepo structure.

## Commands

1. Run `pnpm install` in the project directory.
2. If there is no `sqlite.db` file in `apps/server/var`, create it by running `pnpm db:push`.
3. Create a `.env` file with the required environmental variables. This file is gitignored for security reasons. You can either obtain it securely from someone who has it on his or her machine or create a new one by copying `apps/server/.env.blueprint` and renaming it to `.env`.
4. Run `pnpm dev` to start the development server. It will watch for file changes and rebuild the app. Note that this is only a development server and may lack some production functionality.

# Constraints

- As of April 1, '24, the app only supports Google login using [Paul's](mailto:paul.f.welter@gmail.com) private Google account for testing purposes. Contact Paul to add other Google accounts for testing or register the app with Google as a production app and update the `.env` file accordingly.

# Misc

- The ORM we use, [Drizzle](https://orm.drizzle.team), includes an admin interface called Drizzle Studio. It allows you to read and edit the database. Start it by running `pnpm db:studio`. The link to the studio will appear in the command prompt.

# Known bugs

- If you are not logged in, press save in the claim form, and login, you'll be redirected to the respective /claim/... url. It might happen that the changes you have saved before become reflected in the form only after you refresh the page.
