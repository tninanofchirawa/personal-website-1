# 📖 The Complete Handbook to Timothy's Website

> **Welcome!** This book explains every part of your GitHub Pages website — what is happening where, how the files are structured, and how you can easily edit any section manually in the future.

---

## 📑 Table of Contents
1. [Architecture & How It Works](#1-architecture--how-it-works)
2. [Master File & Directory Map](#2-master-file--directory-map)
3. [Design & Typography System](#3-design--typography-system)
4. [Step-by-Step Manual Editing Guides](#4-step-by-step-manual-editing-guides)
   - [Editing the Monthly Promise Verse (Home)](#guide-1-editing-the-monthly-promise-verse-home)
   - [Adding / Changing Photos in About Me (`personal.html`)](#guide-2-adding--changing-photos-in-about-me)
   - [Adding Questions to the Q&A Accordion (`q-a/index.html`)](#guide-3-adding-questions-to-the-qa-accordion)
   - [Adding Tests or Editing the Syllabus (`math-club/training-camp.html`)](#guide-4-adding-tests-or-editing-the-syllabus)
   - [Updating Photos in SDG (`sdg.html`) & Math Club (`math-club/index.html`)](#guide-5-updating-photos-in-sdg--math-club)
   - [Editing Data Science Surveys & Reports (`d-s/1-start.html`)](#guide-6-editing-data-science-surveys--reports)
   - [How the DSA / CSES GitHub API Works (`Nd-s/cses.html`)](#guide-7-how-the-dsa--cses-github-api-works)
   - [Editing the Floating Google Form Banner](#guide-8-editing-the-floating-google-form-banner)
   - [Editing the Navigation Bar (`navbar.html`)](#guide-9-editing-the-navigation-bar)
   - [Updating the Footer (`footer.html`)](#guide-10-updating-the-footer)
5. [Summary of Cleanups & Optimizations Made](#5-summary-of-cleanups--optimizations-made)
6. [Testing Locally & Pushing to GitHub](#6-testing-locally--pushing-to-github)

---

## 1. Architecture & How It Works

This website is statically generated using **Jekyll**, the native engine supported by **GitHub Pages**.

```
[Markdown / HTML Files with Front Matter]
                │
                ▼
     [Jekyll Engine (Ruby)]
   Combines _layouts/default.html + _includes/ + assets/
                │
                ▼
      [_site/ (Static Output)]
   Hosted free & automatically on GitHub Pages!
```

### The Key Concepts:
1. **Front Matter (`--- ... ---`)**: Every page starts with metadata between triple dashes. Jekyll reads this to set the layout, title, hero image, and custom data lists (like photos or FAQ questions).
2. **Layouts (`_layouts/`)**: The master HTML skeleton (`default.html`). It contains `<head>`, `navbar`, the hero banner, and the footer.
3. **Includes (`_includes/`)**: Small, reusable building blocks (e.g., `navbar.html`, `footer.html`, `floating-banner.html`).
4. **Assets (`assets/css/custom.css`)**: All site-wide CSS, animations, and typography rules in one centralized stylesheet.

---

## 2. Master File & Directory Map

Here is the exact map of your repository and what each file does:

```
personal-website-1/
│
├── _config.yml                     # Site settings: title, GitHub Pages baseurl, Google Analytics ID
├── assets/
│   └── css/
│       └── custom.css              # Central stylesheet: fonts, hero banner, hover cards, floating banner
│
├── _layouts/
│   └── default.html                # Master HTML template for EVERY page on the site
│
├── _includes/
│   ├── head.html                   # HTML <head>: loads fonts, Bootstrap CSS, custom.css
│   ├── navbar.html                 # Top navigation bar with dropdown menus
│   ├── footer.html                 # Dark footer with email contact & timestamp
│   ├── floating-banner.html        # Floating Google Form pill button at the bottom of the screen
│   ├── analytics-events.html       # Google Analytics click tracking for navigation items
│   └── google-analytics.html       # Official Google Analytics (gtag.js) script
│
├── index.html                      # Home Page: Monthly Promise Verse, Main Index cards, Purpose
├── personal.html                   # About Me: Intro text, HITS Campus Photo Carousel, Outside Events
│
├── d-s/                            # Data Science Section
│   ├── index.html                  # Welcome letter & links to DS subpages
│   ├── 1-start.html                # Project 1: Sleep Habits survey, Google Form cards, report iframes
│   └── 2-still-start.html          # Project 2: Coming soon placeholder
│
├── Nd-s/                           # Non-Data Science & Programming Section
│   ├── projects.html               # Independent utilities: YouTube Cleaner & YouTube Downloader cards
│   ├── cses.html                   # CSES DSA solver index (fetches folders from GitHub API)
│   └── cses-folder.html            # CSES detail page (fetches C++ solution files dynamically)
│
├── math-club/                      # Mathematics Club Section
│   ├── index.html                  # Club overview, cards for HPL/SDG/Camp, photo highlights slider
│   ├── hpl.html                    # Hindustan Premier League (HPL): Behind-the-scenes, poster, video
│   ├── hpl2.html                   # Draft / placeholder page
│   ├── sdg.html                    # National Science Day (SDG): 2nd place recap, poster, photo carousel
│   └── training-camp.html          # September 2025 Camp: Recap, GDrive folder, 3-part Test Series
│
├── q-a/                            # Q&A & Policy Section
│   ├── index.html                  # Embedded Privacy Policy PDF + Interactive Q&A Accordion
│   └── 1-qa.html                   # "Interesting Finds": Excel / YouTube creator recommendation
│
├── Docs and Pics/                  # Media archive: images, GIFs, and reference documents
├── Gemfile & Gemfile.lock          # Ruby gem dependencies (Jekyll, Minima theme)
├── README.md                       # GitHub landing page overview
└── HANDBOOK.md                     # THIS BOOK!
```

---

## 3. Design & Typography System

Your preferred typography is preserved and loaded once in `_includes/head.html`:

| Font Family | Where It Is Used | CSS Selector |
| :--- | :--- | :--- |
| **Gentium Basic** (Serif) | Main Page Titles | `h1`, `.hero-banner h1` |
| **Oswald** (Sans-Serif, 500) | Section Sub-Headings | `h2`, `h3` |
| **Times New Roman** | Body Paragraphs | `p`, `.times-text` |
| **EB Garamond** (Serif) | Elegant Verses & Callouts | `.special-garamond` |
| **Plus Jakarta Sans** | Modern Technical Cards | `.custom-font-container` |
| **JetBrains Mono** | Code & Metadata Badges | `.mono-tag` |

> [!TIP]
> All font sizing, transitions, and hover animations live in `assets/css/custom.css`. If you ever want to adjust button animations or card lift heights, edit that single file!

---

## 4. Step-by-Step Manual Editing Guides

### Guide 1: Editing the Monthly Promise Verse (Home)
**File to edit:** [`index.html`](file:///c:/Users/rohan/Documents/%23%23%20Code/2%29%20May%20-%202026/personal-website-1/index.html)

Open `index.html`. Lines 13 to 30 contain the verse block:
```html
<h2 class="mb-3 border-bottom pb-2">Promise Verse for November 2026</h2>

<blockquote class="special-garamond text-muted fw-bold mb-0">
  <p class="mb-3">
    Your new verse text goes here...<br>
    Second line of the verse...
  </p>
  <footer class="text-secondary fw-normal">
    — Scripture Reference (e.g. John 3:16)
  </footer>
</blockquote>
```
*Just change the month name, verse text, and footer reference, then save!*

---

### Guide 2: Adding / Changing Photos in About Me
**File to edit:** [`personal.html`](file:///c:/Users/rohan/Documents/%23%23%20Code/2%29%20May%20-%202026/personal-website-1/personal.html)

You no longer have to touch complex HTML carousel tags! Photos are listed cleanly in the front matter:
```yaml
hits_gallery:
  - image: Docs and Pics/Pictures/Public/Personal/Images/HITS events/0) Mig-fighter.jpg
    caption: 📸 Mig Fighter
    alt: Mig Fighter
  - image: Docs and Pics/Pictures/Public/Personal/Images/HITS events/1) a-small-dance-event-at-hits.jpg
    caption: 📸 Dance Events (happen every now and then)
    alt: Dance Events
```
**To add a new photo:**
Copy an existing item, paste it at the bottom of `hits_gallery`, and update the file path and caption. The carousel automatically displays it on the website!

---

### Guide 3: Adding Questions to the Q&A Accordion
**File to edit:** [`q-a/index.html`](file:///c:/Users/rohan/Documents/%23%23%20Code/2%29%20May%20-%202026/personal-website-1/q-a/index.html)

Questions and answers are organized in front matter under `faq:`:
```yaml
faq:
  - question: "Why am I doing this ??"
    answer: |
      Honestly, I just want to learn and grow ✨<br><br>
      By the Grace of Christ ✝️, I’ve been blessed with some truly amazing teachers...

  - question: "Your New Question Here ?"
    answer: |
      Your answer goes here. You can use standard HTML like <br>, <strong>bold</strong>, or <a href="...">links</a>!
```
*The HTML automatically creates unique accordion IDs for you, avoiding any broken drop-downs!*

---

### Guide 4: Adding Tests or Editing the Syllabus
**File to edit:** [`math-club/training-camp.html`](file:///c:/Users/rohan/Documents/%23%23%20Code/2%29%20May%20-%202026/personal-website-1/math-club/training-camp.html)

The tests are defined in front matter under `tests:`:
```yaml
tests:
  - assessment_label: "4th Assessment"
    title: "Test 4"
    questions: 25
    form_url: "https://forms.gle/your-form-url-here"
    syllabus_title: "Syllabus Matrix - Test 4"
    syllabus_items:
      - "Linear Algebra"
      - "Differential Equations"
      - "Vectors"
```
*To add Test 4, just append the block above. To change question counts or syllabus topics, edit the text in the list.*

---

### Guide 5: Updating Photos in SDG & Math Club
- **SDG:** [`math-club/sdg.html`](file:///c:/Users/rohan/Documents/%23%23%20Code/2%29%20May%20-%202026/personal-website-1/math-club/sdg.html) — edit `sdg_gallery:` in front matter.
- **Math Club:** [`math-club/index.html`](file:///c:/Users/rohan/Documents/%23%23%20Code/2%29%20May%20-%202026/personal-website-1/math-club/index.html) — edit `math_club_gallery:` in front matter.

---

### Guide 6: Editing Data Science Surveys & Reports
**File to edit:** [`d-s/1-start.html`](file:///c:/Users/rohan/Documents/%23%23%20Code/2%29%20May%20-%202026/personal-website-1/d-s/1-start.html)

- **To update Google Form link:** Search for `href="https://forms.gle/..."` and paste the new URL.
- **To update the embedded PDF/Doc:** Search for `https://drive.google.com/file/d/YOUR_FILE_ID/preview` in the `iframe src`.
- **To update the Google Sheet Chart:** Search for `pubchart?oid=...` and replace the sheet embed URL.

---

### Guide 7: How the DSA / CSES GitHub API Works
**Files:** [`Nd-s/cses.html`](file:///c:/Users/rohan/Documents/%23%23%20Code/2%29%20May%20-%202026/personal-website-1/Nd-s/cses.html) and [`Nd-s/cses-folder.html`](file:///c:/Users/rohan/Documents/%23%23%20Code/2%29%20May%20-%202026/personal-website-1/Nd-s/cses-folder.html)

These pages connect directly to GitHub:
```javascript
const USER = 'tninanofchirawa';
const REPO = 'cses';
const BRANCH = 'main';
```
Whenever you push a new C++ solution to your `cses` GitHub repository, the website automatically discovers it and displays it inside the matching category card. You do **not** have to edit any HTML when you solve new problems!

---

### Guide 8: Editing the Floating Google Form Banner
**File to edit:** [`_includes/floating-banner.html`](file:///c:/Users/rohan/Documents/%23%23%20Code/2%29%20May%20-%202026/personal-website-1/_includes/floating-banner.html)

- **To change the banner text:** Edit the `<p class="banner-text">` text.
- **To change the form link:** Edit line 21:
  ```javascript
  const targetPageUrl = "https://forms.gle/your-form-link";
  ```
- **How it works:** When a visitor clicks the banner or closes it, `sessionStorage` remembers their choice so the banner does not annoy them on every single page during their visit.

---

### Guide 9: Editing the Navigation Bar
**File to edit:** [`_includes/navbar.html`](file:///c:/Users/rohan/Documents/%23%23%20Code/2%29%20May%20-%202026/personal-website-1/_includes/navbar.html)

All links use Jekyll's `relative_url` filter:
```html
<a class="nav-link ga-nav-link" href="{{ '/your-page.html' | relative_url }}">Link Name</a>
```
Always use `{{ '/path/file.html' | relative_url }}` so links work reliably whether viewing on `localhost` or `https://tninanofchirawa.github.io/personal-website-1/`.

---

### Guide 10: Updating the Footer
**File to edit:** [`_includes/footer.html`](file:///c:/Users/rohan/Documents/%23%23%20Code/2%29%20May%20-%202026/personal-website-1/_includes/footer.html)

Update your email address or the "Last updated" text here:
```html
<p class="col small mb-0 text-md-end">
  Last updated: <b>November (1st Week)</b>
</p>
```

---

## 5. Summary of Cleanups & Optimizations Made

| Area / File | What Was Done | Impact |
| :--- | :--- | :--- |
| **`assets/css/custom.css`** | Created a centralized stylesheet for all custom styles, hero engine, card hovers, and floating banner | Eliminated 200+ lines of duplicated CSS across pages |
| **`_layouts/default.html`** | Modularized CSS and scripts into clean includes | **Reduced from 266 lines to 38 lines** (85% smaller) |
| **`_layouts/base.html`** | Removed dead legacy file with broken hardcoded paths | Avoided routing confusion |
| **`_includes/head.html`** | Consolidated all 5 Google Fonts into a single preconnected request; linked `custom.css` | Faster page load times, no render-blocking `@import` |
| **`_includes/floating-banner.html`** | Isolated banner HTML and session script | Clean separation of concerns |
| **`_includes/analytics-events.html`** | Isolated navigation Google Analytics click tracking | Modular script management |
| **`index.html`** | Fixed unclosed/broken `<div>` and duplicate `<p>` tags; removed dead commented code | Clean, valid HTML structure |
| **`personal.html`** | Converted 8 repetitive carousel slides into front-matter data loop | **Reduced from 163 to 100 lines**; easy image additions |
| **`math-club/training-camp.html`** | Converted 3 large test assessment blocks into front-matter data loop | **Reduced from 307 to 140 lines** (54% smaller) |
| **`math-club/sdg.html`** | Converted 7 carousel slides into data loop | Reduced from 160 to 100 lines |
| **`math-club/index.html`** | Converted highlights carousel into data loop; removed dead commented blocks | Clean and maintainable |
| **`q-a/index.html`** | Converted 6 accordion items into front-matter FAQ list; fixed unclosed `</div>` | Dynamic accordion IDs prevent copy-paste bugs |
| **`Nd-s/*.html`** | Removed duplicated `@import` font tags and inline CSS rules | 30-40 lines saved per file |

---

## 6. Testing Locally & Pushing to GitHub

### Testing on Your Machine
In your terminal, navigate to the folder and run:
```bash
bundle exec jekyll serve
```
Then open your browser at `http://localhost:4000/personal-website-1/` to see your changes live!

### Deploying Your Changes to GitHub
When you are ready to update the live site:
```bash
git add .
git commit -m "Clean and modularize website code with centralized Handbook"
git push origin main
```
GitHub Pages will automatically build and publish your site in 1–2 minutes! 🎉
