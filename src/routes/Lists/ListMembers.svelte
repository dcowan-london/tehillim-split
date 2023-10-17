<script>
  import { Link } from "svelte-navigator";
  import Header from "../../lib/Header.svelte";
  import { database, teams } from "../../lib/appwrite";

  export let id;

  let list = database.getDocument("tehillim-split", "lists", id);
  let members = teams.listMemberships(id);

  const rolesIndex = (user, role) => {
    let index = user.roles.findIndex((e) => e == role);
    return index;
  };

  function inviteMember() {
    let email = prompt("Enter member email address");
    if (email !== "") {
      teams.createMembership(
        id,
        [],
        email,
        undefined,
        undefined,
        "http://localhost:5173/accept_list_invitation",
      );
    }
  }
</script>

<main class="container m-5">
  <Header />

  <div class="my-5">
    {#await members}
      Loading...
    {:then members}
    <Link to="/list/{id}" class="text-blue-400">Back to {members.memberships[0].teamName}</Link><br>
      {#each members.memberships as member}
        <div class="m-1">
          {member.userName} - {member.userEmail}
          {#if rolesIndex(member, 'admin') !== -1}
            <span class="border p-1">List Admin</span>
          {/if}
        </div>
      {/each}
      <Link class="text-blue-400" to="#" on:click={inviteMember}
        >Invite member</Link
      >
    {/await}
  </div>
</main>
