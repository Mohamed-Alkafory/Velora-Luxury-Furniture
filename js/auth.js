/**
 * Auth Logic for Velora Luxury Furniture
 * Uses localStorage for persistence
 */

const AUTH_KEY = "velora_users";
const SESSION_KEY = "velora_current_user";

const auth = {
  // Get all users from localStorage
  getUsers: () => JSON.parse(localStorage.getItem(AUTH_KEY)) || [],

  // Register a new user
  register: (userData) => {
    const users = auth.getUsers();
    if (users.find((u) => u.email === userData.email)) {
      return { success: false, message: "Email already registered" };
    }

    users.push(userData);
    localStorage.setItem(AUTH_KEY, JSON.stringify(users));
    return { success: true, message: "Registration successful" };
  },

  // Login user
  login: (email, password) => {
    const users = auth.getUsers();
    const user = users.find((u) => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem(
        SESSION_KEY,
        JSON.stringify({
          name: user.name,
          email: user.email,
        }),
      );
      return { success: true, message: `Welcome back, ${user.name}` };
    }
    return { success: false, message: "Invalid email or password" };
  },

  // Logout
  logout: () => {
    localStorage.removeItem(SESSION_KEY);
    window.location.href = "index.html";
  },

  // Check if user is logged in
  isLoggedIn: () => !!localStorage.getItem(SESSION_KEY),

  // Get current logged in user
  getCurrentUser: () => JSON.parse(localStorage.getItem(SESSION_KEY)),

  // Password strength evaluator
  checkPasswordStrength: (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (/[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^A-Za-z0-9]/.test(password)) strength++;

    return strength; // 0-4
  },
};

export default auth;
