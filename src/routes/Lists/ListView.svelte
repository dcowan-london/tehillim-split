<script>
  import { ID, Permission, Query, Role } from "appwrite";
  import Header from "../../lib/Header.svelte";
  import { database, loggedInUser, teams } from "../../lib/appwrite";
  import { Link } from "svelte-navigator";
  import { navigate } from "svelte-navigator/src/history";

  export let id;

  let elementsNumbers = 0;

  let list = database.getDocument(
    import.meta.env.VITE_APPWRITE_DB_ID,
    "lists",
    id,
  );

  list.then((r) => {
    if (r.list_type == "perakim") elementsNumbers = 151;
    if (r.list_type == "month") elementsNumbers = 31;
  });
  let perakim = [];
  let perakimPromise = database
    .listDocuments(import.meta.env.VITE_APPWRITE_DB_ID, "perakim", [
      Query.equal("list_id", [id]),
    ])
    .then((r) => {
      perakim = r.documents;
    });

  let teamDetails = teams.listMemberships(id);

  const userIsAdmin = (users, id) => {
    let index = users.memberships.findIndex((e) => e.userId == id);
    if (users.memberships[index].roles.includes("owner")) {
      return true;
    }
    return false;
  };

  const perekIndex = (i) => {
    let index = perakim.findIndex((e) => e.perek == i);
    return index;
  };

  function takePerek(perek) {}

  function takeNewPerek(perek) {
    console.log(perek);
    database
      .createDocument(
        import.meta.env.VITE_APPWRITE_DB_ID,
        "perakim",
        ID.unique(),
        {
          list_id: id,
          perek: perek,
          taken: true,
          taken_by: loggedInUser["$id"],
          taken_by_name: loggedInUser["name"],
        },
        [
          Permission.read(Role.team(id)),
          Permission.write(Role.user(loggedInUser["$id"])),
        ],
      )
      .then(() => {
        perakimPromise = database
          .listDocuments(import.meta.env.VITE_APPWRITE_DB_ID, "perakim", [
            Query.equal("list_id", [id]),
          ])
          .then((r) => {
            perakim = r.documents;
          });
      });
  }

  function renameList() {
    let newTitle = prompt("Enter new name");

    if (newTitle !== "") {
      database
        .updateDocument(import.meta.env.VITE_APPWRITE_DB_ID, "lists", id, {
          title: newTitle,
        })
        .then(
          () =>
            (list = database.getDocument(
              import.meta.env.VITE_APPWRITE_DB_ID,
              "lists",
              id,
            )),
        );
    }
  }

  function deleteList() {
    database
      .deleteDocument(import.meta.env.VITE_APPWRITE_DB_ID, "lists", id)
      .then(() => teams.delete(id).then(() => navigate("/", {})));
  }

  function completePerek(perek) {
    let perekDBId = perakim[perekIndex(perek)]["$id"];

    database
      .updateDocument(
        import.meta.env.VITE_APPWRITE_DB_ID,
        "perakim",
        perekDBId,
        {
          completed: true,
        },
      )
      .then(() => {
        perakimPromise = database
          .listDocuments(import.meta.env.VITE_APPWRITE_DB_ID, "perakim", [
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
      .updateDocument(
        import.meta.env.VITE_APPWRITE_DB_ID,
        "perakim",
        perekDBId,
        {
          completed: false,
        },
      )
      .then(() => {
        perakimPromise = database
          .listDocuments(import.meta.env.VITE_APPWRITE_DB_ID, "perakim", [
            Query.equal("list_id", [id]),
          ])
          .then((r) => {
            perakim = r.documents;
          });
      });
  }

  function untakePerek(perek) {
    let perekDBId = perakim[perekIndex(perek)]["$id"];

    database
      .deleteDocument(import.meta.env.VITE_APPWRITE_DB_ID, "perakim", perekDBId)
      .then(() => {
        perakimPromise = database
          .listDocuments(import.meta.env.VITE_APPWRITE_DB_ID, "perakim", [
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
      <p>
        List split by {list.list_type == "perakim"
          ? "perek"
          : ""}{list.list_type == "month" ? "days of month" : ""}
      </p>
      <br />
      <Link class="text-blue-400" to="/list/{id}/members">Members</Link>
      {#await teamDetails then team}
        {#if userIsAdmin(team, loggedInUser["$id"])}
          | <Link class="text-blue-400" to="#" on:click={() => renameList()}
            >Rename list</Link
          >
          | <Link class="text-blue-400" to="#" on:click={() => deleteList()}
            >Delete list</Link
          >
        {/if}
      {/await}<br />
      {#await perakimPromise then perakimResolved}
        {#each Array.from(Array(elementsNumbers).keys()).slice(1) as i}
          {list.list_type == "perakim" ? "Perek " + i : ""}
          {list.list_type == "month" ? "Day " + i : ""}
          {#if perekIndex(i) !== -1}
            {#if perakim[perekIndex(i)].taken == false}
              <button
                on:click={() => takePerek(i)}
                class="dark:bg-gray-600 bg-gray-400 border p-1 mt-2 rounded"
                >Take</button
              >
            {:else if perakim[perekIndex(i)].taken_by == loggedInUser["$id"] && perakim[perekIndex(i)].completed !== true}
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
              <button
                on:click={() => uncompletePerek(i)}
                class="dark:bg-gray-600 bg-gray-400 border p-1 mt-2 rounded"
                >Uncomplete</button
              >
            {:else if perakim[perekIndex(i)].completed == false}
              - Taken by {perakim[perekIndex(i)].taken_by_name}
            {:else}
              - Completed by {perakim[perekIndex(i)].taken_by_name}
            {/if}
          {:else}
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
