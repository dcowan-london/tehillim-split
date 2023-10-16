import { Account, Client, Databases, Teams } from 'appwrite';
import { navigate } from 'svelte-navigator';

const appwrite = new Client();

appwrite
    .setEndpoint("https://api.fnukapps.com/v1")
    .setProject("6524683fc8d947fe9a07")


export const account = new Account(appwrite);
export const teams = new Teams(appwrite);

export const logOut = async() => {
    await account.deleteSession("current");
    window.location.reload();
}

export const database = new Databases(appwrite);

export let loggedInUser = null;

await account.get().then((r) => {
    loggedInUser = r;
}).catch(() => {
    loggedInUser = null;
})

export function checkloggedin() {
    if (loggedInUser == null) {
        window.location.href = "/login";
    }
}

export { ID } from 'appwrite';