export interface OGData {
  title: string;
  description: string;
  image: string;
  site_name: string;
  url: string;
}

export interface SEOAuditItem {
  status: 'good' | 'warning' | 'critical';
  label: string;
  message: string;
}

export interface FAQItem {
  question: string;
  answer: string;
}

export interface SEOAnalysis {
  title_analysis: {
    current: string;
    suggested: string;
    length_check: string;
  };
  description_analysis: {
    current: string;
    suggested: string;
    length_check: string;
  };
  keywords: string[];
  missing_tags: string[];
  headings_structure: string[];
  suggested_sections: string[];
  faq_suggestions: FAQItem[];
  audit_checks: SEOAuditItem[];
}

export interface AnalysisResult {
  og: OGData;
  seo: SEOAnalysis;
  json_ld: Record<string, any>;
  html_meta_tags: string;
}

export enum Tab {
  PREVIEW = 'preview',
  METATAGS = 'metatags',
  SCHEMA = 'schema',
  INSIGHTS = 'insights',
  CODE = 'code'
}