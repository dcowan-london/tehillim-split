<script>
  import { Permission, Role } from "appwrite";
  import Header from "../../lib/Header.svelte";
  import {
    ID,
    account,
    checkloggedin,
    database,
    loggedInUser,
    teams,
  } from "../../lib/appwrite";
  import { navigate } from "svelte-navigator/src/history";

  checkloggedin();

  let listname = "";
  let requireLoggedIn = false;
  let list_type = "";

  function createList(e) {
    e.preventDefault();

    database
      .createDocument("tehillim-split", "lists", ID.unique(), {
        title: listname,
        require_logged_in: !!requireLoggedIn,
        owner_id: loggedInUser["$id"],
        list_type: list_type
      })
      .then((r) => {
        teams.create(r["$id"], listname, ["owner"]).then((r) => {
          let permissions = [
            Permission.read(Role.user(loggedInUser["$id"])),
            Permission.read(Role.team(r["$id"])),
            Permission.write(Role.team(r["$id"], "owner")),
            Permission.delete(Role.team(r["$id"], "owner")),
          ];

          if (requireLoggedIn == false) {
            permissions.push(Permission.read(Role.any()));
          }

          database
            .updateDocument(
              "tehillim-split",
              "lists",
              r["$id"],
              {},
              permissions,
            )
            .then(() => {
              navigate("/list/" + r["$id"], {});
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
          class="dark:bg-gray-500 dark:placeholder-white border border-black dark:border-current rounded p-2 w-72"
          type="text"
          placeholder="List name"
          bind:value={listname}
          required
        /> <br />

        <select
          class="dark:bg-gray-500 dark:placeholder-white border border-black dark:border-current rounded p-2 mt-2 w-72"
          placeholder="Split Tehillim by"
          bind:value={list_type}
          required
        >
          <option value="" selected disabled>Split Tehillim by</option>
          <option value="perakim">Perakim</option>
          <option value="month">Days of the month</option>
        </select> <br />

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
