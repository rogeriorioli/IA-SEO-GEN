import React from 'react';
import { OGData } from '../types';

interface Props {
  data: OGData;
}

const OGPreviewCard: React.FC<Props> = ({ data }) => {
  return (
    <div className="max-w-md mx-auto bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mt-6">
      <div className="bg-gray-100 border-b border-gray-200 px-4 py-2 text-xs font-semibold text-gray-500 flex items-center justify-between">
        <span>PREVIEW (Facebook / LinkedIn style)</span>
        <div className="flex gap-1">
          <div className="w-2 h-2 rounded-full bg-red-400"></div>
          <div className="w-2 h-2 rounded-full bg-yellow-400"></div>
          <div className="w-2 h-2 rounded-full bg-green-400"></div>
        </div>
      </div>
      
      {/* Image Area */}
      <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
        {data.image ? (
          <img 
            src={data.image} 
            alt="OG Preview" 
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = 'https://picsum.photos/1200/630?grayscale';
            }}
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            Sem Imagem
          </div>
        )}
      </div>

      {/* Content Area */}
      <div className="p-4 bg-gray-50 border-t border-gray-100">
        <div className="uppercase tracking-wide text-xs text-gray-500 font-semibold mb-1 truncate">
          {data.site_name || new URL(data.url).hostname.toUpperCase()}
        </div>
        <h3 className="block text-lg leading-tight font-bold text-gray-900 hover:underline mb-2 line-clamp-2">
          {data.title}
        </h3>
        <p className="text-gray-600 text-sm line-clamp-2">
          {data.description}
        </p>
      </div>
    </div>
  );
};

export default OGPreviewCard;