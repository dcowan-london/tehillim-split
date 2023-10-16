<script>
    import { logOut, loggedInUser } from "./appwrite";


</script>

<div class="">Welcome, {loggedInUser.name} <a href="#" class="text-blue-400" on:click={logOut}>Log out</a></div>
{#if !loggedInUser.emailVerification}
  <div class="">You have not verified your email address yet</div>
{/if}
