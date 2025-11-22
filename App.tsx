import React, { useState } from 'react';
import { analyzeUrlWithGemini } from './services/geminiService';
import { AnalysisResult, Tab } from './types';
import { Icons } from './components/Icons';
import OGPreviewCard from './components/OGPreviewCard';
import SEOAuditList from './components/SEOAuditList';
import CodeBlock from './components/CodeBlock';

const App: React.FC = () => {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<AnalysisResult | null>(null);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.PREVIEW);

  const handleAnalyze = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url) return;
    
    // Basic URL validation
    try {
      new URL(url);
    } catch {
      setError("Por favor, insira uma URL válida (ex: https://exemplo.com)");
      return;
    }

    setLoading(true);
    setError(null);
    setData(null);

    try {
      const result = await analyzeUrlWithGemini(url);
      setData(result);
      setActiveTab(Tab.PREVIEW);
    } catch (err: any) {
      setError(err.message || "Ocorreu um erro ao analisar a página.");
    } finally {
      setLoading(false);
    }
  };

  const tabs = [
    { id: Tab.PREVIEW, label: 'Preview OG', icon: Icons.Share },
    { id: Tab.INSIGHTS, label: 'Auditoria SEO', icon: Icons.Chart },
    { id: Tab.SCHEMA, label: 'JSON-LD', icon: Icons.Json },
    { id: Tab.CODE, label: 'Meta Tags', icon: Icons.Code },
  ];

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col">
      
      {/* Header / Hero */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h1 className="font-bold text-xl tracking-tight text-slate-800">
              <a href="https://convertesites.com.br">
                <svg width="228" height="51" viewBox="0 0 228 51" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <title>Converte Sites</title>
                  <path d="M20.0683 29.551H26.2289C26.1053 31.5957 25.549 33.4109 24.56 34.9967C23.5847 36.5822 22.218 37.8203 20.4598 38.7104C18.7153 39.6005 16.6137 40.0457 14.155 40.0457C12.2319 40.0457 10.508 39.7118 8.98334 39.0443C7.45866 38.3627 6.15372 37.3889 5.06858 36.1232C3.99718 34.8575 3.17989 33.3274 2.61671 31.5331C2.05354 29.7388 1.77195 27.7289 1.77195 25.5034V23.3961C1.77195 21.1706 2.0604 19.1607 2.63731 17.3664C3.22796 15.5581 4.06585 14.0211 5.151 12.7554C6.24989 11.4896 7.56167 10.516 9.08638 9.83442C10.6111 9.15285 12.3143 8.81208 14.1962 8.81208C16.6961 8.81208 18.8046 9.27108 20.5216 10.1891C22.2523 11.1071 23.5916 12.3729 24.5394 13.9864C25.5009 15.5999 26.0778 17.4359 26.2701 19.4945H20.0889C20.0202 18.2705 19.7799 17.2342 19.3678 16.3857C18.9557 15.5234 18.3307 14.8766 17.4928 14.4454C16.6686 14.0003 15.5698 13.7777 14.1962 13.7777C13.166 13.7777 12.2663 13.9724 11.4971 14.3619C10.7278 14.7514 10.0822 15.3425 9.56028 16.1354C9.0383 16.9282 8.64682 17.9297 8.38584 19.1398C8.13858 20.336 8.01495 21.7409 8.01495 23.3543V25.5034C8.01495 27.0751 8.13171 28.4591 8.36522 29.6553C8.59873 30.8376 8.95588 31.8391 9.43665 32.6597C9.93114 33.4665 10.563 34.0785 11.3322 34.4956C12.1152 34.8992 13.0561 35.1007 14.155 35.1007C15.4462 35.1007 16.5107 34.8923 17.3486 34.475C18.1865 34.0577 18.8252 33.4387 19.2647 32.618C19.7181 31.7974 19.9859 30.775 20.0683 29.551ZM54.9303 23.7299V25.1695C54.9303 27.4785 54.6213 29.551 54.003 31.3871C53.385 33.2231 52.5128 34.7879 51.3864 36.0815C50.2601 37.3613 48.9138 38.3417 47.3481 39.0233C45.796 39.7049 44.0721 40.0457 42.1763 40.0457C40.2948 40.0457 38.5708 39.7049 37.0047 39.0233C35.4526 38.3417 34.1064 37.3613 32.9664 36.0815C31.8263 34.7879 30.9404 33.2231 30.3085 31.3871C29.6904 29.551 29.3813 27.4785 29.3813 25.1695V23.7299C29.3813 21.407 29.6904 19.3345 30.3085 17.5124C30.9266 15.6764 31.7989 14.1116 32.9252 12.818C34.0652 11.5244 35.4115 10.5368 36.9636 9.85527C38.5296 9.17369 40.2532 8.83292 42.1351 8.83292C44.0309 8.83292 45.7545 9.17369 47.3069 9.85527C48.8727 10.5368 50.2189 11.5244 51.3453 12.818C52.4853 14.1116 53.3643 15.6764 53.9826 17.5124C54.6145 19.3345 54.9303 21.407 54.9303 23.7299ZM48.6872 25.1695V23.6882C48.6872 22.0747 48.5429 20.6559 48.2547 19.4319C47.9661 18.2079 47.5404 17.1786 46.9772 16.344C46.414 15.5094 45.7273 14.8835 44.9167 14.4663C44.1064 14.0351 43.1791 13.8194 42.1351 13.8194C41.0914 13.8194 40.1641 14.0351 39.3538 14.4663C38.5568 14.8835 37.8769 15.5094 37.3137 16.344C36.7645 17.1786 36.3456 18.2079 36.057 19.4319C35.7684 20.6559 35.6245 22.0747 35.6245 23.6882V25.1695C35.6245 26.7691 35.7684 28.1879 36.057 29.4258C36.3456 30.6499 36.7713 31.6861 37.3345 32.5346C37.8977 33.3691 38.5844 34.002 39.395 34.4332C40.2052 34.8644 41.1326 35.0801 42.1763 35.0801C43.2203 35.0801 44.1476 34.8644 44.9579 34.4332C45.7685 34.002 46.4484 33.3691 46.9976 32.5346C47.5472 31.6861 47.9661 30.6499 48.2547 29.4258C48.5429 28.1879 48.6872 26.7691 48.6872 25.1695ZM83.7965 9.25023V39.6284H77.6153L65.5619 19.265V39.6284H59.3807V9.25023H65.5619L77.6361 29.6344V9.25023H83.7965ZM151.337 34.7462V39.6284H135.368V34.7462H151.337ZM137.388 9.25023V39.6284H131.206V9.25023H137.388ZM149.256 21.6226V26.3796H135.368V21.6226H149.256ZM151.316 9.25023V14.1533H135.368V9.25023H151.316ZM154.942 9.25023H166.13C168.424 9.25023 170.395 9.59796 172.043 10.2934C173.706 10.9889 174.983 12.0182 175.876 13.3813C176.769 14.7444 177.215 16.4205 177.215 18.4096C177.215 20.037 176.94 21.4349 176.391 22.6033C175.855 23.7577 175.093 24.7244 174.104 25.5034C173.129 26.2684 171.982 26.8804 170.663 27.3394L168.706 28.3826H158.981L158.939 23.5004H166.172C167.256 23.5004 168.156 23.3057 168.87 22.9162C169.585 22.5267 170.12 21.9843 170.478 21.2888C170.849 20.5934 171.034 19.7866 171.034 18.8686C171.034 17.8949 170.855 17.0534 170.498 16.344C170.141 15.6346 169.599 15.0922 168.87 14.7166C168.143 14.3411 167.229 14.1533 166.13 14.1533H161.124V39.6284H154.942V9.25023ZM171.714 39.6284L164.873 26.0876L171.405 26.0458L178.328 39.3362V39.6284H171.714ZM194.152 9.25023V39.6284H187.991V9.25023H194.152ZM203.382 9.25023V14.1533H178.905V9.25023H203.382ZM227.036 34.7462V39.6284H211.067V34.7462H227.036ZM213.087 9.25023V39.6284H206.906V9.25023H213.087ZM224.955 21.6226V26.3796H211.067V21.6226H224.955ZM227.015 9.25023V14.1533H211.067V9.25023H227.015Z" fill="#3CCFB4"></path><path d="M90.6316 15.4611H124.177L121.627 20.8498H92.9239L90.6316 15.4611Z" fill="#33DFC0" fill-opacity="0.84"></path><path d="M87.2078 13.0425C86.1955 11.2574 87.8022 9.22142 90.2234 9.22142H124.338C126.82 9.22142 128.424 11.3513 127.293 13.1442C126.725 14.0441 125.584 14.6102 124.338 14.6102H90.2234C88.9274 14.6102 87.7498 13.998 87.2078 13.0425Z" fill="#26A28B" fill-opacity="0.84"></path><path d="M93.7765 21.7007H121.033L118.96 27.6567H95.639L93.7765 21.7007Z" fill="#26A28B" fill-opacity="0.84"></path><path d="M102.862 35.0308H111.947L108.646 40.7032H106.052L102.862 35.0308Z" fill="#26A28B" fill-opacity="0.84"></path><path d="M97.2708 28.5076H117.888L116.32 34.18H98.6798L97.2708 28.5076Z" fill="#3CCFB5"></path>
                </svg>
              </a>
            </h1>
          </div>
          <div className="text-xs font-medium text-slate-500 bg-slate-100 px-2 py-1 rounded">
             Analise gerada com Google Gemini
          </div>
        </div>
      </header>

      <main className="max-w-3xl mx-auto px-4 mt-12 flex-grow w-full">
        
        {/* Intro Text */}
        {!data && !loading && (
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">Analise e Otimize qualquer URL em segundos</h2>
            <p className="text-slate-600 max-w-lg mx-auto">
              Gere meta tags, previews de redes sociais, dados estruturados e receba insights de SEO instantaneamente com inteligência artificial.
            </p>
          </div>
        )}

        {/* Input Section */}
        <div className={`transition-all duration-300 ${data ? 'mb-8' : 'mb-12'}`}>
          <form onSubmit={handleAnalyze} className="relative group">
            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
              <Icons.Search className={`w-5 h-5 ${loading ? 'text-indigo-400' : 'text-gray-400'}`} />
            </div>
            <input
              type="text"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="Cole a URL aqui (ex: https://meusite.com/artigo)"
              className="w-full pl-12 pr-32 py-4 bg-white border border-gray-300 rounded-2xl shadow-sm focus:ring-4 focus:ring-indigo-500/10 focus:border-indigo-500 outline-none transition-all text-gray-700 text-lg placeholder-gray-400"
              disabled={loading}
            />
            <button
              type="submit"
              disabled={loading || !url}
              className="absolute right-2 top-2 bottom-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-medium px-6 rounded-xl transition-all flex items-center gap-2 shadow-sm"
            >
              {loading ? (
                <>
                  <Icons.Loader className="w-4 h-4 animate-spin" />
                  <span>Analisando...</span>
                </>
              ) : (
                <span>Analisar</span>
              )}
            </button>
          </form>
          
          {error && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3 text-red-700 animate-fade-in">
              <Icons.Error className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </div>
          )}
        </div>

        {/* Results Section */}
        {data && (
          <div className="animate-fade-in-up">
            
            {/* Tabs Navigation */}
            <div className="flex items-center gap-2 mb-6 overflow-x-auto pb-2 scrollbar-hide">
              {tabs.map((tab) => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as Tab)}
                    className={`
                      flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-medium transition-all whitespace-nowrap
                      ${isActive 
                        ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 ring-1 ring-indigo-600' 
                        : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-50 hover:border-slate-300'}
                    `}
                  >
                    <Icon className="w-4 h-4" />
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* Tab Content */}
            <div className="min-h-[400px]">
              
              {activeTab === Tab.PREVIEW && (
                <div className="animate-fade-in">
                  <div className="text-center mb-6">
                    <h3 className="text-lg font-bold text-slate-900">Como aparece nas redes sociais</h3>
                    <p className="text-sm text-slate-500">Simulação de card Open Graph (Facebook, LinkedIn, Twitter, WhatsApp)</p>
                  </div>
                  <OGPreviewCard data={data.og} />
                  
                  <div className="mt-8 bg-blue-50 p-4 rounded-xl border border-blue-100">
                    <h4 className="font-semibold text-blue-800 text-sm mb-2 flex items-center gap-2">
                      <Icons.Check className="w-4 h-4" /> Dica Rápida
                    </h4>
                    <p className="text-sm text-blue-700">
                      Certifique-se de que sua imagem OG tenha proporção 1.91:1 (ex: 1200x630px) para melhor visualização em todas as plataformas.
                    </p>
                  </div>
                </div>
              )}

              {activeTab === Tab.INSIGHTS && (
                <div className="animate-fade-in">
                  <SEOAuditList analysis={data.seo} />
                </div>
              )}

              {activeTab === Tab.SCHEMA && (
                <div className="animate-fade-in space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="text-lg font-bold text-slate-900">Dados Estruturados Gerados</h3>
                    <span className="text-xs font-mono bg-green-100 text-green-700 px-2 py-1 rounded">JSON-LD Validado</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">
                    Adicione este script ao <code>&lt;head&gt;</code> ou rodapé do seu site para melhorar Rich Snippets no Google.
                  </p>
                  <CodeBlock 
                    code={`<script type="application/ld+json">\n${JSON.stringify(data.json_ld, null, 2)}\n</script>`} 
                    language="json" 
                  />
                </div>
              )}

              {activeTab === Tab.CODE && (
                <div className="animate-fade-in space-y-4">
                  <div className="flex items-center justify-between">
                     <h3 className="text-lg font-bold text-slate-900">Meta Tags Prontas</h3>
                     <span className="text-xs font-mono bg-slate-200 text-slate-600 px-2 py-1 rounded">HTML5</span>
                  </div>
                  <p className="text-sm text-slate-500 mb-2">
                    Copie e cole este bloco dentro da tag <code>&lt;head&gt;</code> do seu HTML.
                  </p>
                  <CodeBlock code={data.html_meta_tags} language="html" />
                </div>
              )}

            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="w-full bg-verde pt-16 mt-12">
        <div className="max-w-screen-xl mx-auto flex flex-col md:flex-row gap-12 items-center px-4">
          <div className="w-full md:w-1/2">
            <div className="w-14">
              <svg width="51" height="45" viewBox="0 0 51 45" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.65155 8.91968H46.4654L43.2862 16.6231H7.50883L4.65155 8.91968Z" fill="white"></path>
                <path d="M0.383906 5.46242C-0.877913 2.91052 1.1248 0 4.1428 0H46.6657C49.7595 0 51.7587 3.04468 50.3484 5.60773C49.6406 6.8942 48.2185 7.70343 46.6657 7.70343H4.1428C2.5273 7.70343 1.05946 6.82832 0.383906 5.46242Z" fill="white"></path>
                <path d="M8.57162 17.8396H42.5454L39.962 26.3539H10.8932L8.57162 17.8396Z" fill="white"></path>
                <path d="M19.8962 36.8953H31.2207L27.1062 45.0041H23.8721L19.8962 36.8953Z" fill="white"></path>
                <path d="M12.9272 27.5701H38.6253L36.6713 35.6789H14.6834L12.9272 27.5701Z" fill="white"></path>
              </svg>
            </div>
            <h3 className="text-white font-bold mt-4">Vamos Conversar</h3>
            <h2 className="font-bold text-2xl text-white mt-2">
              <p>Vamos Escalar Seu Negócio<br />com Tecnologia de Ponta</p>
            </h2>
            <p className="text-white my-8">
              Precisa de suporte técnico contínuo, desenvolvimento de novas funcionalidades ou soluções estratégicas com IA? Entre em contato e descubra qual pacote se encaixa melhor no seu momento de crescimento: Presença, Crescimento ou Estratégico.
            </p>
            <div className="flex flex-row gap-2 md:gap-8 mb-8">
              <a 
                className="bg-transparent border-white border-[1px] relative z-20 rounded-3xl text-white font-semibold text-[14px] w-44 flex items-end justify-center p-4 hover:bg-white hover:text-verde_Escuro transition-colors" 
                target="_blank" 
                rel="noreferrer"
                href="https://api.whatsapp.com/send?phone=5548991775899&text=Venho%20atrav%C3%A9s%20do%20site%20e%20gostaria%20de%20mais%20informa%C3%A7%C3%B5es"
              >
                Vamos Conversar
              </a>
              <a href="tel:+5548991775899" className="text-white text-center font-semibold block mt-4">
                +55 48 991775899
              </a>
            </div>
            
            <div className="social-gram flex flex-row my-4 gap-2">
              <a className="flex w-10 h-10 items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors" href="https://instagram.com/convertesites" target="_blank" rel="noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 256 256"><path d="M128,80a48,48,0,1,0,48,48A48.05,48.05,0,0,0,128,80Zm0,80a32,32,0,1,1,32-32A32,32,0,0,1,128,160ZM176,24H80A56.06,56.06,0,0,0,24,80v96a56.06,56.06,0,0,0,56,56h96a56.06,56.06,0,0,0,56-56V80A56.06,56.06,0,0,0,176,24Zm40,152a40,40,0,0,1-40,40H80a40,40,0,0,1-40,40V80A40,40,0,0,1,80,40h96a40,40,0,0,1,40,40ZM192,76a12,12,0,1,1-12-12A12,12,0,0,1,192,76Z"></path></svg>
              </a>
              <a className="social-in flex w-10 h-10 items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors" href="https://www.linkedin.com/company/convertesites/" target="_blank" rel="noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 256 256"><path d="M216,24H40A16,16,0,0,0,24,40V216a16,16,0,0,0,16,16H216a16,16,0,0,0,16-16V40A16,16,0,0,0,216,24Zm0,192H40V40H216V216ZM96,112v64a8,8,0,0,1-16,0V112a8,8,0,0,1,16,0Zm88,28v36a8,8,0,0,1-16,0V140a20,20,0,0,0-40,0v36a8,8,0,0,1-16,0V112a8,8,0,0,1,15.79-1.78A36,36,0,0,1,184,140ZM100,84A12,12,0,1,1,88,72,12,12,0,0,1,100,84Z"></path></svg>
              </a>
              <a className="social-wpp flex w-10 h-10 items-center justify-center bg-white/10 rounded-full hover:bg-white/20 transition-colors" href="https://api.whatsapp.com/send?phone=5548991775899&text=oi" target="_blank" rel="noreferrer">
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="white" viewBox="0 0 256 256"><path d="M187.58,144.84l-32-16a8,8,0,0,0-8,.5l-14.69,9.8a40.55,40.55,0,0,1-16-16l9.8-14.69a8,8,0,0,0,.5-8l-16-32A8,8,0,0,0,104,64a40,40,0,0,0-40,40,88.1,88.1,0,0,0,88,88,40,40,0,0,0,40-40A8,8,0,0,0,187.58,144.84ZM152,176a72.08,72.08,0,0,1-72-72A24,24,0,0,1,99.29,80.46l11.48,23L101,118a8,8,0,0,0-.73,7.51,56.47,56.47,0,0,0,30.15,30.15A8,8,0,0,0,138,155l14.61-9.74,23,11.48A24,24,0,0,1,152,176ZM128,24A104,104,0,0,0,36.18,176.88L24.83,210.93a16,16,0,0,0,20.24,20.24l34.05-11.35A104,104,0,1,0,128,24Zm0,192a87.87,87.87,0,0,1-44.06-11.81,8,8,0,0,0-6.54-.67L40,216,52.47,178.6a8,8,0,0,0-.66-6.54A88,88,0,1,1,128,216Z"></path></svg>
              </a>
            </div>
          </div>
        </div>
        
        <div className="bg-verde w-full flex justify-center items-center py-4 mt-16 px-4 text-center">
          <p className="text-white text-sm">
            © 2025 Converte Sites e Treinamentos. Todos os direitos reservados - CNPJ: 58.532.850/0001-10
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;