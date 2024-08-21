<script>
  import authStore from "./lib/AuthStore";
  import appStore from "./lib/AppStore";
  import SD from "./SD";
  import Gate from "./lib/Gate.svelte";
  import HeaderMetaData from "./lib/HeaderMetaData.svelte";
  import Header from "./lib/Header.svelte";
  import Panel from "./lib/Panel.svelte";
  import Profile from "./lib/Profile.svelte";
  import Invitations from "./lib/Invitations.svelte";
</script>

<HeaderMetaData />
<Header />
<Panel />
{#if $appStore.currentPage == SD.page.register}
  <div class="gate-wrpaper">
    <Gate></Gate>
  </div>
{/if}

{#if $appStore.currentPage == SD.page.home}
  <div>home panel</div>
{/if}

{#if $appStore.currentPage == SD.page.friendList}
  friend list
{/if}
{#if $appStore.currentPage == SD.page.Profile}
  <Profile></Profile>
{/if}
{#if $appStore.currentPage == SD.page.invitations}
  <Invitations />
{/if}

<style>
  .profile {
    margin-left: 10px;
  }
  .gate-wrpaper {
    width: fit-content;
    height: fit-content;
    margin: auto;
    margin-top: 200px;
  }
</style>
