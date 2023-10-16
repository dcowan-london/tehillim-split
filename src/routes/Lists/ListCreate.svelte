<script>
  import { Permission, Role } from "appwrite";
  import Header from "../../lib/Header.svelte";
  import {
    ID,
    account,
    database,
    loggedInUser,
    teams,
  } from "../../lib/appwrite";

  let listname = "";
  let requireLoggedIn = false;

  function createList(e) {
    e.preventDefault();

    database
      .createDocument("tehillim-split", "lists", ID.unique(), {
        title: listname,
        require_logged_in: requireLoggedIn,
        owner_id: loggedInUser["$id"],
      })
      .then((r) => {
        teams.create(r["$id"], listname).then((r) => {
          let permissions = [
            Permission.read(Role.user(loggedInUser["$id"])),
            Permission.read(Role.team(r["$id"])),
            Permission.write(Role.team("admins-" + r["$id"])),
          ];

          if (requireLoggedIn == false) {
            permissions.push(Permission.read(Role.any()));
          }

          teams.create("admins-" + r["$id"], listname + " Admins").then(() => {
            console.log(r);
            database.updateDocument(
              "tehillim-split",
              "lists",
              r["$id"],
              {},
              permissions,
            );
          });
        });
        console.log(r);
      });
  }
</script>

<main class="container m-5">
  <Header />

  <div class="my-5">
    <form on:submit={createList}>
      <fieldset
        class="container justify-center p-2 border border-black dark:border-current"
      >
        <legend class="text-2xl">Create new list</legend>

        <input
          class="dark:bg-gray-500 dark:placeholder-white border border-black dark:border-current rounded p-1"
          type="text"
          placeholder="List name"
          bind:value={listname}
          required
        /> <br />

        <input
          class="w-5 h-5 border-solid border-white my-3"
          name="requireLoggedIn"
          id="requireLoggedIn"
          type="checkbox"
          bind:value={requireLoggedIn}
        />
        <label for="requireLoggedIn"
          >Require users to be logged in to sign up for this list?</label
        ><br />

        <button
          class="dark:bg-gray-600 hover:bg-gray-500 bg-gray-400 border p-1 mt-2 rounded"
          type="submit">Create</button
        >
      </fieldset>
    </form>
  </div>
</main>
