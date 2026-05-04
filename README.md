<div align="center">

<br/>

<pre>
 ██╗   ██╗███████╗██╗      ██████╗ ██████╗  █████╗
 ██║   ██║██╔════╝██║     ██╔═══██╗██╔══██╗██╔══██╗
 ██║   ██║█████╗  ██║     ██║   ██║██████╔╝███████║
 ╚██╗ ██╔╝██╔══╝  ██║     ██║   ██║██╔══██╗██╔══██║
  ╚████╔╝ ███████╗███████╗╚██████╔╝██║  ██║██║  ██║
   ╚═══╝  ╚══════╝╚══════╝ ╚═════╝ ╚═╝  ╚═╝╚═╝  ╚═╝
</pre>


### *The Curated Atelier — Luxury Furniture Experience*

[![Live Demo](https://img.shields.io/badge/🌐_Live_Demo-velora--luxury--furniture.vercel.app-c9a96e?style=for-the-badge)](https://velora-luxury-furniture.vercel.app)
![Supabase](https://img.shields.io/badge/Supabase-Backend-3ECF8E?style=for-the-badge&logo=supabase&logoColor=white)
![HTML](https://img.shields.io/badge/HTML-30.6%25-e34f26?style=for-the-badge&logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS-36.1%25-1572b6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-33.3%25-f7df1e?style=for-the-badge&logo=javascript&logoColor=black)

</div>

---

## ✨ Overview

**Velora** is a premium luxury furniture e-commerce website crafted for those who appreciate the extraordinary. The platform presents a curated atelier of handcrafted furniture with an elegant, high-end aesthetic — blending timeless design with a seamless shopping experience.

> *"Elevating your living space with timeless design and unrivaled craftsmanship since 1994."*

---

## 🗄️ Backend — Powered by Supabase


Velora's backend is fully powered by **[Supabase](https://supabase.com)** — an open-source Firebase alternative that provides a real PostgreSQL database, authentication, and instant APIs out of the box.

### 🔐 Authentication

User accounts are managed entirely through **Supabase Auth**:

- **Sign Up** — new users register with name, email & password. Credentials are securely stored and managed by Supabase.
- **Sign In** — returning users authenticate via Supabase's `signInWithPassword`, with session tokens handled automatically.
- **Sign Out** — session is cleared via `supabase.auth.signOut()`.
- **Protected Routes** — the checkout page (`order.html`) checks for an active Supabase session on load. Users who aren't logged in are redirected to `signin.html` and brought back after authentication.
- **Dynamic Navbar** — the navbar updates in real time based on auth state, showing the user's name and a Sign Out button when logged in.

### 📋 Form Handling

All form submissions are persisted directly to the Supabase database:

- **Contact Form** (`contact.html`) — messages are saved to a `contact_messages` table. Submissions are open to all visitors (no login required) and instantly available in the Supabase dashboard.
- **Checkout Form** (`order.html`) — order details (shipping address, cart items, total) are saved to an `orders` table, linked to the authenticated user's ID via Row Level Security (RLS) — so each user can only access their own orders.

---

## 🏛️ Pages & Features

| Page | Description |
|------|-------------|
| `index.html` | Homepage — Hero section, product categories, featured pieces |
| `order.html` | Order placement page |
| `cart.html` | Shopping cart with item management |
| `contact.html` | Contact form and store information |
| `signin.html` | User sign-in page |
| `signup.html` | New user registration |

---

## 🗂️ Project Structure

```
Velora-Luxury-Furniture/
│
├── index.html          # Main homepage
├── cart.html           # Shopping cart
├── contact.html        # Contact page
├── order.html          # Order page
├── signin.html         # Sign in page
├── signup.html         # Sign up page
│
├── css/
│   ├── style.css       # Global styles & design system
│   └── home.css        # Homepage-specific styles
│
├── js/
│   ├── main.js         # Core app logic (cart, auth, shared)
│   └── home.js         # Homepage interactions & product rendering
│
└── assets/             # Images & static resources
    ├── catLiving.jpg
    ├── catDining.jpg
    ├── catBedroom.jpg
    └── catHomeOffice.jpg
```

---

##  Collections

Velora features four curated furniture categories:

-  **Living Room** — 12 handcrafted pieces
-  **Dining Room** — 8 premium selections
-  **Bedroom** — 15 exclusive items
-  **Home Office** — 6 refined workspaces

---

## 🚀 Getting Started

No installation or build tools required. This is a pure HTML/CSS/JS project.

**Option 1 — Open directly:**
```bash
# Clone the repository
git clone https://github.com/Mohamed-Alkafory/Velora-Luxury-Furniture.git

# Open in browser
open index.html
```

**Option 2 — Use a local server (recommended):**
```bash
# With VS Code Live Server extension, or:
npx serve .

# Then visit http://localhost:3000
```

---

## 🎨 Design Highlights

- **Luxury aesthetic** with gold/warm tones and refined typography
- **Responsive layout** that adapts across all screen sizes
- **Smooth animations** with fade-up effects and staggered delays
- **Modular CSS** with global variables for consistent theming
- **ES Modules** for clean, maintainable JavaScript architecture
- **[Lucide Icons](https://lucide.dev/)** for crisp, modern iconography

---

## 👥 Contributors

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Mohamed-Alkafory">
        <img src="https://github.com/Mohamed-Alkafory.png" width="80px;" alt="Mohamed Hamed"/><br/>
        <b>Mohamed Hamed</b><br/>
        <sub>Lead Developer</sub>
      </a>
    </td>
    <td align="center">
      <a href="https://github.com/yousefmetawea">
        <img src="https://github.com/yousefmetawea.png" width="80px;" alt="Yousef Metawea"/><br/>
        <b>Yousef Metawea</b><br/>
        <sub>Contributor</sub>
      </a>
    </td>
  </tr>
</table>

---

<div align="center">

*Designed with passion. Built with precision.*

**[View Live →](https://velora-luxury-furniture.vercel.app)**

</div>
