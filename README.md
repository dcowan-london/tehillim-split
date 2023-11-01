# Tehillim Split
This is a web application to split Sefer Tehillim between a group of people. You can create a list split by either perek or day of month and share it with other users.

Currently live at https://tehillim-split.dovicowan.dev

Tehillim Split is build on Appwrite BaaS. Config files and setting your own Appwrite endpoint coming soon, but for now you can set your endpoint in `src/lib/appwrite.js` and your project ID as env `VITE_APPWRITE_DB_ID`.

Frontend in Svelte, run `npm install` + `npm run dev` to run locally.

## Github
The Github repo is a mirror of the repo on my self-hosted Git server at https://git.fnukhosting.net/dcowan/tehillim-split.