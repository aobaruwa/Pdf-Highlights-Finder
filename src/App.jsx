import React, { useState } from 'react';
import { Document, Page } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';
import mammoth from 'mammoth';
import { PDFDocument } from 'pdf-lib';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Download, 
  FileText, 
  Menu, 
  X,
  Grid,
  List
} from 'lucide-react';

// --- Components ---

const Shimmer = () => (
  <div className="w-full flex flex-col items-center gap-6 animate-pulse">
    <div className="h-[600px] w-full max-w-[800px] bg-gray-200 rounded-md shadow-sm"></div>
    <div className="h-4 w-48 bg-gray-200 rounded"></div>
  </div>
);

const PagePlaceholder = () => (
  <div className="mb-4 shadow-lg relative bg-white animate-pulse">
    <div className="h-[600px] w-full bg-gray-200"></div>
    <div className="mt-2 h-4 w-20 bg-gray-200 mx-auto mb-2"></div>
  </div>
);

function App() {
  // --- State ---
  const [file, setFile] = useState(null);
  const [numPages, setNumPages] = useState(null);
  const [showHighlightedOnly, setShowHighlightedOnly] = useState(false);
  const [highlightedPages, setHighlightedPages] = useState([]);
  const [fileType, setFileType] = useState(null);
  const [wordContent, setWordContent] = useState(null);
  const [wordHighlightCount, setWordHighlightCount] = useState(0);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isScanning, setIsScanning] = useState(false);
  const [error, setError] = useState(null);
  
  // New Features State
  const [scale, setScale] = useState(1.0);
  const [rotation, setRotation] = useState(0);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'grid'
  const [isExporting, setIsExporting] = useState(false);

  // --- Handlers ---

  const onFileChange = async (event) => {
    const selectedFile = event.target.files[0];
    if (selectedFile) {
      setIsProcessing(true);
      setFile(selectedFile);
      setHighlightedPages([]);
      setShowHighlightedOnly(false);
      setWordContent(null);
      setWordHighlightCount(0);
      setNumPages(null);
      setIsScanning(false);
      setError(null);
      setScale(1.0);
      setRotation(0);

      if (selectedFile.type === 'application/pdf') {
        setFileType('pdf');
        setIsProcessing(false);
      } else if (selectedFile.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
        setFileType('docx');
        try {
          const arrayBuffer = await selectedFile.arrayBuffer();
          const options = {
            styleMap: ["highlight => mark"]
          };
          const result = await mammoth.convertToHtml({ arrayBuffer }, options);
          const html = result.value;
          setWordContent(html);
          const matches = html.match(/<mark/g);
          setWordHighlightCount(matches ? matches.length : 0);
        } catch (error) {
          console.error("Error parsing Word document:", error);
          setError("Failed to parse Word document.");
        }
        setIsProcessing(false);
      } else {
        setFileType('other');
        setError("Unsupported file type. Please upload a PDF or DOCX file.");
        setIsProcessing(false);
      }
    }
  };

  const checkHighlights = async (pdf) => {
      setIsScanning(true);
      const highlights = [];
      try {
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const annotations = await page.getAnnotations();
            const hasHighlight = annotations.some(annotation => annotation.subtype === 'Highlight');
            if (hasHighlight) {
                highlights.push(i);
            }
        }
      } catch (error) {
        console.error("Error scanning for highlights:", error);
      }
      setHighlightedPages(highlights);
      setIsScanning(false);
  };

  const onDocumentLoadError = (error) => {
    console.error("Error loading PDF:", error);
    setError("Failed to load PDF.");
    setIsProcessing(false);
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.0));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);

  const exportHighlightedPdf = async () => {
    if (!file || highlightedPages.length === 0) return;
    setIsExporting(true);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdfDoc = await PDFDocument.load(arrayBuffer);
      const newPdf = await PDFDocument.create();
      
      // pdf-lib pages are 0-indexed, highlightedPages are 1-indexed
      const pagesToCopy = highlightedPages.map(p => p - 1);
      const copiedPages = await newPdf.copyPages(pdfDoc, pagesToCopy);
      
      copiedPages.forEach(page => newPdf.addPage(page));
      
      const pdfBytes = await newPdf.save();
      const blob = new Blob([pdfBytes], { type: 'application/pdf' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'highlighted-pages.pdf';
      link.click();
    } catch (err) {
      console.error("Export failed", err);
      alert("Failed to export PDF");
    }
    setIsExporting(false);
  };

  // --- Render ---

  return (
    <div className="h-screen flex flex-col bg-gray-100 text-gray-800">
      
      {/* Header / Toolbar */}
      <header className="sticky top-0 z-20 bg-white text-black shadow-md px-4 py-3 flex items-center justify-between transition-colors duration-200 border-b shrink-0">
        <div className="flex items-center gap-3">
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="lg:hidden p-2 rounded-md hover:bg-gray-100">
            <Menu size={20} />
          </button>
          <h1 className="text-lg font-bold hidden sm:block">PDF Highlights</h1>
          <input
            type="file"
            onChange={onFileChange}
            accept=".pdf,.docx"
            className="text-sm file:mr-2 file:py-1 file:px-3 file:rounded-full file:border-0 file:text-xs file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
        </div>

        <div className="flex items-center gap-2">
          {fileType === 'pdf' && (
            <>
              <div className="hidden md:flex items-center bg-gray-100 rounded-lg p-1">
                <button onClick={handleZoomOut} className="p-1.5 hover:bg-white rounded text-gray-700"><ZoomOut size={16} /></button>
                <span className="text-xs w-12 text-center text-gray-700">{Math.round(scale * 100)}%</span>
                <button onClick={handleZoomIn} className="p-1.5 hover:bg-white rounded text-gray-700"><ZoomIn size={16} /></button>
              </div>
              <button onClick={handleRotate} className="p-2 hover:bg-gray-100 rounded-full" title="Rotate"><RotateCw size={18} /></button>
              <button onClick={() => setViewMode(viewMode === 'list' ? 'grid' : 'list')} className="p-2 hover:bg-gray-100 rounded-full hidden sm:block" title="Toggle View">
                {viewMode === 'list' ? <Grid size={18} /> : <List size={18} />}
              </button>
            </>
          )}
        </div>
      </header>

      <div className="flex flex-1 relative overflow-hidden">
        
        {/* Sidebar (Thumbnails / Navigation) */}
        <aside className={`
          absolute lg:static top-0 left-0 h-full w-64 bg-white shadow-xl lg:shadow-none z-10 transform transition-transform duration-300 ease-in-out overflow-y-auto border-r
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
        `}>
          <div className="p-4">
            <div className="flex justify-between items-center mb-4 lg:hidden">
              <h2 className="font-semibold">Menu</h2>
              <button onClick={() => setSidebarOpen(false)}><X size={20} /></button>
            </div>

            {fileType === 'pdf' && (
              <div className="space-y-4">
                <div className="bg-blue-50 p-3 rounded-lg">
                  <h3 className="text-sm font-medium text-blue-800 mb-2">Highlights</h3>
                  {isScanning ? (
                    <p className="text-xs text-blue-600 animate-pulse">Scanning...</p>
                  ) : highlightedPages.length > 0 ? (
                    <>
                      <p className="text-xs text-green-600 mb-2">Found {highlightedPages.length} pages</p>
                      <button 
                        onClick={() => { setShowHighlightedOnly(!showHighlightedOnly); setSidebarOpen(false); }}
                        className={`w-full text-xs py-2 px-3 rounded border transition-colors ${showHighlightedOnly ? 'bg-blue-600 text-white border-blue-600' : 'bg-white border-gray-300 hover:bg-gray-50'}`}
                      >
                        {showHighlightedOnly ? 'Show All' : 'Filter Highlights'}
                      </button>
                      <button 
                        onClick={exportHighlightedPdf}
                        disabled={isExporting}
                        className="w-full mt-2 text-xs py-2 px-3 rounded bg-green-600 text-white hover:bg-green-700 flex items-center justify-center gap-2"
                      >
                        {isExporting ? 'Exporting...' : <><Download size={14} /> Export PDF</>}
                      </button>
                    </>
                  ) : (
                    <p className="text-xs text-gray-500">No highlights found</p>
                  )}
                </div>
              </div>
            )}
            
            {fileType === 'docx' && (
               <div className="bg-blue-50 p-3 rounded-lg">
                  <p className="text-sm font-medium text-blue-800">Word Document</p>
                  <p className="text-xs mt-1 text-gray-600">
                    {wordHighlightCount > 0 ? `Found ${wordHighlightCount} highlights` : 'No highlights detected'}
                  </p>
               </div>
            )}

            {!file && (
              <div className="text-center text-gray-500 mt-10">
                <p className="text-sm">Upload a document to see options</p>
              </div>
            )}
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8 flex justify-center bg-gray-100" onClick={() => setSidebarOpen(false)}>
          <div className={`w-full max-w-5xl transition-all duration-300 ${viewMode === 'grid' && fileType === 'pdf' ? 'flex flex-wrap justify-center gap-4' : ''}`}>
            
            {isProcessing && <Shimmer />}
            
            {error && (
              <div className="flex flex-col items-center justify-center h-64 text-red-500">
                <p className="text-lg font-medium">{error}</p>
              </div>
            )}

            {!file && !isProcessing && !error && (
              <div className="flex flex-col items-center justify-center h-[60vh] text-gray-400">
                <FileText size={64} className="mb-4 opacity-20" />
                <p className="text-lg">Upload a PDF or Word document to begin</p>
              </div>
            )}

            {fileType === 'pdf' && !error && (
              <Document
                file={file}
                onLoadSuccess={(pdf) => {
                    setNumPages(pdf.numPages);
                    checkHighlights(pdf);
                }}
                onLoadError={onDocumentLoadError}
                loading={<Shimmer />}
                className={`flex ${viewMode === 'grid' ? 'flex-row flex-wrap justify-center gap-6' : 'flex-col items-center'}`}
              >
                {showHighlightedOnly && highlightedPages.length === 0 ? (
                   <div className="flex flex-col items-center justify-center py-12 text-gray-500 bg-white rounded-lg shadow-sm p-8 w-full max-w-md">
                      <p className="text-lg font-medium">No highlighted pages found</p>
                      <button onClick={() => setShowHighlightedOnly(false)} className="mt-4 text-blue-600 hover:underline">Show All Pages</button>
                   </div>
                ) : (
                  Array.from(new Array(numPages), (el, index) => {
                    const pageNumber = index + 1;
                    const isHighlighted = highlightedPages.includes(pageNumber);
                    
                    if (showHighlightedOnly && !isHighlighted) return null;

                    return (
                      <div key={`page_${pageNumber}`} className={`relative shadow-lg transition-all duration-200 ${viewMode === 'grid' ? 'mb-0' : 'mb-8'}`}>
                        <div>
                          <Page 
                            pageNumber={pageNumber} 
                            scale={scale} 
                            rotate={rotation}
                            width={viewMode === 'grid' ? 300 : 600}
                            renderTextLayer={false}
                            renderAnnotationLayer={true}
                            loading={<PagePlaceholder />}
                            className="bg-white"
                          />
                        </div>
                        <div className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
                          Page {pageNumber}
                        </div>
                        {isHighlighted && (
                          <div className="absolute top-2 right-2 bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded shadow-sm">
                            Highlighted
                          </div>
                        )}
                      </div>
                    );
                  })
                )}
              </Document>
            )}

            {fileType === 'docx' && wordContent && !error && (
               <div 
                  className="prose max-w-none bg-white p-8 shadow-lg rounded-lg w-full"
                  dangerouslySetInnerHTML={{ __html: wordContent }} 
               />
            )}
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;