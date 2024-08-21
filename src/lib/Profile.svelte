<script>
  import appStore from "./AppStore";
  import authStore from "./AuthStore";

  $: isAdmin = $appStore.profileuuid == $authStore.user.id;
</script>

<div>profile</div>
