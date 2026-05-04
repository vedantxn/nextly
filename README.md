<div align="center">
  
  # Nextly
  
  AI-powered Next.js application generator that transforms natural language prompts into production-ready code. From concept to deployment, skip the boilerplate and focus on what makes your project unique.

  [Watch Demo 🚀](https://nextly.live) | [X](https://x.com/vedantxn) | [LinkedIn](https://linkedin.com/in/vedantxn)
</div>


<div align="center">

![Next.js](https://img.shields.io/badge/Next.js-000000?style=for-the-badge&logo=nextdotjs&logoColor=white)
![React](https://img.shields.io/badge/React-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=for-the-badge&logo=typescript&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)
![tRPC](https://img.shields.io/badge/tRPC-2596BE?style=for-the-badge&logo=trpc&logoColor=white)
![Prisma](https://img.shields.io/badge/Prisma-2D3748?style=for-the-badge&logo=prisma&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=for-the-badge&logo=postgresql&logoColor=white)
![Better Auth](https://img.shields.io/badge/Better_Auth-111111?style=for-the-badge&logo=shield&logoColor=white)
![AWS](https://img.shields.io/badge/AWS-232F3E?style=for-the-badge&logo=amazonaws&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![Vercel Workflows](https://img.shields.io/badge/Vercel_Workflows-000000?style=for-the-badge&logo=vercel&logoColor=white)
![Vercel AI SDK](https://img.shields.io/badge/Vercel_AI_SDK-000000?style=for-the-badge&logo=vercel&logoColor=white)
![E2B](https://img.shields.io/badge/E2B-FF6B35?style=for-the-badge&logo=e2b&logoColor=white)

</div>

---

## Features

**⚡ Prompt-to-Code Next.js Apps**  
Transform natural language descriptions into complete Next.js applications with TypeScript and Tailwind CSS. No templates, no restrictions.

**🎯 Fast OpenAI-Powered Generation**  
Built around OpenAI models with a durable workflow runtime for multi-step code generation and result persistence.

**✨ No AI Boilerplate**  
Clean, idiomatic Next.js code without generic AI patterns. Every generation feels intentional, structured, and ready for real-world projects.

**🌐 Instant Live Preview**  
Every generation deploys automatically through e2b.app. Get a live demo URL instantly to test and share your application without configuration.

**🔄 Iterative Development**  
Refine your application through conversational prompts. Add features, adjust layouts, or fix issues without rewriting from scratch.

---
## Current Limitations

**⏱️ Extended Processing Time**  
Generation and deployment can still take several minutes because the app performs multi-step sandboxed code generation in a durable workflow.

**🔍 Manual Review Required**  
AI-generated code should always be reviewed before production use. While Nextly produces clean code, human oversight ensures it meets your specific requirements and edge cases.

**⚠️ Occasional TypeScript Errors**  
Being in beta, generated code may contain TypeScript or Next.js compilation errors. Most are minor and easily fixable, but debugging skills are recommended.

**⏰ Preview Expires Quickly**  
Deployed previews go down after 10-30 minutes due to budget constraints. Download your code immediately if you need to keep it or deploy elsewhere.

**🚦 Rate Limits Apply**  
Higher-than-average rate limits are in place, but still present. Heavy usage may trigger cooldown periods to maintain service stability for all users.

**📦 Best for Small to Medium Projects**  
Nextly excels at landing pages, portfolios, simple dashboards, and component libraries. Complex enterprise applications with intricate business logic, multi-step workflows, or extensive backend integration are not recommended. Keep projects focused and scoped appropriately.

---

## Example Prompts

<details>
<summary><strong>Landing Page</strong></summary>

Create a modern SaaS landing page for a project management tool. Include a hero section with a gradient background, headline "Manage Projects Effortlessly", subheadline, and two CTA buttons (Start Free Trial, Watch Demo). Add a features section with 6 feature cards in a grid layout, each with an icon, title, and description. Include a pricing section with 3 tiers (Starter $9/mo, Pro $29/mo, Enterprise custom) showing features as checkmarks. Add a testimonials carousel with 5 customer reviews including avatar, name, company, and quote. Footer should have 4 columns: Product links, Company links, Resources, and social media icons. Use a blue and white color scheme with smooth animations on scroll.

</details>

<details>
<summary><strong>Portfolio</strong></summary>

Build a portfolio website for a frontend developer. Create a hero section with my name "Alex Chen", tagline "Frontend Developer & UI Designer", and a profile image on the right. Add a projects section displaying 6 projects in a masonry grid layout. Each project card should have a thumbnail image, project title, tech stack tags (React, TypeScript, etc.), short description, and buttons for Live Demo and GitHub. Include an about section with a two-column layout: left side has my bio paragraph, right side lists technical skills grouped by category (Frontend, Backend, Tools) with progress bars showing proficiency. Add a contact section with a working form (name, email, message fields) and my email and LinkedIn links. Use a dark theme with green accent colors.

</details>

<details>
<summary><strong>Dashboard</strong></summary>

Generate an analytics dashboard for an e-commerce admin panel. Create a sidebar navigation on the left with menu items (Dashboard, Orders, Products, Customers, Analytics, Settings) with icons. The main content area should have 4 stat cards at the top showing Total Revenue, Orders Today, Active Users, and Conversion Rate with numbers and percentage changes (up/down arrows). Below that, add a 2-column layout: left side has a placeholder for a line chart showing revenue over time, right side shows recent orders table with columns (Order ID, Customer, Amount, Status). Status should have colored badges (Pending yellow, Completed green, Cancelled red). Add a top navbar with search bar, notifications bell icon, and user profile dropdown. Use a light gray background with purple accents.

</details>

<details>
<summary><strong>Blog</strong></summary>

Create a tech blog with a clean, readable design. Homepage should have a large featured post at the top with cover image, category badge, title, excerpt, author info (avatar, name, date), and read time. Below that, display 9 blog posts in a 3-column grid with smaller cards (thumbnail, category, title, excerpt, author, date). Add a sidebar on the right with search bar, popular posts widget (5 posts with thumbnails and titles), categories list, and newsletter signup form. Individual blog post page should have full-width cover image, title, author info, reading progress bar at top, formatted content with headings, code blocks, and blockquotes, and related posts at the bottom. Include a comment section placeholder. Use a serif font for article content and sans-serif for UI elements.

</details>

<details>
<summary><strong>Authentication</strong></summary>

Build complete authentication pages with modern design. Login page should have a centered card with logo at top, "Welcome Back" heading, email and password input fields with icons, "Remember Me" checkbox, "Forgot Password?" link, primary login button, divider with "or continue with", social login buttons (Google, GitHub, Twitter) with icons, and "Don't have an account? Sign up" link at bottom. Signup page similar layout but with Name, Email, Password, and Confirm Password fields. Add real-time password strength indicator showing Weak/Medium/Strong with colored bar. Include form validation with error messages below fields. Forgot password page should have email input and reset link button. Use gradient background with glassmorphism effect on the card.

</details>

<details>
<summary><strong>E-commerce Product Page</strong></summary>

Design a detailed product page for a sneaker store. Left side should have an image gallery with one large main image and 4 thumbnail images below that change the main image on click. Right side has product info: breadcrumb navigation, product name "Air Max 2024", star rating (4.5 stars with 230 reviews link), price with strikethrough original price showing discount, color selector with clickable color swatches, size selector with size buttons (US 7-13), stock status badge, quantity selector with plus/minus buttons, two CTA buttons (Add to Cart primary, Add to Wishlist secondary), and accordion sections for Description, Shipping Info, and Return Policy. Below the main section, add tabs for Reviews, Size Guide, and Product Details. At the bottom, show a "You May Also Like" section with 4 related product cards in a horizontal scroll. Use a modern, minimal design with black and white theme.

</details>

---

## Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| Framework | Next.js | React framework with App Router for modern web applications |
| Language | TypeScript | Type-safe development with enhanced IDE support |
| Styling | Tailwind CSS | Utility-first CSS framework for rapid UI development |
| Authentication | Better Auth | Session management and authentication infrastructure |
| Database | PostgreSQL | Relational database for application data storage |
| ORM | Prisma | Type-safe database client and schema management |
| API Layer | tRPC | End-to-end typesafe API without code generation |
| Background Jobs | Vercel Workflows | Durable orchestration for long-running generation jobs |
| Code Execution | E2B | Sandboxed environment for secure code execution and previews |
| Infrastructure | AWS | Cloud hosting and storage services |
| Containerization | Docker | Application packaging and deployment consistency |
| AI Runtime | Vercel AI SDK | Tool-calling runtime for code generation and model orchestration |
| AI Model | OpenAI | Direct OpenAI models for code generation and summarization |

---

## Local Development

**Prerequisites**
- Node.js 18+ and npm/yarn/pnpm
- PostgreSQL database
- Docker (optional)

**Clone the Repository**

```
git clone https://github.com/yourusername/nextly.git
cd nextly
```

**Install Dependencies**

```
npm install
```
or
```
pnpm install
```
**Environment Setup**

Create a `.env` file in the root directory:

```
DATABASE_URL="postgresql://user:password@localhost:5432/nextly"
DIRECT_URL="postgresql://user:password@localhost:5432/nextly"
BETTER_AUTH_SECRET="your_better_auth_secret"
BETTER_AUTH_URL="http://localhost:3000"
GOOGLE_CLIENT_ID="your_google_client_id"
GOOGLE_CLIENT_SECRET="your_google_client_secret"
GITHUB_CLIENT_ID="your_github_client_id"
GITHUB_CLIENT_SECRET="your_github_client_secret"
RESEND_API_KEY="your_resend_api_key"
EMAIL_FROM="noreply@example.com"
OPENAI_API_KEY="your_openai_api_key"
E2B_API_KEY="your_e2b_api_key"
SANDBOX_PROVIDER="e2b"
```
**Database Setup**
```
npx prisma generate
npx prisma db push
```
**Run Development Server**
```
npm run dev
```
Open `http://localhost:3000` in your browser.

**Build for Production**
```
npm run build
npm start
```
---
