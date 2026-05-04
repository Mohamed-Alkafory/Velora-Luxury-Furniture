import { supabase } from "./supabase.js";

const auth = {
  register: async ({ name, email, password }) => {
    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name } },
    });

    if (error) {
      const msg = error.message.includes("already registered")
        ? "This email is already in use"
        : error.message;
      return { success: false, message: msg };
    }

    return { success: true, message: "Account created successfully" };
  },

  login: async (email, password) => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) return { success: false, message: "Invalid email or password" };

    const name = data.user?.user_metadata?.name || "there";
    return { success: true, message: `Welcome back, ${name.split(" ")[0]}` };
  },

  logout: async () => {
    await supabase.auth.signOut();
    window.location.href = "index.html";
  },

  isLoggedIn: async () => {
    const { data } = await supabase.auth.getSession();
    return !!data.session;
  },

  getCurrentUser: async () => {
    const { data } = await supabase.auth.getUser();
    if (!data?.user) return null;
    return {
      name: data.user.user_metadata?.name || "User",
      email: data.user.email,
    };
  },

  checkPasswordStrength: (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;
    return strength;
  },
};

export default auth;
