import React from 'react';
import { 
  ZoomIn, 
  ZoomOut, 
  RotateCw, 
  Menu, 
  Grid, 
  List,
  FileUp
} from 'lucide-react';

const Header = ({ 
  fileType, 
  scale, 
  viewMode, 
  onFileChange, 
  onZoomIn, 
  onZoomOut, 
  onRotate, 
  onToggleView, 
  onToggleSidebar 
}) => {
  return (
    <header className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-gray-200 px-4 py-3 flex items-center justify-between transition-all duration-300">
      <div className="flex items-center gap-4">
        <button 
          onClick={onToggleSidebar} 
          className="lg:hidden p-2 rounded-xl hover:bg-gray-100 text-gray-600 transition-colors"
        >
          <Menu size={20} />
        </button>
        <div className="flex items-center gap-2">
           <div className="bg-gradient-to-br from-blue-600 to-indigo-700 p-2 rounded-lg shadow-blue-200 shadow-lg">
             <FileUp size={20} className="text-white" />
           </div>
           <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 hidden sm:block">
             MarkUp
           </h1>
        </div>
        
        <div className="relative group">
          <input
            type="file"
            onChange={onFileChange}
            accept=".pdf,.docx"
            id="file-upload"
            className="hidden"
          />
          <label 
            htmlFor="file-upload" 
            className="flex items-center gap-2 cursor-pointer bg-gray-50 hover:bg-blue-50 border border-gray-200 hover:border-blue-200 px-4 py-1.5 rounded-full text-sm font-medium transition-all group-hover:shadow-sm"
          >
            <span className="text-gray-600 group-hover:text-blue-600">Upload</span>
          </label>
        </div>
      </div>

      <div className="flex items-center gap-3">
        {fileType === 'pdf' && (
          <div className="flex items-center gap-2">
            <div className="hidden md:flex items-center bg-gray-50 border border-gray-200 rounded-xl p-1 gap-1">
              <button 
                onClick={onZoomOut} 
                className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 hover:text-blue-600 transition-all"
                title="Zoom Out"
              >
                <ZoomOut size={16} />
              </button>
              <span className="text-xs font-semibold w-12 text-center text-gray-700">
                {Math.round(scale * 100)}%
              </span>
              <button 
                onClick={onZoomIn} 
                className="p-1.5 hover:bg-white hover:shadow-sm rounded-lg text-gray-500 hover:text-blue-600 transition-all"
                title="Zoom In"
              >
                <ZoomIn size={16} />
              </button>
            </div>
            
            <div className="flex items-center gap-1">
               <button 
                onClick={onRotate} 
                className="p-2 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-xl text-gray-500 hover:text-blue-600 transition-all" 
                title="Rotate"
              >
                <RotateCw size={18} />
              </button>
              <button 
                onClick={onToggleView} 
                className="p-2 hover:bg-gray-50 border border-transparent hover:border-gray-200 rounded-xl text-gray-500 hover:text-blue-600 transition-all hidden sm:block" 
                title="Toggle View"
              >
                {viewMode === 'list' ? <Grid size={18} /> : <List size={18} />}
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
