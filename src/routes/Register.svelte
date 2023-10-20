<script>
  import { navigate } from "svelte-navigator/src/history";
  import { ID, account } from "../lib/appwrite";
  import { Link } from "svelte-navigator";

  const urlParams = new URLSearchParams(document.location.search);

  let name = "";
  let email = "";
  let password = "";

  let error;

  async function register(e) {
    e.preventDefault();
    error.innerText = "";

    await account
      .create(ID.unique(), email, password)
      .catch((e) => (error.innerText = e));
    await account.createEmailSession(email, password);
    await account.updateName(name).catch((e) => (error.innerText = e));

    account
      .createVerification(window.location.protocol + "//" + window.location.host + "/register/emailVerify")
      .then((r) => {
        if (urlParams.get("redirect_uri") == null) {
          navigate("/", {});
        } else {
          navigate(urlParams.get("redirect_uri"), {});
        }
      })
      .catch((e) => (error.innerText = e));
  }
</script>

<form on:submit={register}>
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
        class="dark:bg-gray-500 dark:placeholder-white border border-black dark:border-current rounded p-1"
        type="email"
        name="email"
        bind:value={email}
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
    <Link
      class="dark:bg-gray-600 bg-gray-400 border p-1 mt-2 rounded"
      type="button"
      to="/login{urlParams.get('redirect_uri') !== null
        ? '?redirect_uri=' + encodeURIComponent(urlParams.get('redirect_uri'))
        : ''}">Go to Log In</Link
    ><br />
    <p class="text-red-600" bind:this={error}></p>
  </fieldset>
</form>
