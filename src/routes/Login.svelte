<script>
  import { navigate } from "svelte-navigator/src/history";
  import { account, loggedInUser } from "../lib/appwrite";
  import { Link, useFocus } from "svelte-navigator";

  const registerFocus = useFocus();
  const urlParams = new URLSearchParams(document.location.search);

  if (loggedInUser !== null) {
    console.log(loggedInUser);
    // location.href = "/";
    navigate("/", {});
  }

  let email = "";
  let password = "";

  let error;
  let submitButton;

  function login(e) {
    e.preventDefault();

    submitButton.setAttribute("disabled", true);
    error.innerText = "";

    account
      .createEmailSession(email, password)
      .then((r) => {
        // location.href = "/";
        if (urlParams.get("redirect_uri") == null) {
          navigate("/", {});
        } else {
          navigate(urlParams.get("redirect_uri"), {});
        }
      })
      .catch((e) => {
        submitButton.removeAttribute("disabled");
        error.innerText = e;
      });
  }
</script>

<form on:submit={login}>
  <fieldset
    class="container justify-center md:m-10 m-2 p-2 border border-black dark:border-current"
  >
    <legend>Log into Tehillim Split</legend>

    <div class="my-2">
      <input
        class="dark:bg-gray-500 dark:placeholder-white border border-black dark:border-current rounded p-1"
        placeholder="Email address"
        type="email"
        name="email"
        id="email"
        bind:value={email}
        required
        use:registerFocus
      /><br />
    </div>

    <div class="my-2">
      <input
        class="dark:bg-gray-500 dark:placeholder-white border border-black dark:border-current rounded p-1"
        placeholder="Password"
        type="password"
        name="password"
        id="password"
        bind:value={password}
        required
      /><br />
    </div>

    <button
      class="dark:bg-gray-600 bg-gray-400 border p-1 mt-2 rounded"
      type="submit"
      bind:this={submitButton}>Log In</button
    >
    <Link
      class="dark:bg-gray-600 bg-gray-400 border p-1 mt-2 rounded"
      type="button"
      to="/register{urlParams.get('redirect_uri') !== null
        ? '?redirect_uri=' + encodeURIComponent(urlParams.get('redirect_uri'))
        : ''}">Go to Register</Link
    ><br />
    <p class="text-red-600" bind:this={error}></p>
  </fieldset>
</form>

<style>
</style>
