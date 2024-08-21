<script>
  import SD from "../../SD";
  import { createEventDispatcher } from "svelte";
  const dispatch = createEventDispatcher();
  export let panelMode;
  function switchMode(mode) {
    dispatch("changePanelMode", mode);
  }
</script>

<div class="line">
  <div on:click={() => switchMode(SD.panelModes.searchPeople)}>
    <span
      style={`color:${panelMode == SD.panelModes.searchPeople ? "#7CB9E8" : "white"}`}
      >Search People</span
    >
  </div>
  <div on:click={() => switchMode(SD.panelModes.boards)}>
    <span
      style={`color:${panelMode == SD.panelModes.boards ? "#7CB9E8" : "white"}`}
      >Boards</span
    >
  </div>
  <div on:click={() => switchMode(SD.panelModes.Frineds)}>
    <span
      style={`color:${panelMode == SD.panelModes.Frineds ? "#7CB9E8" : "white"}`}
      >Frineds</span
    >
  </div>
</div>

<style>
  .line {
    width: 100%;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(
      112.1deg,
      rgb(32, 38, 57) 11.4%,
      rgb(63, 76, 119) 70.2%
    );
  }
  .line > div {
    width: calc(100% / 3);
    height: 100%;
    background: #36454f;
    color: #fff;
    font-weight: bolder;
    cursor: pointer;
    text-align: center;
    align-content: center;
    clip-path: polygon(15% 0%, 100% 0%, 85% 100%, 0% 100%);
  }
  .line > div:nth-child(1) {
    font-size: 14px;
  }
</style>
