import { GoogleGenAI } from "@google/genai";
import { AnalysisResult } from "../types";

export const analyzeUrlWithGemini = async (url: string): Promise<AnalysisResult> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing. Please ensure process.env.API_KEY is configured.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  const prompt = `
    You are an expert Technical SEO Specialist and Web Developer.
    
    Task: Analyze the following URL: ${url}
    
    Since you cannot browse the live web in real-time like a browser, use the 'googleSearch' tool to find the most current title, description, and context of this page. 
    
    Based on what you find:
    1. Construct the optimal Open Graph (OG) data.
    2. Perform an SEO audit (critique the likely current title/description vs an optimized one).
    3. Suggest content improvements (sections to add, FAQ for rich snippets).
    4. Generate valid JSON-LD structured data appropriate for the content type (e.g., Organization, Product, Article, WebPage).
    5. Generate the full HTML <head> meta tags block.
    
    If the URL is invalid or the content is inaccessible, simulate a best-effort realistic example based on the domain name or return a polite error in the audit checks.
    
    Important: Use "https://picsum.photos/1200/630" as the 'og.image' if you cannot find a specific real image URL for the page.

    *** CRITICAL: OUTPUT FORMAT ***
    Return ONLY a single valid JSON object. 
    Do not include any explanation, markdown formatting, variable declarations (like 'const x ='), or code blocks.
    Do not add trailing semicolons or comments.
    Ensure all strings are properly escaped.

    JSON Structure:
    {
      "og": {
        "title": "Optimized Open Graph title",
        "description": "Optimized Open Graph description",
        "image": "URL of a relevant image",
        "site_name": "Site name",
        "url": "URL"
      },
      "seo": {
        "title_analysis": {
          "current": "Current detected title",
          "suggested": "Improved title",
          "length_check": "Feedback"
        },
        "description_analysis": {
          "current": "Current detected description",
          "suggested": "Improved description",
          "length_check": "Feedback"
        },
        "keywords": ["keyword1", "keyword2"],
        "missing_tags": ["tag1", "tag2"],
        "headings_structure": ["H1: Title", "H2: Subtitle"],
        "suggested_sections": ["Section 1", "Section 2"],
        "faq_suggestions": [
          { "question": "Q1", "answer": "A1" }
        ],
        "audit_checks": [
          { "status": "good", "label": "Label", "message": "Message" }
        ]
      },
      "json_ld": {}, 
      "html_meta_tags": "<meta ...>" 
    }
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        tools: [{ googleSearch: {} }],
      }
    });

    let text = response.text;
    if (!text) throw new Error("No response from AI");

    // 1. Locate JSON boundaries
    const firstBrace = text.indexOf('{');
    const lastBrace = text.lastIndexOf('}');

    if (firstBrace === -1 || lastBrace === -1) {
      throw new Error("The AI response did not contain a valid JSON object.");
    }

    // 2. Extract strictly the JSON part, ignoring any preamble or trailing characters (like semicolons)
    let jsonString = text.substring(firstBrace, lastBrace + 1);

    // 3. Parse JSON
    let parsedResult;
    try {
      parsedResult = JSON.parse(jsonString);
    } catch (parseError) {
      console.warn("Initial JSON parse failed, attempting to clean comments...", parseError);
      
      // Fallback: Attempt to remove comments ( // or /* */ ) which are invalid in standard JSON but common in AI output
      // Note: This is a basic regex for cleanup and might not catch all edge cases inside strings
      const cleanedJson = jsonString
        .replace(/\/\/.*$/gm, '') // Remove line comments
        .replace(/\/\*[\s\S]*?\*\//g, ''); // Remove block comments
      
      try {
        parsedResult = JSON.parse(cleanedJson);
      } catch (retryError) {
        console.error("JSON Parse Error:", retryError);
        console.error("Failed JSON String:", jsonString);
        throw new Error("Failed to parse AI response. The model generated invalid JSON syntax.");
      }
    }

    // 4. Validate and Normalize Data
    if (!parsedResult.og || !parsedResult.seo) {
        throw new Error("Incomplete data received from AI.");
    }

    // Ensure json_ld is an object
    if (typeof parsedResult.json_ld === 'string') {
        try {
            parsedResult.json_ld = JSON.parse(parsedResult.json_ld);
        } catch (e) {
            console.warn("Failed to parse nested json_ld string, using empty object.", e);
            parsedResult.json_ld = {}; 
        }
    } else if (!parsedResult.json_ld) {
        parsedResult.json_ld = {};
    }

    return parsedResult as AnalysisResult;

  } catch (error: any) {
    console.error("Gemini Analysis Error:", error);
    let errorMessage = "Failed to analyze the URL. Please try again.";
    
    if (error.message) {
        if (error.message.includes("API Key")) {
            errorMessage = "API Key is missing or invalid.";
        } else if (error.message.includes("JSON")) {
            errorMessage = "AI response was malformed. Please try again.";
        }
    }
    throw new Error(errorMessage);
  }
};
