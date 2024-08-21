<script>
  import jQuery from "jquery";
  import PanelHeader from "./Panels/PanelHeader.svelte";
  import SD from "../SD";
  import SearchPeoplePanel from "./Panels/SearchPeoplePanel.svelte";
  var isOpened = true;
  let isAnimationComplete = true;

  let panelMode = SD.panelModes.searchPeople;

  function animate() {
    if (!isAnimationComplete) return;
    isAnimationComplete = false;
    jQuery("#wrapper").animate(
      {
        left: isOpened ? "-=300" : "+=300",
      },
      1000,
      function () {
        isAnimationComplete = true;
        isOpened = !isOpened;
      },
    );
  }

  function changePanelMode(event) {
    panelMode = event.detail;
    console.log(panelMode);
  }
</script>

<div class="wrapper" id="wrapper">
  <div class="panel">
    <PanelHeader on:changePanelMode={changePanelMode} {panelMode} />
    {#if panelMode == SD.panelModes.searchPeople}
      <SearchPeoplePanel />
    {/if}
  </div>
  <button on:click={animate}>
    <i class="fa-solid fa-arrow-right"></i>
  </button>
</div>

<style>
  .wrapper {
    width: fit-content;
    height: fit-content;
    position: fixed;
    z-index: 1;
    top: 50%;
    transform: translateY(-50%);
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .panel {
    width: 300px;
    height: 500px;
    background: rgb(2, 0, 36);
    background: linear-gradient(
      79deg,
      rgba(2, 0, 36, 1) 0%,
      rgba(39, 39, 56, 1) 35%,
      rgba(17, 28, 31, 1) 81%,
      rgba(8, 20, 23, 1) 100%
    );

    border-radius: 5px;
    box-shadow:
      rgba(0, 0, 0, 0.25) 0px 54px 55px,
      rgba(0, 0, 0, 0.12) 0px -12px 30px,
      rgba(0, 0, 0, 0.12) 0px 4px 6px,
      rgba(0, 0, 0, 0.17) 0px 12px 13px,
      rgba(0, 0, 0, 0.09) 0px -3px 5px;
  }
  .wrapper button {
    margin-left: 30px;
    width: 100px;
    height: 30px;
    border-radius: 5px;
    cursor: pointer;
  }
</style>
