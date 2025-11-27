// src/features/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

// Try to restore minimal state if the user chose "remember me"
const remembered = localStorage.getItem("remember_me") === "true";
const initialToken = remembered ? localStorage.getItem("access_token") : null;
const initialUser = remembered ? JSON.parse(localStorage.getItem("user") || "null") : null;

const initialState = {
  accessToken: initialToken, // keep access token in memory; optionally persisted if remember_me
  user: initialUser,         // { email, ... } optional
  status: "idle",            // 'idle' | 'loading' | 'error'
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    // store token in state (used by your LoginComponent)
    setAccessToken(state, action) {
      state.accessToken = action.payload;
      state.status = "idle";
      state.error = null;
    },
    // set a user object (email, roles, etc.)
    setUser(state, action) {
      state.user = action.payload;
    },
    // optional helper to mark loading / error states
    setStatus(state, action) {
      state.status = action.payload;
    },
    setError(state, action) {
      state.error = action.payload;
      state.status = "error";
    },
    // logout: clear token + user (keep persisted flags handled by performLogout)
    logout(state) {
      state.accessToken = null;
      state.user = null;
      state.status = "idle";
      state.error = null;
    },
  },
});

export const { setAccessToken, setUser, setStatus, setError, logout } = authSlice.actions;
export default authSlice.reducer;

/*
Helper thunk: performLogout
- clears persisted keys (if any)
- dispatches logout action
- redirects to login page
*/
export const performLogout = () => (dispatch) => {
  try {
    localStorage.removeItem("access_token");
    localStorage.removeItem("user");
    localStorage.removeItem("remember_me");
  } catch (e) {
    // ignore storage errors
  }
  dispatch(logout());
  // simple redirect to login — adjust to use navigate() if you prefer
  window.location.href = "/";
};

// Selectors
export const selectAuth = (state) => state.auth;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectUser = (state) => state.auth.user;
