<script>
  import appStore from "./AppStore";
  import SD from "../SD";
  import authStore from "./AuthStore";
  import supabase from "../supabase";
  import Notification from "./Notify";

  $: userName = `${$authStore.firstName ?? ""}  ${$authStore.lastName ?? ""}`;
  $: profileImageFileURL = null;

  async function signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      Notification.showSuccess({ text: "sing out success" });
    } catch (err) {
      console.log(err);
    }
  }

  $: {
    if ($authStore.user && !profileImageFileURL) {
      fetchProfileImage($authStore.user.id);
    }
  }
  async function fetchProfileImage(uuid) {
    // blob object
    const { data, error } = await supabase.storage
      .from("profiles")
      .download(`${uuid}`);

    profileImageFileURL = URL.createObjectURL(data);
  }

  $: if (!$authStore.user) {
    profileImageFileURL = false;
  }
</script>

<div class="header">
  <div class="profile">
    <span>
      <img src={profileImageFileURL} alt="profile image" class="profileImage" />
    </span>
    <span>
      {userName}
    </span>
  </div>
  <div class="auth">
    <div class="friends">
      <i
        class="fa-solid fa-envelope"
        on:click={() => ($appStore.currentPage = SD.page.invitations)}
      ></i>
    </div>
    <div class="friends">
      <i
        class="fa-solid fa-person icon"
        on:click={() => ($appStore.currentPage = SD.page.friendList)}
      ></i>
    </div>
    <button on:click={() => ($appStore.currentPage = SD.page.register)}
      >register</button
    >
    <button on:click={signOut}>Sign Out</button>
  </div>
</div>

<style>
  .header {
    width: 100%;
    height: 40px;
    background-color: white;
    box-shadow:
      rgba(0, 0, 0, 0.25) 0px 54px 55px,
      rgba(0, 0, 0, 0.12) 0px -12px 30px,
      rgba(0, 0, 0, 0.12) 0px 4px 6px,
      rgba(0, 0, 0, 0.17) 0px 12px 13px,
      rgba(0, 0, 0, 0.09) 0px -3px 5px;
    display: flex;
    justify-content: space-between;
    align-items: center;
  }
  .auth button {
    color: blue;
    border: none;
    outline: none;
    padding: 5px 20px;
    cursor: pointer;
    border-radius: 3px;
    margin-right: 10px;
  }
  .profileImage {
    width: 40px;
    height: 40px;
  }
  .profile {
    display: flex;
    align-items: center;
    cursor: pointer;
    transition: all 0.3s linear;
  }
  .profile > span {
    margin: 0 10px 0 10px;
  }
  .profile:hover {
    color: rgb(102, 102, 212);
  }
  .auth {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .friends {
    margin-right: 20px;
    cursor: pointer;
  }
  .friends > .icon {
    font-size: 24px;
    transition: all 0.3s linear;
  }
  .friends > .icon:hover {
    color: blue;
  }
</style>
