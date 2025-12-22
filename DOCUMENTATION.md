# Landing Foundry - Complete Documentation

## Table of Contents

1. [Project Overview](#project-overview)
2. [System Architecture](#system-architecture)
3. [Technology Stack](#technology-stack)
4. [Project Structure](#project-structure)
5. [Getting Started](#getting-started)
6. [User Manual](#user-manual)
7. [Admin Manual](#admin-manual)
8. [Developer Guide](#developer-guide)
9. [Components Reference](#components-reference)
10. [Themes & Layouts](#themes--layouts)
11. [API Reference](#api-reference)
12. [CLI Tool Reference](#cli-tool-reference)
13. [Troubleshooting](#troubleshooting)

---

## Project Overview

**Landing Foundry** is a production-ready system that enables non-technical users to create beautiful, accessible landing pages through a simple form-based interface. It features:

- **Multi-step Form Wizard**: User-friendly interface for creating landing page configurations
- **Admin Dashboard**: GitHub-authenticated dashboard for validating and managing submissions
- **CLI Deployment Tool**: Command-line tool to generate, configure, and deploy landing pages
- **Classic Layout Template**: Beautiful, premium layout with animations and modern design
- **Theme System**: Built-in themes with automatic WCAG AA contrast compliance
- **Accessibility First**: Full keyboard navigation and ARIA labels throughout
- **GitHub Integration**: Automated repository creation and deployment

### Key Features

- ✅ WCAG AA compliant themes with automatic contrast enforcement
- ✅ Classic layout with premium animations and modern design
- ✅ Multi-step form with auto-save to localStorage
- ✅ Image upload with required alt text for accessibility
- ✅ Config validation with detailed error messages
- ✅ ZIP export/import for easy sharing
- ✅ GitHub OAuth authentication for admin access
- ✅ CLI tool for automated deployment to GitHub
- ✅ Ready for Vercel deployment

---

## System Architecture

### High-Level Flow

```
User (Friend)
    ↓
Multi-step Form (/submit)
    ↓
Config Validation
    ↓
ZIP Export (config.json + assets/)
    ↓
[Send to Admin]
    ↓
Admin Dashboard (/dashboard)
    ↓
Upload & Validate ZIP
    ↓
Preview & Approve
    ↓
CLI Tool (apply-config)
    ↓
Template Scaffolding
    ↓
GitHub Repository
    ↓
Vercel Deployment
    ↓
Live Landing Page
```

### Application Structure

The application consists of three main parts:

1. **Public-Facing Form** (`/submit`): Multi-step wizard for users to create landing page configurations
2. **Admin Dashboard** (`/dashboard`): Authentication-protected area for managing submissions
3. **Template System**: Three layout templates that can be scaffolded and configured

### Data Flow

1. **Config Creation**: Users fill out form → stored in `localStorage` → exported as ZIP
2. **Config Processing**: Admin uploads ZIP → validation → preview → CLI application
3. **Template Generation**: CLI scaffolds template → injects config → copies assets → creates GitHub repo
4. **Deployment**: Repository pushed to GitHub → imported to Vercel → deployed

---

## Technology Stack

### Core Technologies

- **Next.js 14.2**: React framework with App Router
- **TypeScript 5.4**: Type-safe JavaScript
- **React 18.3**: UI library
- **Tailwind CSS 3.4**: Utility-first CSS framework
- **ShadCN/UI**: Component library built on Radix UI

### Key Libraries

- **NextAuth.js**: Authentication (GitHub OAuth)
- **React Hook Form**: Form state management
- **Zod**: Schema validation
- **JSZip**: ZIP file creation/extraction
- **FileSaver.js**: Client-side file downloads
- **Octokit**: GitHub API client
- **Commander**: CLI argument parsing

### Development Tools

- **Jest**: Testing framework
- **ESLint**: Code linting
- **PostCSS**: CSS processing
- **pnpm**: Package manager

---

## Project Structure

```
landing-page-auto/
├── app/                          # Next.js App Router
│   ├── (public)/                 # Public route group
│   │   └── submit/               # Submission form
│   │       ├── page.tsx          # Main form page
│   │       └── components/       # Form step components
│   │           ├── PersonalInfoStep.tsx
│   │           ├── AboutStep.tsx
│   │           ├── SkillsStep.tsx
│   │           ├── ExperienceStep.tsx
│   │           ├── PortfolioStep.tsx
│   │           ├── ReviewStep.tsx
│   │           └── StepIndicator.tsx
│   ├── (admin)/                  # Admin route group
│   │   └── dashboard/
│   │       ├── page.tsx          # Dashboard main page
│   │       └── preview/          # Live preview
│   │           └── page.tsx
│   ├── api/                      # API routes
│   │   ├── auth/                 # NextAuth routes
│   │   │   └── [...nextauth]/
│   │   │       └── route.ts
│   │   └── inject-config/        # Config injection API
│   │       └── route.ts
│   ├── layout.tsx                # Root layout
│   ├── page.tsx                  # Home page (landing page viewer)
│   ├── providers.tsx             # React context providers
│   └── globals.css               # Global styles
│
├── components/                   # React components
│   ├── Header.tsx                # Site header/navigation
│   ├── Hero.tsx                  # Hero section
│   ├── About.tsx                 # About section
│   ├── Skills.tsx                # Skills section
│   ├── Experience.tsx            # Experience section
│   ├── Portfolio.tsx             # Portfolio section
│   ├── Footer.tsx                # Footer
│   └── ui/                       # ShadCN UI components
│       ├── button.tsx
│       ├── card.tsx
│       ├── input.tsx
│       ├── label.tsx
│       ├── progress.tsx
│       ├── select.tsx
│       ├── textarea.tsx
│       ├── toast.tsx
│       ├── toaster.tsx
│       └── use-toast.ts
│
├── lib/                          # Utility libraries
│   ├── auth.ts                   # NextAuth configuration
│   ├── themes.ts                 # Theme generation & tokens
│   ├── validate.ts               # Config validation (Zod schemas)
│   ├── zip.ts                    # ZIP export/import utilities
│   ├── utils.ts                  # General utilities (cn function)
│   ├── accessibility.ts          # Accessibility utilities
│
├── types/                        # TypeScript types
│   └── site.ts                   # SiteConfig and related types
│
├── templates/                    # Layout templates
│   ├── classic/                  # Classic layout template
│   │   ├── app/
│   │   │   ├── layout.tsx
│   │   │   └── page.tsx
│   │   ├── components/           # Template-specific components
│   │   ├── globals.css
│   │   ├── package.json
│   │   ├── tailwind.config.js
│   │   └── site.config.json
│
├── tools/                        # CLI tool
│   └── cli/
│       ├── index.ts              # CLI entry point
│       └── lib/
│           ├── config.ts         # Config file reading
│           ├── fs.ts             # File system operations
│           └── octokit.ts        # GitHub API client
│
├── submissions/                  # User submissions (local)
│   └── [username]/
│       ├── config.json
│       └── assets/
│
├── public/                       # Static assets
│   └── uploads/                  # User-uploaded images
│
├── scripts/                      # Utility scripts
│   └── seed.ts                   # Sample data generator
│
├── __tests__/                    # Test files
│   ├── theme.test.ts
│   └── validate.test.ts
│
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json                  # Dependencies
└── site.config.json              # Current site configuration
```

---

## Getting Started

### Prerequisites

- **Node.js 18+** and **pnpm** installed
- **GitHub account** with:
  - OAuth App (for admin authentication)
  - Personal Access Token with `repo` scope (for CLI)
- **Vercel account** (for deployment)

### Installation

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd landing-page-auto
   ```

2. **Install dependencies**:
   ```bash
   pnpm install
   ```

3. **Set up environment variables**:

   Create a `.env.local` file in the root directory:
   ```env
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=<generate-with-openssl-rand-base64-32>
   GITHUB_ID=<your-github-oauth-app-client-id>
   GITHUB_SECRET=<your-github-oauth-app-client-secret>
   GITHUB_TOKEN=<your-github-personal-access-token>
   ADMIN_GITHUB_LOGINS=<comma-separated-github-usernames>
   OWNER_GITHUB_USERNAME=<your-github-username>
   ```

   **How to get GitHub OAuth credentials**:
   - Go to GitHub → Settings → Developer settings → OAuth Apps
   - Create new OAuth App
   - Set Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
   - Copy Client ID and Client Secret

   **How to generate NEXTAUTH_SECRET**:
   ```bash
   openssl rand -base64 32
  **For Windows **:
  -join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | ForEach-Object {[char]$_})
  ```

   **How to create GitHub Personal Access Token**:
   - Go to GitHub → Settings → Developer settings → Personal access tokens → Tokens (classic)
   - Generate new token with `repo` scope
   - Copy the token

4. **Run the development server**:
   ```bash
   pnpm dev
   ```

5. **Open your browser**:
   Navigate to `http://localhost:3000`

---

## User Manual

This section is for **non-technical users** (friends) who want to create their landing page.

### Step 1: Access the Form

Navigate to `/submit` or click the "Create Your Landing Page" button.

### Step 2: Fill Out the Form

The form is divided into 6 steps:

#### **Step 1: Personal Info**
- **Full Name** (required): Your full name
- **Headline** (required): A short tagline (e.g., "Senior Software Engineer")
- **Subheadline** (optional): A longer description
- **Email** (optional): Your contact email

**Tip**: Your headline appears prominently at the top of your page.

#### **Step 2: About**
- **Bio** (required): Write a detailed biography about yourself
- **Image** (optional): Upload a photo of yourself
  - **Alt Text** (required if image uploaded): Describe the image for accessibility
  - Supported formats: JPG, PNG, WebP

**Tip**: Your bio appears in the "About" section. Be detailed and authentic!

#### **Step 3: Skills**
Add your skills with proficiency levels:

- **Skill Name** (required): e.g., "JavaScript", "Python", "React"
- **Level** (optional): Choose from:
  - **Beginner**: Just starting out
  - **Intermediate**: Some experience
  - **Advanced**: Expert level

Click "Add Skill" to add more skills.

**Tip**: Focus on your strongest skills that you want to highlight.

#### **Step 4: Experience**
Add your work experience:

- **Role** (required): Job title (e.g., "Software Engineer")
- **Company** (required): Company name
- **Start Date** (required): e.g., "June 2024"
- **End Date** (optional): "Present" or specific date
- **Achievements** (required): Bullet points describing your accomplishments
  - Click "Add Bullet" to add more points

Click "Add Experience" to add more positions.

**Tip**: Use action verbs and quantify your achievements when possible.

#### **Step 5: Portfolio**
Add your projects:

- **Title** (required): Project name
- **Description** (required): Detailed project description
- **Image** (required): Screenshot or image of the project
  - **Alt Text** (required): Describe the image
- **Tags** (optional): Technologies used (e.g., "React", "TypeScript")
- **Links** (optional):
  - **Label**: e.g., "Live Demo", "GitHub"
  - **URL**: Full URL to the link

Click "Add Project" to add more projects.

**Tip**: Include your best projects with clear descriptions and links.

#### **Step 6: Review**

Review all your information and make final selections:

- **Theme**: Choose from:
  - **Noir**: Grayscale monochrome with subtle accent
  - **Neon Noir**: Deep slate/black with neon accent
  - **Slate Pop**: Neutral slate base with bold accent

- **Layout**: Classic layout with cards, grids, and modern animations

**Preview**: Scroll through all sections to verify everything looks correct.

### Step 3: Export Your Configuration

1. Click **"Export ZIP"** button
2. A ZIP file will download with:
   - `config.json`: Your configuration
   - `assets/`: All your uploaded images

**File naming**: The ZIP file will be named like `landing-page-firstname-lastname-[timestamp].zip`

### Step 4: Send to Admin

Send the ZIP file to the admin via email, messaging, or file sharing service.

**Note**: The form auto-saves your progress to your browser's local storage, so you can come back later!

---

## Admin Manual

This section is for **administrators** who manage and deploy landing pages.

### Authentication

1. Navigate to `/dashboard`
2. You'll be redirected to GitHub OAuth login
3. Only GitHub usernames in `ADMIN_GITHUB_LOGINS` can access

### Dashboard Features

#### Upload and Validate

1. **Upload ZIP File**:
   - Click "Choose File" in the "Upload ZIP File" card
   - Select the ZIP file from the user
   - The system will automatically extract and validate the configuration

2. **Review Validation Results**:
   - ✅ **Green Checkmark**: Configuration is valid
   - ❌ **Red X**: Configuration has errors
   - If errors exist, view them in the "Errors" section
   - Valid configs show a summary with:
     - Name, Layout, Theme
     - Counts of Skills, Experience entries, Projects

#### Actions Available

Once a valid configuration is uploaded:

1. **Inject to Codebase**:
   - Saves config to `site.config.json` in the project root
   - Saves assets to `public/uploads/`
   - Useful for local testing/preview

2. **Prepare Ready-to-Apply Bundle**:
   - Downloads a cleaned-up ZIP file
   - Useful for archiving or sharing with other admins

3. **View Live Preview**:
   - Navigates to `/dashboard/preview`
   - Shows how the landing page will look
   - Uses the uploaded configuration

### Deploying with CLI

#### Step 1: Extract the ZIP

Extract the user's ZIP file to the `submissions` folder:

**Windows (PowerShell)**:
```powershell
Expand-Archive -Path "path/to/landing-page-username-1234567890.zip" -DestinationPath "submissions/username" -Force
```

**Mac/Linux**:
```bash
unzip path/to/landing-page-username-1234567890.zip -d submissions/username
```

**Expected structure**:
```
submissions/username/
├── config.json
└── assets/
    ├── about-1234567890.jpg
    └── project-0-1234567890.png
```

#### Step 2: Set GitHub Token

**Windows (PowerShell)**:
```powershell
$env:GITHUB_TOKEN = "ghp_your_token_here"
```

**Mac/Linux**:
```bash
export GITHUB_TOKEN="ghp_your_token_here"
```

#### Step 3: Run CLI Command

Navigate to the project root and run:

```bash
pnpm exec tsx tools/cli/index.ts apply-config \
  --config ./submissions/username/config.json \
  --assets ./submissions/username/assets \
  --layout classic \
  --repo landing-page-username \
  --owner YOUR_GITHUB_USERNAME \
  --create-repo \
  --push
```

**Parameters explained**:
- `--config`: Path to the extracted `config.json`
- `--assets`: Path to the extracted `assets` folder
- `--repo`: GitHub repository name (optional, auto-generated if omitted)
- `--owner`: Your GitHub username
- `--create-repo`: Creates a new GitHub repository
- `--push`: Pushes code to GitHub after scaffolding
- `--private`: (optional) Create private repository instead of public

**Example**:
```bash
# Extract first
Expand-Archive -Path "$HOME/Downloads/landing-page-jane-doe-1762934534220.zip" -DestinationPath "submissions/jane-doe" -Force

# Set token
$env:GITHUB_TOKEN = "ghp_abc123xyz"

# Deploy
pnpm exec tsx tools/cli/index.ts apply-config \
  --config ./submissions/jane-doe/config.json \
  --assets ./submissions/jane-doe/assets \
  --layout classic \
  --repo landing-page-jane-doe \
  --owner maximillionare2030 \
  --create-repo \
  --push
```

#### What the CLI Does

1. ✅ **Validates** `config.json` against the schema
2. ✅ **Scaffolds** the selected template into the current directory
3. ✅ **Copies** images from `assets/` to `public/uploads/`
4. ✅ **Updates** image paths in config to `/uploads/...`
5. ✅ **Writes** `site.config.json` to the project root
6. ✅ **Generates** fresh `pnpm-lock.yaml` matching template's `package.json`
7. ✅ **Initializes** git repository
8. ✅ **Creates** GitHub repository (if `--create-repo` is used)
9. ✅ **Pushes** code to GitHub (if `--push` is used)

#### Step 4: Deploy to Vercel

1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click **"Add New Project"**
4. Import the GitHub repository (e.g., `landing-page-jane-doe`)
5. Vercel auto-detects Next.js settings
6. Click **"Deploy"**!

The landing page will be live at `https://[repo-name].vercel.app`

---

## Developer Guide

### Component Architecture

#### Landing Page Components

All landing page components follow a similar pattern:

```typescript
interface ComponentProps {
  config: SiteConfig;
}

export function Component({ config }: ComponentProps) {
  // Component implementation
}
```

**Component List**:
- `Header`: Site header with navigation (name, email, socials)
- `Hero`: Hero section with avatar, headline, subheadline
- `About`: About section with bio and image
- `Skills`: Skills grid with proficiency levels
- `Experience`: Experience timeline/list
- `Portfolio`: Portfolio projects grid
- `Footer`: Site footer

#### Form Components

Form step components use React Hook Form:

```typescript
interface StepProps {
  form: UseFormReturn<SiteConfig>;
  // Additional step-specific props
}
```

**Form Steps**:
- `PersonalInfoStep`: Basic user information
- `AboutStep`: Bio and about image
- `SkillsStep`: Dynamic skills list
- `ExperienceStep`: Dynamic experience entries
- `PortfolioStep`: Dynamic portfolio projects
- `ReviewStep`: Final review and theme/layout selection

### Theme System

Themes are managed in `lib/themes.ts`:

#### Theme Presets

Three built-in themes:

1. **Noir**: `themePresets.noir`
   - Grayscale monochrome
   - Subtle accent color
   - Default brand hex: `#6b7280`

2. **Neon Noir**: `themePresets["neon-noir"]`
   - Deep slate/black background
   - Neon accent colors (teal/pink/citrus)
   - Default brand hex: `#00f5ff`

3. **Slate Pop**: `themePresets["slate-pop"]`
   - Neutral slate base
   - Bold accent color
   - Default brand hex: `#3b82f6`

#### Custom Brand Colors

Users can provide a custom `brandHex` color:

```typescript
import { generateThemeFromBrand } from '@/lib/themes';

const tokens = generateThemeFromBrand('#ff6b6b', darkMode: true);
```

The system automatically:
- Converts hex to HSL
- Generates accent variations
- Adjusts colors for WCAG AA contrast compliance

#### WCAG AA Compliance

The theme system enforces WCAG AA contrast ratios:

- **Normal text**: 4.5:1 contrast ratio minimum
- **Large text**: 3:1 contrast ratio minimum

Colors are automatically adjusted if they don't meet requirements:

```typescript
import { meetsAAContrast } from '@/lib/themes';

const isValid = meetsAAContrast('#000000', '#ffffff'); // true
```

### Validation System

Configuration validation uses **Zod** schemas:

```typescript
import { siteConfigSchema, validateSiteConfig } from '@/lib/validate';

const result = validateSiteConfig(data);

if (result.success) {
  // result.data contains validated SiteConfig
} else {
  // result.errors contains ZodError
}
```

**Validation Rules**:
- `name`: Required, non-empty string
- `headline`: Required, non-empty string
- `about.bio`: Required, non-empty string
- `skills`: Array with at least 1 item, each with required `name`
- `experience`: Array with at least 1 item, each with:
  - Required: `role`, `company`, `start`
  - At least 1 bullet point
- `portfolio`: Array with at least 1 item, each with:
  - Required: `title`, `description`, `image`
  - Optional: `tags`, `links` (validated if present)

### ZIP Handling

ZIP operations are in `lib/zip.ts`:

#### Exporting

```typescript
import { exportSiteConfig } from '@/lib/zip';

await exportSiteConfig(config, assetsMap);
// Downloads ZIP file automatically
```

#### Importing

```typescript
import { extractFromZip } from '@/lib/zip';

const { config, assets } = await extractFromZip(zipBlob);
```

**ZIP Structure**:
```
landing-page-username-timestamp.zip
├── config.json
└── assets/
    ├── about-1234567890.jpg
    └── project-0-1234567890.png
```

### Authentication

Authentication uses **NextAuth.js** with GitHub OAuth:

**Configuration** (`lib/auth.ts`):
```typescript
export const authOptions: NextAuthOptions = {
  providers: [GitHub({ ... })],
  callbacks: {
    async signIn({ profile }) {
      // Check if user is in ADMIN_GITHUB_LOGINS
    }
  }
}
```

**Usage in components**:
```typescript
import { useSession, signIn, signOut } from 'next-auth/react';

const { data: session, status } = useSession();

if (status === 'loading') return <Loading />;
if (!session) return <SignInButton />;
```

**Protected Routes**:
Admin routes automatically redirect to GitHub OAuth if not authenticated.

### API Routes

#### `/api/inject-config` (POST)

Injects config and assets into the codebase (admin only).

**Request**:
- `config`: JSON string of SiteConfig
- `assets`: Array of File objects

**Response**:
```json
{
  "success": true,
  "message": "Config and assets injected successfully",
  "configPath": "site.config.json",
  "assets": ["/uploads/about.jpg", ...]
}
```

### CLI Tool Architecture

The CLI tool (`tools/cli/index.ts`) uses **Commander.js**:

**Command Structure**:
```bash
pnpm exec tsx tools/cli/index.ts <command> [options]
```

**Available Commands**:
- `apply-config`: Apply config to template

**CLI Modules**:
- `lib/config.ts`: Reads and validates config.json
- `lib/fs.ts`: File system operations (scaffold, copy, git)
- `lib/octokit.ts`: GitHub API client

**Scaffolding Process**:
1. Copy template directory to target
2. Update image paths in config
3. Copy assets to `public/uploads/`
4. Write `site.config.json`
5. Generate `pnpm-lock.yaml`
6. Initialize git and push (optional)

### Testing

Tests use **Jest**:

```bash
pnpm test
```

**Test Files**:
- `__tests__/theme.test.ts`: Theme generation and contrast
- `__tests__/validate.test.ts`: Config validation

**Example Test**:
```typescript
import { meetsAAContrast } from '@/lib/themes';

test('white on black meets AA contrast', () => {
  expect(meetsAAContrast('#ffffff', '#000000')).toBe(true);
});
```

### Accessibility Features

All components include accessibility features:

1. **Keyboard Navigation**:
   - All interactive elements are keyboard accessible
   - Focus-visible states for clear focus indicators
   - Tab order is logical

2. **ARIA Labels**:
   ```tsx
   <a href="..." aria-label="GitHub profile">GitHub</a>
   ```

3. **Alt Text**:
   - All images require alt text
   - Enforced during form submission

4. **Semantic HTML**:
   - Proper heading hierarchy
   - Semantic elements (`<section>`, `<nav>`, `<main>`)

5. **Color Contrast**:
   - WCAG AA compliant themes
   - Automatic contrast adjustment

---

## Components Reference

### Landing Page Components

#### `<Header config={config} />`

Displays site header with name, email, and social links.

**Props**:
- `config: SiteConfig`

**Renders**:
- Site name
- Email link (if provided)
- Social links (GitHub, LinkedIn, Website)

---

#### `<Hero config={config} />`

Hero section with avatar, headline, and subheadline.

**Props**:
- `config: SiteConfig`

**Renders**:
- Avatar image (if `config.images.avatar` exists)
- Headline (`config.headline`)
- Subheadline (`config.subheadline`)
- Social links

---

#### `<About config={config} />`

About section with biography and optional image.

**Props**:
- `config: SiteConfig`

**Renders**:
- Bio text (`config.about.bio`)
- About image (if `config.about.image` exists)

---

#### `<Skills config={config} />`

Skills grid showing all skills with proficiency levels.

**Props**:
- `config: SiteConfig`

**Renders**:
- Grid of skill cards
- Skill name
- Proficiency badge (beginner/intermediate/advanced)

---

#### `<Experience config={config} />`

Experience timeline/list showing work history.

**Props**:
- `config: SiteConfig`

**Renders**:
- Experience entries with:
  - Role and company
  - Date range
  - Bullet points

**Layout**: Classic layout with animated cards and timeline visualization.

---

#### `<Portfolio config={config} />`

Portfolio grid showing projects.

**Props**:
- `config: SiteConfig`

**Renders**:
- Project cards with:
  - Project image
  - Title and description
  - Tags (if provided)
  - Links (if provided)

---

#### `<Footer config={config} />`

Site footer with copyright and links.

**Props**:
- `config: SiteConfig`

**Renders**:
- Copyright notice
- Social links
- Email

---

### Form Step Components

All form components use React Hook Form and accept `form: UseFormReturn<SiteConfig>`.

#### `<PersonalInfoStep form={form} />`

Step 1: Personal information fields.

#### `<AboutStep form={form} aboutImage={...} onAboutImageChange={...} />`

Step 2: Bio textarea and image upload.

#### `<SkillsStep form={form} />`

Step 3: Dynamic skills list with add/remove.

#### `<ExperienceStep form={form} />`

Step 4: Dynamic experience entries with add/remove.

#### `<PortfolioStep form={form} projectImages={...} onProjectImageChange={...} />`

Step 5: Dynamic portfolio projects with add/remove.

#### `<ReviewStep form={form} />`

Step 6: Review all data and select theme/layout.

---

## Themes & Layouts

### Themes

#### Noir

- **Style**: Grayscale monochrome
- **Background**: Deep black (`#0a0a0a`)
- **Accent**: Subtle gray (`#9ca3af`)
- **Best for**: Professional, minimalist portfolios

#### Neon Noir

- **Style**: Dark with neon accents
- **Background**: Deep black (`#0a0a0a`)
- **Accent**: Neon teal/pink (`#00f5ff` / `#ff00ff`)
- **Best for**: Tech-focused, creative portfolios

#### Slate Pop

- **Style**: Neutral slate with bold accent
- **Background**: Dark slate (`#0f172a`)
- **Accent**: Bright blue/orange (`#3b82f6` / `#f59e0b`)
- **Best for**: Modern, vibrant portfolios

### Layouts

#### Classic

- **Structure**: Traditional cards and grids
- **Experience**: Card-based layout
- **Spacing**: Standard padding and margins
- **Best for**: Comprehensive portfolios with lots of content


---

## API Reference

### `/api/auth/[...nextauth]`

NextAuth.js authentication endpoint.

**Methods**: `GET`, `POST`

**Routes**:
- `/api/auth/signin`: Sign in page
- `/api/auth/callback/github`: GitHub OAuth callback
- `/api/auth/session`: Get current session
- `/api/auth/signout`: Sign out

---

### `/api/inject-config` (POST)

Inject configuration and assets into codebase.

**Authentication**: Required (GitHub OAuth)

**Request**:
- `Content-Type`: `multipart/form-data`
- `config`: JSON string of `SiteConfig`
- `assets`: Array of `File` objects

**Response** (200 OK):
```json
{
  "success": true,
  "message": "Config and assets injected successfully",
  "configPath": "site.config.json",
  "assets": ["/uploads/about.jpg", "/uploads/project-0.png"]
}
```

**Response** (401 Unauthorized):
```json
{
  "error": "Unauthorized"
}
```

**Response** (500 Error):
```json
{
  "error": "Failed to inject config",
  "details": "Error message"
}
```

---

## CLI Tool Reference

### `apply-config`

Apply a configuration to a template and optionally deploy to GitHub.

**Usage**:
```bash
pnpm exec tsx tools/cli/index.ts apply-config [options]
```

**Required Options**:
- `--config <path>`: Path to `config.json` file
- `--assets <path>`: Path to assets directory

**Optional Options**:
- `--theme <theme>`: Override theme ID
- `--repo <name>`: Repository name (defaults to pattern)
- `--owner <username>`: GitHub username (required for `--create-repo`)
- `--create-repo`: Create GitHub repository
- `--private`: Create private repository
- `--push`: Push to GitHub after applying
- `--target <path>`: Target directory (defaults to current directory)
- `--template-path <path>`: Path to templates directory (defaults to `./templates`)

**Environment Variables**:
- `GITHUB_TOKEN`: Required for `--create-repo` and `--push`

**Example**:
```bash
pnpm exec tsx tools/cli/index.ts apply-config \
  --config ./submissions/user/config.json \
  --assets ./submissions/user/assets \
  --layout classic \
  --repo landing-page-user \
  --owner username \
  --create-repo \
  --push
```

---

## Troubleshooting

### Common Issues

#### CLI Import Errors

**Problem**: Module import errors when running CLI

**Solution**: Use `pnpm exec tsx` instead of direct execution:
```bash
pnpm exec tsx tools/cli/index.ts apply-config ...
```

#### Git Commit Errors

**Problem**: "Nothing to commit" error during CLI execution

**Solution**: This is expected if the directory already has git initialized. The CLI will continue.

#### Missing GitHub Token

**Problem**: CLI fails with "GITHUB_TOKEN environment variable is required"

**Solution**: Set the environment variable:
```bash
# Windows (PowerShell)
$env:GITHUB_TOKEN = "your-token"

# Mac/Linux
export GITHUB_TOKEN="your-token"
```

#### Vercel Build Errors (pnpm-lock.yaml mismatch)

**Problem**: Lockfile mismatch errors during Vercel build

**Solution**: The CLI automatically generates a fresh `pnpm-lock.yaml`. If issues persist:
1. Check that the template's `package.json` is valid
2. Manually run `pnpm install` in the deployed repo directory before pushing

#### Image Path Issues

**Problem**: Images don't display after deployment

**Solution**:
1. Verify assets were copied to `public/uploads/`
2. Check image paths in `site.config.json` start with `/uploads/`
3. Ensure images are committed to git

#### Authentication Issues

**Problem**: Can't access admin dashboard

**Solution**:
1. Verify GitHub OAuth app is configured correctly
2. Check `ADMIN_GITHUB_LOGINS` includes your GitHub username
3. Ensure `NEXTAUTH_SECRET` is set
4. Clear browser cookies and try again

#### Validation Errors

**Problem**: Config validation fails

**Solution**:
1. Check the error messages in the dashboard
2. Ensure all required fields are filled
3. Verify URLs are valid (including `http://` or `https://`)
4. Check that arrays (skills, experience, portfolio) have at least one item

---

## Additional Resources

### File Structure Best Practices

- Keep components focused and single-purpose
- Use TypeScript for type safety
- Follow the existing naming conventions
- Add JSDoc comments for complex functions

### Contributing

1. Create a feature branch
2. Make your changes
3. Write tests for new functionality
4. Ensure all tests pass
5. Submit a pull request

### Performance Considerations

- Images are optimized by Next.js Image component
- Form data is auto-saved to localStorage
- Config is read from filesystem at build time
- No database required (file-based configuration)

### Security Notes

- Admin routes are protected by NextAuth
- File uploads are limited to images
- Config validation prevents injection attacks
- GitHub tokens should be kept secure

---

## Conclusion

Landing Foundry provides a complete solution for creating, managing, and deploying beautiful landing pages. The system is designed to be user-friendly for non-technical users while providing powerful tools for administrators.

For questions or issues, please refer to the troubleshooting section or open an issue on GitHub.

