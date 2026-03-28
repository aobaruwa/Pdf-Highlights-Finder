import React from 'react';
import { 
  X, 
  Download, 
  FileText,
  Bookmark,
  ChevronRight,
  Sparkles
} from 'lucide-react';

const Sidebar = ({ 
  fileType, 
  highlightedPages, 
  showHighlightedOnly, 
  isExporting, 
  isScanning, 
  wordHighlightCount,
  onToggleFilter, 
  onExportPdf,
  onCloseSidebar,
  sidebarOpen
}) => {
  return (
    <aside className={`
      fixed lg:static top-0 left-0 h-full w-80 bg-white/95 backdrop-blur-sm shadow-2xl lg:shadow-none z-40 transform transition-transform duration-500 ease-in-out overflow-y-auto border-r border-gray-100
      ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
    `}>
      <div className="p-6">
        <div className="flex justify-between items-center mb-8 lg:hidden">
          <h2 className="font-bold text-gray-900">MarkUp Menu</h2>
          <button onClick={onCloseSidebar} className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {fileType === 'pdf' && (
          <div className="space-y-6">
            <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-5 rounded-2xl shadow-lg border border-white/10 text-white">
              <div className="flex items-center gap-2 mb-3">
                <Sparkles size={18} className="text-blue-200" />
                <h3 className="text-sm font-semibold tracking-wide">AI SCANNER</h3>
              </div>
              
              {isScanning ? (
                <div className="space-y-2">
                  <div className="h-4 w-full bg-white/20 rounded animate-pulse"></div>
                  <div className="h-4 w-3/4 bg-white/20 rounded animate-pulse"></div>
                  <p className="text-[10px] text-blue-100 mt-2 uppercase tracking-widest font-bold">Scanning Document...</p>
                </div>
              ) : highlightedPages.length > 0 ? (
                <>
                  <p className="text-xs text-blue-100 font-medium mb-4 opacity-90 leading-relaxed">
                    Identified <span className="text-white font-bold">{highlightedPages.length}</span> pages with relevant highlights for your review.
                  </p>
                  
                  <div className="flex bg-white/10 p-1 rounded-xl mb-4 border border-white/10">
                    <button 
                      onClick={() => onToggleFilter(false)}
                      className={`flex-1 text-[10px] font-black uppercase tracking-tight py-2 px-2 rounded-lg transition-all ${!showHighlightedOnly ? 'bg-white text-blue-700 shadow-lg' : 'text-blue-100 hover:bg-white/5'}`}
                    >
                      All Pages
                    </button>
                    <button 
                      onClick={() => onToggleFilter(true)}
                      className={`flex-1 text-[10px] font-black uppercase tracking-tight py-2 px-2 rounded-lg transition-all ${showHighlightedOnly ? 'bg-white text-blue-700 shadow-lg' : 'text-blue-100 hover:bg-white/5'}`}
                    >
                      Highlights
                    </button>
                  </div>
                  
                  <button 
                    onClick={onExportPdf}
                    disabled={isExporting}
                    className="w-full mt-3 text-xs py-3 px-4 rounded-xl bg-green-500/90 hover:bg-green-500 text-white transition-all font-bold flex items-center justify-center gap-2 shadow-lg active:scale-95"
                  >
                    {isExporting ? (
                      <div className="flex items-center gap-2">
                         <div className="h-3 w-3 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                         <span>Exporting...</span>
                      </div>
                    ) : (
                      <><Download size={14} /> Export Highlighted PDF</>
                    )}
                  </button>
                </>
              ) : (
                <div className="text-center py-4">
                  <Bookmark size={32} className="mx-auto text-white/30 mb-2 opacity-50" />
                  <p className="text-xs text-white/70 italic leading-relaxed">No highlight annotations detected in this document.</p>
                </div>
              )}
            </div>

            {highlightedPages.length > 0 && (
               <div className="mt-8">
                  <h4 className="text-[10px] uppercase tracking-widest font-bold text-gray-400 mb-4 px-1">Quick Links</h4>
                  <div className="grid grid-cols-4 gap-2">
                    {highlightedPages.map(page => (
                      <button 
                        key={page}
                        className="p-2 text-xs font-semibold rounded-lg bg-gray-50 hover:bg-blue-50 text-gray-600 hover:text-blue-700 border border-gray-100 transition-all hover:shadow-sm"
                        title={`Go to page ${page}`}
                      >
                        {page}
                      </button>
                    ))}
                  </div>
               </div>
            )}
          </div>
        )}
        
        {fileType === 'docx' && (
           <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-5 rounded-2xl shadow-lg border border-white/10 text-white">
              <div className="flex items-center gap-2 mb-3">
                <FileText size={18} className="text-blue-200" />
                <h3 className="text-sm font-semibold tracking-wide uppercase">Word Meta</h3>
              </div>
              <p className="text-xs text-blue-100 font-medium opacity-90 leading-relaxed">
                 {wordHighlightCount > 0 ? `Detected ${wordHighlightCount} highlighted sections using mark-up conversion.` : 'No highlights identified in this Word document.'}
              </p>
           </div>
        )}

        {!fileType && (
          <div className="text-center py-12 px-4 border-2 border-dashed border-gray-100 rounded-3xl mt-10">
            <div className="bg-gray-50 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-gray-100">
               <FileText size={24} className="text-gray-300" />
            </div>
            <p className="text-sm font-medium text-gray-400 leading-relaxed italic">Upload a document to unlock specialized insights</p>
          </div>
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
