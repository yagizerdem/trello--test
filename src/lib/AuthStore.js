import { writable } from "svelte/store";
import supabase from "../supabase";

const initial = {
  firstName: null,
  lastName: null,
  isAuthenticated: false,
  user: null,
  session: null,
};

const authStore = writable(JSON.parse(JSON.stringify(initial)));

function listenSupabaseEvents() {
  const { data } = supabase.auth.onAuthStateChange((event, session) => {
    console.log(event, session);

    if (event === "INITIAL_SESSION") {
      authStore.set({
        firstName: session?.user.user_metadata.first_name ?? " ",
        lastName: session?.user.user_metadata.last_name ?? " ",
        isAuthenticated: session ? true : false,
        user: session.user ?? null,
        session: session ?? null,
      });
    } else if (event === "SIGNED_IN") {
      authStore.set({
        firstName: session?.user.user_metadata.first_name ?? " ",
        lastName: session?.user.user_metadata.last_name ?? " ",
        isAuthenticated: session ? true : false,
        user: session.user ?? null,
        session: session ?? null,
      });
    } else if (event === "SIGNED_OUT") {
      authStore.set(JSON.parse(JSON.stringify(initial))); // deep copy
    } else if (event === "PASSWORD_RECOVERY") {
      // handle password recovery event
    } else if (event === "TOKEN_REFRESHED") {
      // handle token refreshed event
    } else if (event === "USER_UPDATED") {
      // handle user updated event
    }
  });
}

listenSupabaseEvents();

export default authStore;
