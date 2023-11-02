<script>
  import { Link } from "svelte-navigator";
  import Header from "../../lib/Header.svelte";
  import {
    checkloggedin,
    database,
    loggedInUser,
    teams,
  } from "../../lib/appwrite";

  checkloggedin();

  export let id;

  let list = database.getDocument(
    import.meta.env.VITE_APPWRITE_DB_ID,
    "lists",
    id,
  );
  let members = teams.listMemberships(id);

  const rolesIndex = (user, role) => {
    let index = user.roles.findIndex((e) => e == role);
    return index;
  };

  const userIsAdmin = (users, id) => {
    let index = users.memberships.findIndex((e) => e.userId == id);
    if (users.memberships[index].roles.includes("owner")) {
      return true;
    }
    return false;
  };

  function getData() {
    members = teams.listMemberships(id);
  }

  function inviteMember() {
    let email = prompt("Enter member email address");
    if (email !== "") {
      teams
        .createMembership(
          id,
          [],
          email,
          undefined,
          undefined,
          window.location.protocol +
            "//" +
            window.location.host +
            "/accept_list_invitation",
        )
        .then(() => getData());
    }
  }

  function removeFromList(membershipId) {
    teams.deleteMembership(id, membershipId).then(() => getData());
  }

  function makeAdmin(membershipId) {
    teams.updateMembership(id, membershipId, ["owner"]).then(() => getData());
  }

  function removeAdmin(membershipId) {
    teams.updateMembership(id, membershipId, []).then(() => getData());
  }
</script>

<main class="container m-5">
  <Header />

  <div class="my-5">
    {#await members}
      Loading...
    {:then members}
      <Link to="/list/{id}" class="text-blue-400"
        >Back to {members.memberships[0].teamName}</Link
      ><br />
      {#each members.memberships as member}
        <div class="m-1">
          {member.userName} - {member.userEmail}
          {#if rolesIndex(member, "owner") !== -1}
            <span class="border p-1 border-black dark:border-white"
              >List Admin</span
            >
          {/if}
          {#if member.confirm == false}
            <span class="border p-1">Pending</span>
          {/if}
          {#if userIsAdmin(members, loggedInUser["$id"]) && member.userId !== loggedInUser["$id"]}
            <Link
              class="text-blue-400"
              on:click={() => removeFromList(member.$id)}
              to="#">Remove from list</Link
            >
            {#if !userIsAdmin(members, member.userId)}
              | <Link
                class="text-blue-400"
                on:click={() => makeAdmin(member.$id)}
                to="#">Make user admin</Link
              >
            {:else}
              | <Link
                class="text-blue-400"
                on:click={() => removeAdmin(member.$id)}
                to="#">Remove as admin</Link
              >
            {/if}
          {/if}
        </div>
      {/each}
      <Link class="text-blue-400" to="#" on:click={inviteMember}
        >Invite member</Link
      >
    {/await}
  </div>
</main>
