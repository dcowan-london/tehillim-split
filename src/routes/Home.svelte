<script>
  import { navigate } from "svelte-navigator/src/history";
  import {
    account,
    checkloggedin,
    database,
    logOut,
    loggedInUser,
    teams,
  } from "../lib/appwrite";
  import { Link } from "svelte-navigator";
  import Header from "../lib/Header.svelte";
  import { Query } from "appwrite";

  // navigate("/login", {});

  // console.log(loggedInUser);

  checkloggedin();

  const lists = teams.list();
</script>

<main class="container m-5">
  <Header />

  <div class="my-5">
    <h1 class="text-2xl">My Lists</h1>
    {#await lists}
      Loading...
    {:then lists}
      {#if lists.teams.length == 0}
        You have no lists yet! <Link to="/lists/create" class="text-blue-400"
          >Create one now</Link
        >
      {:else}
        {#each lists.teams as list}
          <p class="mt-2">
            <Link class="text-blue-400" to="/list/{list['$id']}"
              >{list["name"]}</Link
            ><br />
          </p>
        {/each}
        <p class="mt-3">
          <Link
            class="dark:bg-gray-600 bg-gray-400 text-white border p-1 mt-2 rounded"
            to="/lists/create">Create new list</Link
          >
        </p>
      {/if}
    {/await}
  </div>
</main>
