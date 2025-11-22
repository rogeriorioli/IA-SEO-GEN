import React from 'react';
import { SEOAnalysis, SEOAuditItem } from '../types';
import { Icons } from './Icons';

interface Props {
  analysis: SEOAnalysis;
}

const StatusIcon = ({ status }: { status: SEOAuditItem['status'] }) => {
  switch (status) {
    case 'good': return <Icons.Check className="w-5 h-5 text-green-500" />;
    case 'warning': return <Icons.Warning className="w-5 h-5 text-yellow-500" />;
    case 'critical': return <Icons.Error className="w-5 h-5 text-red-500" />;
  }
};

const SEOAuditList: React.FC<Props> = ({ analysis }) => {
  return (
    <div className="space-y-6">
      
      {/* Audit Score/List */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
          <Icons.Chart className="w-5 h-5 text-indigo-600" />
          Health Check
        </h3>
        <div className="space-y-3">
          {analysis.audit_checks.map((item, idx) => (
            <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-slate-50 border border-slate-100">
              <div className="mt-0.5"><StatusIcon status={item.status} /></div>
              <div>
                <p className="font-semibold text-gray-800 text-sm">{item.label}</p>
                <p className="text-gray-600 text-sm">{item.message}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Title Analysis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wider">Análise de Título</h4>
          <div className="mb-4">
            <span className="text-xs text-gray-400 font-mono">ATUAL</span>
            <p className="text-gray-700 font-medium">{analysis.title_analysis.current}</p>
          </div>
          <div className="mb-4">
            <span className="text-xs text-indigo-500 font-mono font-bold">SUGESTÃO AI</span>
            <p className="text-indigo-700 font-medium">{analysis.title_analysis.suggested}</p>
          </div>
          <div className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">
            {analysis.title_analysis.length_check}
          </div>
        </div>

        {/* Description Analysis */}
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-2 text-sm uppercase tracking-wider">Análise de Descrição</h4>
           <div className="mb-4">
            <span className="text-xs text-gray-400 font-mono">ATUAL</span>
            <p className="text-gray-700 font-medium text-sm">{analysis.description_analysis.current || "(Vazio)"}</p>
          </div>
          <div className="mb-4">
            <span className="text-xs text-indigo-500 font-mono font-bold">SUGESTÃO AI</span>
            <p className="text-indigo-700 font-medium text-sm">{analysis.description_analysis.suggested}</p>
          </div>
           <div className="inline-block px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded-full border border-blue-100">
            {analysis.description_analysis.length_check}
          </div>
        </div>
      </div>

      {/* Suggested Sections */}
      {analysis.suggested_sections && analysis.suggested_sections.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
            <Icons.Layout className="w-4 h-4 text-indigo-500" />
            Sugestões de Seções
          </h4>
          <ul className="space-y-2">
            {analysis.suggested_sections.map((section, idx) => (
              <li key={idx} className="flex items-start gap-2 text-sm text-gray-600">
                 <span className="text-indigo-500 font-bold">•</span>
                 {section}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* FAQ Suggestions */}
      {analysis.faq_suggestions && analysis.faq_suggestions.length > 0 && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
          <h4 className="font-semibold text-gray-800 mb-3 text-sm flex items-center gap-2">
            <Icons.Help className="w-4 h-4 text-indigo-500" />
            FAQ Recomendado (Rich Snippets)
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {analysis.faq_suggestions.map((faq, idx) => (
              <div key={idx} className="p-3 bg-gray-50 rounded-lg border border-gray-100">
                <p className="font-semibold text-gray-800 text-sm mb-1">{faq.question}</p>
                <p className="text-gray-600 text-xs leading-relaxed">{faq.answer}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keywords */}
      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h4 className="font-semibold text-gray-800 mb-3 text-sm">Palavras-chave Detectadas / Sugeridas</h4>
        <div className="flex flex-wrap gap-2">
          {analysis.keywords.map((kw, i) => (
            <span key={i} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm border border-gray-200">
              {kw}
            </span>
          ))}
        </div>
      </div>
      
       {/* Structure Suggestions */}
       <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        <h4 className="font-semibold text-gray-800 mb-3 text-sm">Estrutura de Headings Sugerida</h4>
        <div className="font-mono text-sm text-gray-600 space-y-1">
          {analysis.headings_structure.map((h, i) => (
            <div key={i} className={`pl-${(h.match(/^H\d/)?.[0] === 'H2' ? 4 : h.match(/^H\d/)?.[0] === 'H3' ? 8 : 0)} border-l-2 border-gray-200 ml-1 py-1`}>
              <span className="text-indigo-500 font-bold mr-2">{h.split(' ')[0]}</span>
              {h.substring(3)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SEOAuditList;