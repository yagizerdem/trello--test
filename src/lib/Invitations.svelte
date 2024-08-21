<script>
  import supabase from "../supabase";
  import authStore from "./AuthStore";
  import Notification from "./Notify";

  const mode = {
    send: 0,
    recieved: 1,
  };
  let selectedMode = mode.send;
  let sendInvitationsData = [];

  async function fetchSendInvitatons() {
    try {
      const { data, error } = await supabase
        .from("invitations")
        .select("*")
        .eq("from", $authStore.user.id);
      if (error) throw error;
    } catch (err) {
      console.log(err);
      Notification.showError({ text: err.message });
    }
  }

  fetchSendInvitatons();
</script>

<div class="wrapper">
  <div class="header">
    <button
      class={selectedMode == mode.send ? "selected" : ""}
      on:click={() => (selectedMode = mode.send)}>send</button
    >
    <button
      class={selectedMode == mode.recieved ? "selected" : ""}
      on:click={() => (selectedMode = mode.recieved)}>recieved</button
    >
  </div>
  <div class="body"></div>
</div>

<style>
  .wrapper {
    width: 700px;
    height: 500px;
    background: white;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    border-radius: 4px;
    box-shadow:
      rgba(0, 0, 0, 0.25) 0px 54px 55px,
      rgba(0, 0, 0, 0.12) 0px -12px 30px,
      rgba(0, 0, 0, 0.12) 0px 4px 6px,
      rgba(0, 0, 0, 0.17) 0px 12px 13px,
      rgba(0, 0, 0, 0.09) 0px -3px 5px;
  }
  .header {
    width: 90%;
    height: 50px;
    margin: 10px auto;
    display: flex;
    align-items: center;
    justify-content: space-around;
  }
  .header button {
    width: 180px;
    border: none;
    outline: none;
    padding: 10px 20px;
    border-radius: 5px;
    cursor: pointer;
    box-shadow:
      rgba(0, 0, 0, 0.25) 0px 54px 55px,
      rgba(0, 0, 0, 0.12) 0px -12px 30px,
      rgba(0, 0, 0, 0.12) 0px 4px 6px,
      rgba(0, 0, 0, 0.17) 0px 12px 13px,
      rgba(0, 0, 0, 0.09) 0px -3px 5px;
    font-size: 20px;
    font-weight: bolder;
  }
  .selected {
    color: blue;
  }
</style>
