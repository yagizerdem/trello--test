<script>
  import ProfileModel from "../models/ProfileModel";
  import Notification from "./Notify";
  import appStore from "./AppStore";
  import SD from "../SD";
  import supabase from "../supabase";
  import authStore from "./AuthStore";
  const states = {
    logIn: 0,
    signUp: 1,
  };
  var registerState = states.signUp;
  var angle = 0;
  $: calculatedStyle = `transform: rotateY(${angle}deg);transition: all 1s ease-out;${registerState == states.signUp ? "height: 700px" : "height: 300px"};`;
  var signUpFormRef = null;
  var logInFormRef = null;
  var profileImageFile = null;
  $: imageUrl =
    profileImageFile != null ? URL.createObjectURL(profileImageFile) : null;
  $: showPassword = false;
  function signUp() {
    const formData = new FormData(signUpFormRef);
    const profileModel = new ProfileModel();
    for (var [key, value] of formData) {
      profileModel[key] = value;
    }
    if (!profileModel.isValid()) {
      return Notification.showError({ text: "invlid credentials ..." });
    }

    async function SignUpTosupabase() {
      try {
        const { data, error: signUpError } = await supabase.auth.signUp({
          email: profileModel.email,
          password: profileModel.password,
          options: {
            data: {
              first_name: profileModel.firstName,
              last_name: profileModel.lastName,
            },
          },
        });
        if (signUpError) throw signUpError;
        if (!data.user || !data.user.id) {
          throw new Error("User not authenticated");
        }

        // Upload the profile image to the bucket
        if (profileImageFile) {
          const { data: uploadData, error: uploadError } =
            await supabase.storage
              .from("profiles")
              .upload(`${data.user.id}`, profileImageFile, {
                contentType: profileImageFile.type,
              });
          if (uploadError) throw uploadError;
        }

        Notification.showSuccess({ text: "sign up success ... " });
        $appStore.currentPage = SD.page.home;
      } catch (err) {
        console.log(err);
        Notification.showError({ text: err.message });
      }
    }
    SignUpTosupabase();
  }

  async function signIn() {
    const formData = new FormData(logInFormRef);
    const profileModel = new ProfileModel();
    for (var [key, value] of formData) {
      profileModel[key] = value;
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: profileModel.email,
        password: profileModel.password,
      });
      if (error) throw error;
      Notification.showSuccess({ text: "sing in success" });
      $appStore.currentPage = SD.page.home;
    } catch (err) {
      Notification.showError({ text: err.message });
    }
  }

  function selectFile(e) {
    const fileInput = e.target;
    if (fileInput.files.length > 0) {
      const selectedFile = fileInput.files[0];
      profileImageFile = selectedFile;
    }
  }
</script>

<div class="gate" style={calculatedStyle}>
  <div class="front">
    <h1>Sign Up</h1>
    <div class="profileImagewrapper">
      <img src={imageUrl} class="profileImage" alt="profileImage" />
      <button class="trash" on:click={() => (profileImageFile = null)}
        ><i class="fa-solid fa-trash-can"></i></button
      >
    </div>

    <form bind:this={signUpFormRef}>
      <label for="firstname">first name</label>
      <input placeholder="enter first name " name="firstName" type="text" />
      <label for="lastname">last name</label>
      <input placeholder="enter last name" name="lastName" type="text" />
      <label for="email">email</label>
      <input placeholder="enter email" name="email" type="email" />
      <label for="password">password</label>
      <input
        placeholder="enter password"
        name="password"
        type={showPassword ? "text" : "password"}
      />
      <div>
        <label for="showpassword">show password</label>
        <input
          type="checkbox"
          name="showpassword"
          bind:checked={showPassword}
        />
      </div>
      <label for="profileImage">select profile image</label>
      <input type="file" name="profileImage" on:change={selectFile} />
      <button on:click|preventDefault={signUp}>submit</button>
    </form>
  </div>
  <div class="back">
    <h1>Log In</h1>
    <form bind:this={logInFormRef}>
      <label for="email">email</label>
      <input placeholder="enter email" name="email" type="email" />
      <label for="password">password</label>
      <input
        placeholder="enter password"
        name="password"
        type={showPassword ? "text" : "password"}
      />
      <div>
        <label for="showpassword">show password</label>
        <input
          type="checkbox"
          name="showpassword"
          bind:checked={showPassword}
        />
      </div>
      <button on:click|preventDefault={signIn}>sign In</button>
    </form>
  </div>
</div>
<span
  on:click={() => {
    angle = Math.abs(angle - 180);
    registerState = (registerState + 1) % 2;
    showPassword = false;
  }}
>
  {#if registerState == states.signUp}
    switch to log in
  {:else}
    switch to sign in
  {/if}
</span>
<button
  on:click={() => {
    $appStore.currentPage = SD.page.home;
  }}
  class="goBackbtn">go back</button
>

<style>
  span {
    text-align: center;
    display: block;
    font-weight: bolder;
    color: #7cb9e8;
    margin-top: 10px;
    cursor: pointer;
  }
  .gate {
    width: 400px;
    border-radius: 5px;
    position: relative;
    perspective: 1000px;
    transform-style: preserve-3d;
    background-color: white;
    box-shadow:
      rgba(0, 0, 0, 0.25) 0px 54px 55px,
      rgba(0, 0, 0, 0.12) 0px -12px 30px,
      rgba(0, 0, 0, 0.12) 0px 4px 6px,
      rgba(0, 0, 0, 0.17) 0px 12px 13px,
      rgba(0, 0, 0, 0.09) 0px -3px 5px;
  }
  .front {
    width: 100%;
    height: fit-content;
    position: absolute;
    border-radius: 10px;
    backface-visibility: hidden;
  }
  .back {
    width: 100%;
    height: 100%;
    position: absolute;
    border-radius: 10px;
    backface-visibility: hidden;
    transform: rotateY(180deg);
  }
  .front,
  .back {
    text-align: center;
  }
  .front form,
  .back form {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .front form input,
  .back form input {
    margin: 20px 0 0 0;
    padding: 4px 20px;
    border-radius: 2px;
  }
  .front form label {
    margin: 20px 0 0 0;
  }
  .front form button,
  .back form button {
    margin: 20px 0 0 0;
    padding: 5px 20px;
    border-radius: 4px;
    cursor: pointer;
    font-weight: bolder;
  }
  .profileImagewrapper {
    position: relative;
  }
  .profileImage {
    width: 100px;
    display: block;
    height: 100px;
    border: 1px solid black;
    margin: 20px auto;
  }
  .trash {
    display: block;
    width: 40px;
    height: 40px;
    position: absolute;
    top: -10px;
    left: calc(50% + 40px);
    border-radius: 50%;
    border: none;
    outline: none;
    cursor: pointer;
  }
  .goBackbtn {
    display: block;
    margin: 20px auto;
    padding: 5px 25px;
    border-radius: 3px;
    cursor: pointer;
    border: none;
    outline: none;
    font-weight: bolder;
    font-size: 15px;
  }
</style>
