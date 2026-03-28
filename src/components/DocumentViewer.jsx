import React from 'react';
import { Document, Page } from 'react-pdf';
import { FileText, Sparkles } from 'lucide-react';
import { Shimmer, PagePlaceholder } from './Shimmer';

const DocumentViewer = ({ 
  file, 
  fileType, 
  numPages, 
  highlightedPages, 
  showHighlightedOnly, 
  scale, 
  rotation, 
  viewMode, 
  wordContent,
  error,
  isProcessing,
  onLoadSuccess,
  onLoadError
}) => {
  if (isProcessing) return <div className="w-full max-w-4xl mx-auto mt-10"><Shimmer /></div>;
  if (error) return (
    <div className="flex flex-col items-center justify-center h-96 text-red-500 bg-red-50/50 border border-red-100 rounded-3xl p-8 max-w-md mx-auto mt-10 shadow-sm">
      <div className="bg-red-100 p-4 rounded-full mb-4">
        <X size={32} />
      </div>
      <p className="text-xl font-bold mb-2">Error Loading Document</p>
      <p className="text-sm opacity-80 text-center">{error}</p>
    </div>
  );
  if (!file) return (
    <div className="flex flex-col items-center justify-center h-[70vh] text-gray-400 max-w-lg mx-auto text-center px-6">
      <div className="relative mb-8 group">
         <div className="absolute -inset-4 bg-blue-100 rounded-full blur-2xl opacity-50 group-hover:opacity-100 transition-opacity"></div>
         <div className="relative bg-white p-8 rounded-3xl shadow-xl border border-gray-100 transform transition-transform group-hover:scale-105">
           <FileText size={80} className="text-blue-500/20" />
         </div>
         <div className="absolute -top-2 -right-2 bg-yellow-400 p-2 rounded-xl shadow-lg animate-bounce">
            <Sparkles size={16} className="text-yellow-900" />
         </div>
      </div>
      <h2 className="text-2xl font-black text-gray-900 mb-3 tracking-tight italic uppercase">Unlock Your Highlights</h2>
      <p className="text-sm text-gray-500 leading-relaxed font-medium">Upload a PDF or DOCX file to instantly identify and extract your marked sections with our intelligent scanning engine.</p>
    </div>
  );

  return (
    <div className={`w-full max-w-6xl mx-auto transition-all duration-500 ${viewMode === 'grid' && fileType === 'pdf' ? 'flex flex-wrap justify-center gap-8' : 'flex flex-col items-center'}`}>
      {fileType === 'pdf' && (
        <Document
          file={file}
          onLoadSuccess={onLoadSuccess}
          onLoadError={onLoadError}
          loading={<div className="w-full max-w-4xl"><Shimmer /></div>}
          className={`flex ${viewMode === 'grid' ? 'flex-row flex-wrap justify-center gap-8' : 'flex-col items-center w-full'}`}
        >
          {showHighlightedOnly && highlightedPages.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 px-10 text-gray-500 bg-white shadow-2xl rounded-[2.5rem] border border-gray-100 w-full max-w-xl text-center">
              <div className="bg-gray-50 p-6 rounded-full mb-6">
                <Bookmark size={48} className="text-gray-200" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">No Highlights Detected</h3>
              <p className="text-sm font-medium text-gray-500 mb-8 max-w-sm mx-auto italic">We couldn't find any annotations matching the 'Highlight' type in this document.</p>
              <button 
                onClick={() => setShowHighlightedOnly(false)} 
                className="px-8 py-3 bg-blue-600 text-white rounded-2xl font-bold hover:bg-blue-700 transition-all shadow-lg hover:shadow-blue-200"
              >
                Clear Filter
              </button>
            </div>
          ) : (
            Array.from(new Array(numPages), (el, index) => {
              const pageNumber = index + 1;
              const isHighlighted = highlightedPages.includes(pageNumber);
              
              if (showHighlightedOnly && !isHighlighted) return null;

              return (
                <div 
                  key={`page_${pageNumber}`} 
                  className={`group relative transition-all duration-300 ${viewMode === 'grid' ? 'shadow-lg hover:shadow-2xl hover:-translate-y-2' : 'shadow-2xl mb-12 rounded-2xl overflow-hidden'}`}
                >
                  <div className="bg-white p-1">
                    <Page 
                      pageNumber={pageNumber} 
                      scale={scale} 
                      rotate={rotation}
                      width={viewMode === 'grid' ? 280 : 800}
                      renderTextLayer={false}
                      renderAnnotationLayer={true}
                      loading={<PagePlaceholder />}
                      className="transition-opacity duration-500"
                    />
                  </div>
                  
                  {/* Page Indicator Overlay */}
                  <div className="absolute top-4 left-4 flex gap-2">
                     <div className="bg-black/60 backdrop-blur-md text-white text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full shadow-lg border border-white/20">
                        PAGE {pageNumber}
                     </div>
                     {isHighlighted && (
                        <div className="bg-yellow-400/90 backdrop-blur-md text-yellow-950 text-[10px] font-black tracking-widest px-3 py-1.5 rounded-full shadow-lg border border-yellow-300 animate-pulse">
                           HIGHLIGHTED
                        </div>
                     )}
                  </div>
                  
                  {/* Hover Actions */}
                  <div className="absolute inset-0 bg-blue-600/0 group-hover:bg-blue-600/5 transition-colors pointer-events-none"></div>
                </div>
              );
            })
          )}
        </Document>
      )}

      {fileType === 'docx' && wordContent && (
        <div className="w-full max-w-4xl bg-white p-12 lg:p-16 shadow-2xl rounded-[3rem] border border-gray-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 text-gray-100 group-hover:text-blue-50 transition-colors">
            <FileText size={120} />
          </div>
          <div 
             className="relative prose prose-blue lg:prose-xl max-w-none prose-headings:font-black prose-p:text-gray-600 prose-p:leading-relaxed prose-mark:bg-yellow-200 prose-mark:text-yellow-900 prose-mark:rounded-md prose-mark:px-1"
             dangerouslySetInnerHTML={{ __html: wordContent }} 
          />
        </div>
      )}
    </div>
  );
};

export default DocumentViewer;
