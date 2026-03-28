import React, { useState } from 'react';
import mammoth from 'mammoth';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// --- Internal Imports ---
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import DocumentViewer from './components/DocumentViewer';
import { scanForHighlights, exportHighlightedPages } from './utils/pdfUtils';

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
  
  // UI Features State
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

      const typeMap = {
        'application/pdf': 'pdf',
        'application/vnd.openxmlformats-officedocument.wordprocessingml.document': 'docx'
      };

      const type = typeMap[selectedFile.type] || 'other';
      setFileType(type);

      if (type === 'docx') {
        try {
          const arrayBuffer = await selectedFile.arrayBuffer();
          const options = { styleMap: ["highlight => mark"] };
          const result = await mammoth.convertToHtml({ arrayBuffer }, options);
          const html = result.value;
          setWordContent(html);
          const matches = html.match(/<mark/g);
          setWordHighlightCount(matches ? matches.length : 0);
        } catch (err) {
          console.error("Error parsing Word document:", err);
          setError("Failed to parse Word document.");
        }
      } else if (type === 'other') {
        setError("Unsupported file type. Please upload a PDF or DOCX file.");
      }
      setIsProcessing(false);
    }
  };

  const handleDocumentLoadSuccess = async (pdf) => {
    setNumPages(pdf.numPages);
    setIsScanning(true);
    try {
      const highlights = await scanForHighlights(pdf);
      setHighlightedPages(highlights);
    } catch (err) {
      console.error("Scan failed", err);
    } finally {
      setIsScanning(false);
    }
  };

  const onDocumentLoadError = (err) => {
    console.error("Error loading PDF:", err);
    setError("Failed to load PDF.");
    setIsProcessing(false);
  };

  const handleZoomIn = () => setScale(prev => Math.min(prev + 0.2, 2.5));
  const handleZoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const handleRotate = () => setRotation(prev => (prev + 90) % 360);
  const toggleViewMode = () => setViewMode(prev => (prev === 'list' ? 'grid' : 'list'));

  const handleExportPdf = async () => {
    if (!file || highlightedPages.length === 0) return;
    setIsExporting(true);
    try {
      const blob = await exportHighlightedPages(file, highlightedPages);
      if (blob) {
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `highlights-${file.name}`;
        link.click();
      }
    } catch (err) {
      alert("Failed to export PDF: " + err.message);
    } finally {
      setIsExporting(false);
    }
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50/50 text-gray-900 font-sans selection:bg-blue-100 selection:text-blue-700">
      
      <Header 
        fileType={fileType}
        scale={scale}
        viewMode={viewMode}
        onFileChange={onFileChange}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onRotate={handleRotate}
        onToggleView={toggleViewMode}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      <div className="flex flex-1 relative overflow-hidden">
        
        <Sidebar 
          fileType={fileType}
          highlightedPages={highlightedPages}
          showHighlightedOnly={showHighlightedOnly}
          isExporting={isExporting}
          isScanning={isScanning}
          wordHighlightCount={wordHighlightCount}
          onToggleFilter={(val) => setShowHighlightedOnly(val)}
          onExportPdf={handleExportPdf}
          onCloseSidebar={() => setSidebarOpen(false)}
          sidebarOpen={sidebarOpen}
        />

        <main 
          className="flex-1 overflow-y-auto p-6 lg:p-12 bg-[#F8F9FA] relative scroll-smooth"
          onClick={() => sidebarOpen && setSidebarOpen(false)}
        >
          {/* Subtle Background Pattern */}
          <div className="absolute inset-0 z-0 opacity-[0.03] pointer-events-none select-none overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(#3b82f6_1.5px,transparent_1.5px)] [background-size:40px_40px]"></div>
          </div>

          <div className="relative z-10 w-full">
            <DocumentViewer 
              file={file}
              fileType={fileType}
              numPages={numPages}
              highlightedPages={highlightedPages}
              showHighlightedOnly={showHighlightedOnly}
              scale={scale}
              rotation={rotation}
              viewMode={viewMode}
              wordContent={wordContent}
              error={error}
              isProcessing={isProcessing}
              onLoadSuccess={handleDocumentLoadSuccess}
              onLoadError={onDocumentLoadError}
            />
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;