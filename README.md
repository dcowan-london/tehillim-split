# Tehillim Split
This is a web application to split Sefer Tehillim between a group of people. You can create a list split by either perek or day of month and share it with other users.

Currently live at https://tehillim-split.dovicowan.dev

## Github
The Github repo is a mirror of the repo on my self-hosted Git server at https://git.fnukhosting.net/dcowan/tehillim-split.

## Building it yourself
Tehillim Split is built on top of Appwrite BaaS and the frontend is Svelte+Vite. To host it yourself, you'll either need your own Appwrite self hosted instance, or you can use [Appwrite Cloud](cloud.appwrite.io).

### Deploy to Appwrite
1. Set up the Appwrite CLI, and connect it to your Appwrite instance with `$ appwrite login`
2. Create a new Project with `$ appwrite init project`.
3. Deploy the DB with `$ appwrite deploy collection`. Select all Collections.
4. Update `VITE_APPWRITE_ENDPOINT` and `VITE_APPWRITE_PROJECT_ID` in `.env`.

### Deploy frontend
`npm install` + `npm run dev` / `npm run build`.

**NOTICE:** You need to add a platform from the Appwrite Console when deploying to production, otherwise you'll get a CORS error. Wildcards are not supported in the Hostname field.