import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import {
  SUPABASE_PUBLISHABLE_KEY,
  SUPABASE_URL,
} from "./config.js";

const form = document.getElementById("auth-form");
const emailInput = document.getElementById("email");
const passwordInput = document.getElementById("password");
const pageTitle = document.getElementById("page-title");
const pageDescription = document.getElementById("page-description");
const submitButton = document.getElementById("submit-button");
const modeButton = document.getElementById("mode-button");
const message = document.getElementById("message");
const signedInPanel = document.getElementById("signed-in-panel");
const signedInEmail = document.getElementById("signed-in-email");
const signOutButton = document.getElementById("sign-out-button");

let isSignUp = false;
const isConfigured =
  SUPABASE_URL.startsWith("https://") &&
  !SUPABASE_URL.includes("YOUR_") &&
  !SUPABASE_PUBLISHABLE_KEY.includes("YOUR_");
const supabase = isConfigured
  ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY)
  : null;

function showMessage(text, kind = "error") {
  message.textContent = text;
  message.dataset.kind = kind;
}

function setLoading(loading) {
  submitButton.disabled = loading;
  modeButton.disabled = loading;
  signOutButton.disabled = loading;
  submitButton.textContent = loading
    ? "Please wait..."
    : isSignUp
      ? "Create account"
      : "Sign in";
}

function showSession(session) {
  const isSignedIn = Boolean(session);
  form.hidden = isSignedIn;
  modeButton.hidden = isSignedIn;
  signedInPanel.hidden = !isSignedIn;
  signedInEmail.textContent = session?.user.email ?? "";
}

modeButton.addEventListener("click", () => {
  isSignUp = !isSignUp;
  pageTitle.textContent = isSignUp ? "Create your account" : "Welcome back";
  pageDescription.textContent = isSignUp
    ? "Use your email and a password to create an account."
    : "Sign in to your account with your email and password.";
  passwordInput.autocomplete = isSignUp ? "new-password" : "current-password";
  submitButton.textContent = isSignUp ? "Create account" : "Sign in";
  modeButton.textContent = isSignUp
    ? "Already have an account? Sign in"
    : "Need an account? Sign up";
  showMessage("");
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  if (!supabase) {
    showMessage("Add your Supabase URL and publishable key to config.js first.");
    return;
  }
  showMessage("");
  setLoading(true);

  const email = emailInput.value.trim();
  const password = passwordInput.value;

  try {
    if (isSignUp) {
      const { data, error } = await supabase.auth.signUp({ email, password });
      if (error) throw error;

      if (data.session) {
        showMessage("Your account was created and you are signed in.", "success");
      } else {
        showMessage(
          "Account created. Check your email for a confirmation link, then sign in.",
          "success",
        );
      }
    } else {
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      if (error) throw error;
    }
  } catch (error) {
    showMessage(error.message || "Authentication failed. Please try again.");
  } finally {
    setLoading(false);
  }
});

signOutButton.addEventListener("click", async () => {
  if (!supabase) {
    showMessage("Add your Supabase URL and publishable key to config.js first.");
    return;
  }
  showMessage("");
  setLoading(true);

  try {
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    showMessage("You have signed out.", "success");
  } catch (error) {
    showMessage(error.message || "Could not sign out. Please try again.");
  } finally {
    setLoading(false);
  }
});

if (supabase) {
  supabase.auth.onAuthStateChange((_event, session) => {
    showSession(session);
  });

  const { data, error } = await supabase.auth.getSession();
  if (error) {
    showMessage(error.message || "Could not check the current session.");
  } else {
    showSession(data.session);
  }
} else {
  showMessage("Add your Supabase URL and publishable key to config.js first.");
}
