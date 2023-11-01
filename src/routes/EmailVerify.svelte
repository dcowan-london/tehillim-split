<script>
  import { navigate } from "svelte-navigator/src/history";
  import { account, loggedInUser, teams } from "../lib/appwrite";
  import Header from "../lib/Header.svelte";
  import { Link } from "svelte-navigator";

  const searchParams = new URLSearchParams(document.location.search);

  let confirmed = false;
  let alreadyConfirmed = false;

  if (
    loggedInUser !== null &&
    searchParams.get("userId") == loggedInUser["$id"]
  ) {
    account
      .updateVerification(
        searchParams.get("userId"),
        searchParams.get("secret"),
      )
      .then((r) => {
        console.log(r);
        confirmed = true;
      })
      .catch((r) => {
        if (r.type == "user_invalid_token") {
          alreadyConfirmed = true;
        }
      });
  }
</script>

<main class="container m-5">
  {#if loggedInUser !== null}
    <Header />
  {/if}

  {#if loggedInUser == null}
    Please log in to confirm your email address <Link
      class="text-blue-400"
      to="/login?redirect_uri={encodeURIComponent(window.location.href)}"
      >Log in</Link
    >
  {/if}

  {#if loggedInUser !== null && searchParams.get("userId") !== loggedInUser["$id"]}
    You can't verify your email for a different account. Please log out and log
    back into the correct user.
  {/if}

  {#if confirmed == true}
    Your email address has been successfully confirmed! <Link to="/"
      >Go home</Link
    >
  {/if}

  {#if alreadyConfirmed == true}
    This verification link is invalid. You may already used it, or it may have
    expired. <Link to="/">Go home</Link>
  {/if}
</main>
