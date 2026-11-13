# Supabase Auth demo

This is a small, separate example of email/password sign-up, sign-in, and sign-out. Supabase Auth handles account storage and password security; the browser code does not connect directly to a database table.

## Set it up

1. Create a project at [supabase.com](https://supabase.com/).
2. In the Supabase dashboard, open **Project Settings → API**. Copy the **Project URL** and the **publishable key** (or the legacy `anon` key).
3. Open `config.js` and replace both placeholder strings with those values.
4. In **Authentication → Providers**, make sure Email is enabled. Email confirmation may be enabled; if so, confirm the link Supabase emails you before signing in.
5. Serve this folder over local HTTP, rather than opening `index.html` directly. For example, from this folder run:

   ```sh
   python3 -m http.server 8000
   ```

   Then visit <http://localhost:8000>.

You can also use VS Code Live Server. The demo needs an internet connection to load the Supabase JavaScript client and contact your Supabase project.

## Safety notes

- The publishable/anon key is intended for use in browser apps. Never put a `service_role` or secret key in this folder or any other frontend code.
- A publishable key is not a substitute for authorization. If you later add app tables, enable Row Level Security and write policies that restrict access to the signed-in user.
- This demo only authenticates users; it does not save additional profile data or provide production account-management features.
