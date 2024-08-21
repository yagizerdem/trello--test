import { writable } from "svelte/store";
import SD from "../SD";

const initial = {
  currentPage: SD.page.home,
  profileuuid: null,
};

const appStore = writable(initial);

export default appStore;
