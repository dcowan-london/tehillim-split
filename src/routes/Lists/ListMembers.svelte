<script>
  import { Link } from "svelte-navigator";
  import Header from "../../lib/Header.svelte";
  import { database, teams } from "../../lib/appwrite";

  export let id;

  let list = database.getDocument("tehillim-split", "lists", id);
  let members = teams.listMemberships(id);
  let adminMembers = teams.listMemberships("admins-" + id);

  const memberIndex = (adminMembers, i) => {
    console.log(adminMembers);
    let index = adminMembers.memberships.findIndex((e) => e.userId == i.userId);
    return index;
  };

  function inviteMember() {
    prompt("Enter member email address")
  }
</script>

<main class="container m-5">
  <Header />

  <div class="my-5">
    {#await members}
      Loading...
    {:then members}
      {#await adminMembers then adminMembers}
        {#each members.memberships as member}
          <div class="m-1">
            {member.userName} - {member.userEmail}
            {#if memberIndex(adminMembers, member) !== -1}
              <span class="border p-1">List Admin</span>
            {/if}
          </div>
        {/each}
        <Link class="text-blue-400" to="#" on:click={inviteMember}>Invite member</Link>
      {/await}
    {/await}
  </div>
</main>
