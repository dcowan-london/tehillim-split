<script>
  import { navigate } from "svelte-navigator/src/history";
  import { ID, account } from "../lib/appwrite";

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
      .createVerification("http://localhost:5173/register/emailVerify")
      .then((r) => {
        navigate("/");
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
    <button
      class="dark:bg-gray-600 bg-gray-400 border p-1 mt-2 rounded"
      type="button"
      on:click={() => navigate("/login")}>Go to Log In</button
    ><br />
    <p class="text-red-600" bind:this={error}></p>
  </fieldset>
</form>
