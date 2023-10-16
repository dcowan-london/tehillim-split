<script>
  import { Route, Router } from "svelte-navigator";
  import Home from "./routes/Home.svelte";
  import Login from "./routes/Login.svelte";
  // import { account } from "./lib/appwrite";
  import Register from "./routes/Register.svelte";
  import EmailVerify from "./routes/EmailVerify.svelte";
    import ListView from "./routes/Lists/ListView.svelte";
    import ListCreate from "./routes/Lists/ListCreate.svelte";
    import ListMembers from "./routes/Lists/ListMembers.svelte";

  export let url = "";

</script>

<Router {url}>
  <Route path="/register/emailVerify" component={EmailVerify} />
  <Route path="/register" component={Register} />
  <Route path="/login" component={Login} />
  <Route path="/list/:id/members" component={ListMembers} />
  <Route path="/list/:id" component={ListView} />
  <Route path="/lists/create" component={ListCreate} />
  <Route path="/" component={Home} />
</Router>

<!-- <style>
  p.error {
    color: red;
  }
</style> -->
