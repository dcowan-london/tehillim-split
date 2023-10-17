<script>
  import { ID, Permission, Query, Role } from "appwrite";
  import Header from "../../lib/Header.svelte";
  import { database, loggedInUser } from "../../lib/appwrite";
  import { Link } from "svelte-navigator";

  export let id;

  let list = database.getDocument("tehillim-split", "lists", id);
  let perakim = [];
  let perakimPromise = database
    .listDocuments("tehillim-split", "perakim", [Query.equal("list_id", [id])])
    .then((r) => {
      perakim = r.documents;
    });

  const perekIndex = (i) => {
    let index = perakim.findIndex((e) => e.perek == i);
    return index;
  };

  function takePerek(perek) {}

  function takeNewPerek(perek) {
    console.log(perek);
    database
      .createDocument(
        "tehillim-split",
        "perakim",
        ID.unique(),
        {
          list_id: id,
          perek: perek,
          taken: true,
          taken_by: loggedInUser["$id"],
          taken_by_name: loggedInUser['name']
        },
        [
          Permission.read(Role.team(id)),
          Permission.write(Role.user(loggedInUser["$id"])),
        ],
      )
      .then(() => {
        perakimPromise = database
          .listDocuments("tehillim-split", "perakim", [
            Query.equal("list_id", [id]),
          ])
          .then((r) => {
            perakim = r.documents;
          });
      });
  }

  function completePerek(perek) {
    let perekDBId = perakim[perekIndex(perek)]["$id"];

    database
      .updateDocument("tehillim-split", "perakim", perekDBId, {
        completed: true,
      })
      .then(() => {
        perakimPromise = database
          .listDocuments("tehillim-split", "perakim", [
            Query.equal("list_id", [id]),
          ])
          .then((r) => {
            perakim = r.documents;
          });
      });
  }

  function uncompletePerek(perek) {
    let perekDBId = perakim[perekIndex(perek)]["$id"];

    database
      .updateDocument("tehillim-split", "perakim", perekDBId, {
        completed: false,
      })
      .then(() => {
        perakimPromise = database
          .listDocuments("tehillim-split", "perakim", [
            Query.equal("list_id", [id]),
          ])
          .then((r) => {
            perakim = r.documents;
          });
      });
  }

  function untakePerek(perek) {
    let perekDBId = perakim[perekIndex(perek)]["$id"];

    database.deleteDocument("tehillim-split", "perakim", perekDBId).then(() => {
      perakimPromise = database
        .listDocuments("tehillim-split", "perakim", [
          Query.equal("list_id", [id]),
        ])
        .then((r) => {
          perakim = r.documents;
        });
    });
  }
</script>

<main class="container m-5">
  <Header />

  <div class="my-5">
    <Link class="text-blue-400" to="/">Home</Link>
    {#await list}
      Loading...
    {:then list}
      <h1 class="text-2xl">List {list.title}</h1>
      <br />
      <Link class="text-blue-400" to="/list/{id}/members">Members</Link><br />
      {#await perakimPromise then perakimResolved}
        {#each Array.from(Array(150 + 1).keys()).slice(1) as i}
          {#if perekIndex(i) !== -1}
            {#if perakim[perekIndex(i)].taken == false}
              Perek {i}
              <button
                on:click={() => takePerek(i)}
                class="dark:bg-gray-600 bg-gray-400 border p-1 mt-2 rounded"
                >Take</button
              >
            {:else if perakim[perekIndex(i)].taken_by == loggedInUser["$id"] && perakim[perekIndex(i)].completed !== true}
              Perek {i}
              <button
                on:click={() => untakePerek(i)}
                class="dark:bg-gray-600 bg-gray-400 border p-1 mt-2 rounded"
                >Untake</button
              >
              <button
                on:click={() => completePerek(i)}
                class="dark:bg-gray-600 bg-gray-400 border p-1 mt-2 rounded"
                >Complete</button
              >
            {:else if perakim[perekIndex(i)].taken_by == loggedInUser["$id"] && perakim[perekIndex(i)].completed == true}
              Perek {i}
              <button
                on:click={() => uncompletePerek(i)}
                class="dark:bg-gray-600 bg-gray-400 border p-1 mt-2 rounded"
                >Uncomplete</button
              >
            {:else if perakim[perekIndex(i)].completed == false}
              Perek {i} - Taken by {perakim[perekIndex(i)].taken_by_name}
            {:else}
              Perek {i} - Completed by {perakim[perekIndex(i)].taken_by_name}
            {/if}
          {:else}
            Perek {i}
            <button
              on:click={() => takeNewPerek(i)}
              class="dark:bg-gray-600 bg-gray-400 border p-1 mt-2 rounded"
              >Take</button
            >
          {/if}<br />
        {/each}
      {/await}
    {/await}
  </div>
</main>
