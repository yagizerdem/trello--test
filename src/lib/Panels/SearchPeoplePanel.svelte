<script>
  import { onMount, onDestroy } from "svelte";
  import supabase from "../../supabase";
  import debounce from "../debounce";
  import Notification from "../Notify";
  import ProfileModel from "../../models/ProfileModel";
  import appStore from "../AppStore";
  import SD from "../../SD";
  import authStore from "../AuthStore";

  let page = 1;
  let isLoading = false;
  let limit = 10;
  let inputTypeText;
  let query;
  let users = [];
  let listElement;
  let end = false;

  async function loadMore() {
    var result = await fetchProfiles(query);
    if (result.length == 0) {
      end = true;
    }
    const newUsers = [];
    const deepCopyOrigianlUsers = JSON.parse(JSON.stringify(users));
    for (var data of result) {
      const model = new ProfileModel();
      model.firstName = data["first_name"];
      model.lastName = data["last_name"];
      model.uuid = data.id;
      newUsers.push(model);
    }
    async function getProfilesImages() {
      const deepCopynewUsers = JSON.parse(JSON.stringify(newUsers));
      // fetch profile images
      const urlPromises = newUsers.map(async (u) => {
        const { data } = await supabase.storage
          .from("profiles")
          .getPublicUrl(u.uuid);
        return { uuid: u.uuid, file: data["publicUrl"] };
      });
      const uuid_url_map = await Promise.all(urlPromises);
      for (var map of uuid_url_map) {
        const user = deepCopynewUsers.find((item) => item.uuid == map.uuid);
        user.profileImageUrl = map.file;
      }
      // lazy load profile images
      users = [...deepCopyOrigianlUsers, ...deepCopynewUsers];
    }
    getProfilesImages();
    users = [...deepCopyOrigianlUsers, ...newUsers];
  }

  function editQuery() {
    debounce(() => {
      query = inputTypeText.value;
    }, 500)();
  }
  async function fetchProfiles(query) {
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    try {
      isLoading = true;
      const { data, error } = await supabase
        .from("profiles")
        .select("*") // You can specify columns if needed, e.g., .select('id, user_name')
        .ilike("user_name", `%${query}%`) // Perform a case-insensitive search
        .range(from, to); // Range for pagination

      page++;
      return data;
    } catch (err) {
      console.log(err);
      Notification.showError({ text: err.message });
      return [];
    } finally {
      isLoading = false;
    }
  }
  $: {
    if (query) {
      page = 1;
      async function helper() {
        const tempUsers = [];
        const result = await fetchProfiles(query);
        for (var data of result) {
          const model = new ProfileModel();
          model.firstName = data["first_name"];
          model.lastName = data["last_name"];
          model.uuid = data.id;
          tempUsers.push(model);
        }

        async function getProfilesImages() {
          const deepCopytempUsers = JSON.parse(JSON.stringify(tempUsers));
          // fetch profile images
          const urlPromises = tempUsers.map(async (u) => {
            const { data } = await supabase.storage
              .from("profiles")
              .getPublicUrl(u.uuid);
            return { uuid: u.uuid, file: data["publicUrl"] };
          });
          const uuid_url_map = await Promise.all(urlPromises);
          for (var map of uuid_url_map) {
            const user = deepCopytempUsers.find(
              (item) => item.uuid == map.uuid,
            );
            user.profileImageUrl = map.file;
          }
          // lazy load profile images
          users = deepCopytempUsers;
        }
        getProfilesImages();
        users = tempUsers;
      }
      helper();
    } else {
      users = [];
    }
  }

  var handleScroll = function () {
    if (
      listElement.scrollTop + listElement.clientHeight >=
        listElement.scrollHeight &&
      !end &&
      !isLoading
    ) {
      loadMore();
    }
  };
  onMount(() => {
    if (listElement) {
      listElement.addEventListener("scroll", handleScroll);
    }
  });

  onDestroy(() => {
    listElement.removeEventListener("scroll", handleScroll);
  });

  async function sendFrinedInvite(other) {
    const otheruuid = other.uuid;
    const otherFullName = `${other.firstName} ${other.lastName}`;
    try {
      const { error } = await supabase
        .from("invitations")
        .insert({ from: $authStore.user.id, to: otheruuid });
      if (error) throw error;
      Notification.showSuccess({
        text: `invitation send successfully to ${otherFullName}`,
      });
    } catch (err) {
      console.log(err);
      Notification.showError({ text: err.message });
    }
  }
</script>

<input type="text" on:input={editQuery} bind:this={inputTypeText} />
<div class="container">
  <ul bind:this={listElement}>
    {#each users as user}
      <li
        on:click={() => {
          $appStore.currentPage = SD.page.Profile;
          $appStore.profileuuid = user.uuid;
        }}
      >
        <img src={user.profileImageUrl} />
        <span>{user.firstName} {user.lastName}</span>
        {#if $authStore.user.id != user.uuid}
          <button class="followbtn" on:click={() => sendFrinedInvite(user)}
            >follow</button
          >{/if}
      </li>
    {/each}
    {#if isLoading}
      <span class="loader"></span>
    {/if}
  </ul>
</div>

<style>
  input {
    border: none;
    outline: none;
    padding: 4px 20px;
    border-radius: 4px;
    background: none;
    border-bottom: 2px solid #fff;
    color: white;
    font-weight: bolder;
    display: block;
    margin: 10px auto;
  }
  .container {
    width: 80%;
    height: 70%;
    background-color: #36454f;
    color: #fff;
    margin: calc(15%) auto;
  }
  img {
    width: 50px;
    height: 50px;
  }
  img ~ span {
    align-content: center;
    display: inline-block;
  }
  ul {
    overflow-y: scroll;
    width: 100%;
    height: 100%;
    padding-bottom: 10px;
  }
  ul > li {
    align-items: center;
    display: flex;
    justify-content: space-evenly;
    margin-top: 20px;
    cursor: pointer;
  }
  .loader {
    width: 48px;
    height: 48px;
    border: 5px solid #fff;
    border-bottom-color: transparent;
    border-radius: 50%;
    display: inline-block;
    box-sizing: border-box;
    animation: rotation 1s linear infinite;
    display: block;
    margin: auto;
  }
  .followbtn {
    border-radius: 3px;
    font-weight: bolder;
    cursor: pointer;
  }
  @keyframes rotation {
    0% {
      transform: rotate(0deg);
    }
    100% {
      transform: rotate(360deg);
    }
  }
</style>
