*This post is my submission for [DEV Education Track: Build Apps with Google AI Studio](https://dev.to/deved/build-apps-with-google-ai-studio).*

## What I Built

I built the **SEO & OG Analyzer AI**, a comprehensive web tool that helps developers and marketers optimize their websites instantly.

Users simply paste a URL, and the app uses Google Gemini to simulate a crawl, analyzing the page's content to generate:

* **Open Graph Previews:** A visual simulation of how the link looks on social media (Facebook/LinkedIn).
* **SEO Audit:** An analysis of titles, descriptions, headings, and missing tags with AI-suggested improvements.
* **Structured Data:** Automatically generated, valid JSON-LD schemas (Organization, Article, etc.).
* **Ready-to-use Code:** HTML meta tags and JSON scripts formatted for copy-pasting.

I utilized the **Gemini API (gemini-2.5-flash)** with the **Google Search Tool (googleSearch)** to allow the AI to fetch real-time context about the URL without needing a complex backend web scraper.

The UI is built with **React**, **TypeScript**, and **Tailwind CSS**.

---

## Demo


![Image description](https://dev-to-uploads.s3.amazonaws.com/uploads/articles/ylynqezn2zrsej66xs31.png)

---

## Features in Action

* **Visual Preview:** See exactly how your link appears on social networks.
* **AI Insights:** Gemini critiques your current SEO strategy and suggests specific keywords and headings.
* **Code Generation:** Get the exact `<meta>` tags and JSON-LD needed to fix the site.

**Live Demo**: https://ia-seo-gen.vercel.app/
**GitHub**: https://github.com/rogeriorioli/IA-SEO-GEN

---

## My Experience

Working through this track taught me that **Prompt Engineering can effectively replace complex backend logic**.

Traditionally, building this app would require:

* a web scraping library (like **Puppeteer**),
* a parsing library (like **Cheerio**),
* and complex logic to extract metadata.

With Gemini, I simply provided a prompt acting as a *"Technical SEO Expert"* and used the **googleSearch** tool to do the heavy lifting.

---

## Key Takeaways

* **Strict JSON Handling:**
  The biggest challenge was ensuring the AI returned parsable JSON.
  I learned to implement robust error handling to strip Markdown code blocks (```json) and clean up the response before parsing it in the frontend.

* **Tool Use:**
  Enabling the **googleSearch** tool was a game-changer. It allowed the model to *"see"* the website in real-time rather than hallucinating content based on the URL string alone.

* **Speed:**
  The **gemini-2.5-flash** model is incredibly fast, making the user experience feel almost instantaneous, even while performing complex analysis.

---

This project showed me that **AI isn't just for chatbots—it's a powerful engine for structural analysis and code generation.**

