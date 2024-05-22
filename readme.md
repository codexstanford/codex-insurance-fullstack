# Get it running

## Prerequisites

Node.js and [pnpm]() must be installed. This project uses [pnpm's workspace](https://pnpm.io/workspaces) feature for the monorepo structure.

## Commands

1. Run `pnpm install` in the project directory.
2. If there is no `sqlite.db` file in `apps/server/var`, create it by running `pnpm db:push`.
3. Create a `.env` file with the required environmental variables. This file is gitignored for security reasons. You can either obtain it securely from someone who has it on his or her machine or create a new one by copying `apps/server/.env.blueprint` and renaming it to `.env`.
4. Run `pnpm dev` to start the development server. It will watch for file changes and rebuild the app. Note that this is only a development server and may lack some production functionality.

## Setting Up AWS EC2

### Preparation

1. Place the `.pem` key file in the project root and rename it to `ssh-key.pem` (this file is gitignored).
2. Run `pnpm ssh:connect` on a UNIX machine to connect to the server.
3. Follow [these instructions](https://nodejs.org/en/download/package-manager) to install Node.js on the server.
4. Install pnpm: `curl -fsSL https://get.pnpm.io/install.sh | sh -`.
5. Install pm2: `pnpm install pm2 -g`.

This setup allows you to upload code, install dependencies, and run the server using pm2. To automate this, set up continuous integration.

### Continuous Integration

1. Add the key as a repository secret on [this GitHub page](https://github.com/codexstanford/codex-insurance-fullstack/settings/secrets/actions), naming it `SSH_PRIVATE_KEY`.
2. Push a commit to the main branch to trigger the action defined in `.github/workflows/deploy-ec2.yaml`, which will build and transfer the app to EC2.
3. Start the Node.js server from the SSH terminal: `pm2 start ~/codex-insurance-fullstack/apps/server/build/index.js --watch`.

# Constraints

- As of April 1, '24, the app only supports Google login using [Paul's](mailto:paul.f.welter@gmail.com) private Google account for testing purposes. Contact Paul to add other Google accounts for testing or register the app with Google as a production app and update the `.env` file accordingly.

# Misc

- The ORM we use, [Drizzle](https://orm.drizzle.team), includes an admin interface called Drizzle Studio. It allows you to read and edit the database. Start it by running `pnpm db:studio`. The link to the studio will appear in the command prompt.

# Known bugs

- If you are not logged in, press save in the claim form, and login, you'll be redirected to the respective /claim/... url. It might happen that the changes you have saved before become reflected in the form only after you refresh the page.
