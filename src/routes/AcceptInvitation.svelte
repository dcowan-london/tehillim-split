<script>
  import { Link } from "svelte-navigator";
  import Header from "../lib/Header.svelte";
  import { account, loggedInUser, teams } from "../lib/appwrite";
  import { navigate } from "svelte-navigator/src/history";

  const searchParams = new URLSearchParams(document.location.search);
  let confirmed = true;
  let alreadyConfirmed = false;
  let newUser = true;

  let name = "";
  let email = "";
  let password = "";

  let error;

  function updateUser(e) {
    e.preventDefault();

    account
      .updateName(name)
      .then((r) => {
        account
          .updatePassword(password)
          .then((r) => {
            navigate("/", {});
          })
          .catch((r) => {
            error.innerText = r;
          });
      })
      .catch((r) => {
        error.innerText = r;
      });
  }

  if (
    (loggedInUser !== null &&
      searchParams.get("userId") == loggedInUser["$id"]) ||
    loggedInUser == null
  ) {
    teams
      .updateMembershipStatus(
        searchParams.get("teamId"),
        searchParams.get("membershipId"),
        searchParams.get("userId"),
        searchParams.get("secret"),
      )
      .then((r) => {
        console.log(r);
        if (r.confirm == true) {
          confirmed = true;
        }

        if (r.userName == r.userEmail) {
          email = r.userEmail;
          newUser = true;
        }
      })
      .catch((r) => {
        if (r == "AppwriteException: Membership is already confirmed.") {
          alreadyConfirmed = true;
        }
      });
  }
</script>

<main class="container m-5">
  {#if loggedInUser !== null}
    <Header />
  {/if}
  <div class="my-5">
    {#if alreadyConfirmed}
      This invitation has already been accepted.
      <Link class="text-blue-400" to="/">Go home</Link>
    {:else if loggedInUser !== null && searchParams.get("userId") !== loggedInUser["$id"]}
      You're trying to accept an invitation for a different user. Please sign
      out to accept this invitation.
    {:else if confirmed == true}
      Invitation confirmed!

      {#if newUser == true}
        Welcome to Tehillim Split! Complete your new user profile below.

        <form on:submit={updateUser}>
          <fieldset
            class="container justify-center md:m-10 m-2 p-2 border border-black dark:border-current"
          >
            <legend>Register for Tehillim Split</legend>
            <div class="my-2">
              <input
                placeholder="Name"
                class="dark:bg-gray-500 dark:placeholder-white border border-black dark:border-current rounded p-1"
                type="text"
                name="name"
                bind:value={name}
              />
            </div>

            <div class="my-2">
              <input
                placeholder="Email address"
                class="dark:bg-gray-600 bg-gray-300 dark:text-gray-300 dark:placeholder-white border border-black dark:border-current rounded p-1"
                type="email"
                name="email"
                bind:value={email}
                disabled
              />
            </div>

            <div class="my-2">
              <input
                placeholder="Password"
                class="dark:bg-gray-500 dark:placeholder-white border border-black dark:border-current rounded p-1"
                type="password"
                name="password"
                bind:value={password}
              />
            </div>

            <button
              class="dark:bg-gray-600 bg-gray-400 border p-1 mt-2 rounded"
              type="submit">Register</button
            >
            <p class="text-red-600" bind:this={error}></p>
          </fieldset>
        </form>
      {/if}
    {:else}{/if}
  </div>
</main>
