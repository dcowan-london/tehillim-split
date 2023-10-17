<script>
  import { navigate } from "svelte-navigator/src/history";
  import {
    account,
    checkloggedin,
    database,
    logOut,
    loggedInUser,
  } from "../lib/appwrite";
  import { Link } from "svelte-navigator";
  import Header from "../lib/Header.svelte";

  // navigate("/login", {});

  // console.log(loggedInUser);

  checkloggedin();

  const lists = database.listDocuments(
    import.meta.env.VITE_APPWRITE_DB_ID,
    "lists",
  );
</script>

<main class="container m-5">
  <Header />

  <div class="my-5">
    <h1 class="text-2xl">My Lists</h1>
    {#await lists}
      Loading...
    {:then lists}
      {#if lists.total == 0}
        You have no lists yet! <Link to="/lists/create" class="text-blue-400"
          >Create one now</Link
        >
      {/if}
      {#each lists.documents as list}
        <Link class="text-blue-400" to="/list/{list['$id']}">{list['title']}</Link><br>
      {/each}
      <Link class="text-blue-400" to="/lists/create">Create new list</Link>
    {/await}
  </div>
</main>
