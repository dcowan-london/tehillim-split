<script>
  import { account, logOut, loggedInUser } from "./appwrite";
</script>

<div class="">
  Welcome, {loggedInUser.name}
  <a href="#" class="text-blue-400" on:click={logOut}>Log out</a>
</div>
{#if !loggedInUser.emailVerification}
  <div class="">
    You have not verified your email address yet <a
      href="#"
      class="text-blue-400"
      on:click={() =>
        account.createVerification(
          window.location.protocol +
            "//" +
            window.location.host +
            "/register/emailVerify",
        )}>Resend verification email</a
    >
  </div>
{/if}
