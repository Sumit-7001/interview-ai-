import React, { useState, useEffect, useRef } from 'react';
import { 
  FileText, 
  ExternalLink, 
  Download, 
  ChevronLeft, 
  ChevronRight, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw, 
  Maximize2, 
  Minimize2,
  FileQuestion,
  CheckCircle2
} from 'lucide-react';

const CompanyPdfViewer = ({ 
  company, 
  domainName = 'React / Frontend Developer',
  onSelectCompany 
}) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [pageInput, setPageInput] = useState('1');
  const containerRef = useRef(null);

  // When company changes, reset page and zoom to initial state
  useEffect(() => {
    setCurrentPage(1);
    setPageInput('1');
    setZoom(100);
  }, [company?.id, company?.pdfUrl]);

  // Sync pageInput with currentPage
  useEffect(() => {
    setPageInput(currentPage.toString());
  }, [currentPage]);

  // Fullscreen change listener
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(Boolean(document.fullscreenElement));
    };

    document.addEventListener('fullscreenchange', handleFullscreenChange);
    document.addEventListener('webkitfullscreenchange', handleFullscreenChange);
    document.addEventListener('mozfullscreenchange', handleFullscreenChange);

    return () => {
      document.removeEventListener('fullscreenchange', handleFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', handleFullscreenChange);
      document.removeEventListener('mozfullscreenchange', handleFullscreenChange);
    };
  }, []);

  const totalPages = company?.pageCount || 1;

  const handlePrevPage = () => {
    setCurrentPage(prev => Math.max(1, prev - 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(totalPages, prev + 1));
  };

  const handlePageInputChange = (e) => {
    setPageInput(e.target.value);
  };

  const handlePageInputBlur = () => {
    const val = parseInt(pageInput, 10);
    if (!isNaN(val) && val >= 1 && val <= totalPages) {
      setCurrentPage(val);
    } else {
      setPageInput(currentPage.toString());
    }
  };

  const handlePageInputKeyDown = (e) => {
    if (e.key === 'Enter') {
      handlePageInputBlur();
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(200, prev + 25));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(50, prev - 25));
  };

  const handleResetZoom = () => {
    setZoom(100);
  };

  const toggleFullscreen = async () => {
    try {
      if (!document.fullscreenElement) {
        if (containerRef.current?.requestFullscreen) {
          await containerRef.current.requestFullscreen();
        } else if (containerRef.current?.webkitRequestFullscreen) {
          await containerRef.current.webkitRequestFullscreen();
        }
      } else {
        if (document.exitFullscreen) {
          await document.exitFullscreen();
        } else if (document.webkitExitFullscreen) {
          await document.webkitExitFullscreen();
        }
      }
    } catch (err) {
      console.warn('Fullscreen request failed:', err);
      // Fallback: open in new tab if fullscreen fails
      if (company?.pdfUrl) {
        window.open(company.pdfUrl, '_blank');
      }
    }
  };

  // If no company or company has no PDF
  if (!company || !company.hasPdf || !company.pdfUrl) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm p-8 sm:p-12 mb-8 text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mx-auto mb-4 border border-amber-200/60 shadow-xs">
          <FileQuestion size={32} />
        </div>
        <h2 className="text-xl font-bold text-slate-900 mb-2">
          PDF Document Not Available Yet
        </h2>
        <p className="text-sm text-slate-500 max-w-md mx-auto mb-6">
          The official question bank PDF for <span className="font-semibold text-slate-800">{company?.name || 'this company'}</span> has not been provided yet. You can explore the available company documents:
        </p>
        
        <div className="flex flex-wrap items-center justify-center gap-2 max-w-lg mx-auto">
          {['tcs', 'wipro', 'cognizant', 'capgemini', 'infosys', 'accenture'].map((cid) => (
            <button
              key={cid}
              onClick={() => onSelectCompany && onSelectCompany(cid)}
              className="px-3.5 py-1.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-700 text-xs font-semibold border border-purple-200/80 transition-colors capitalize cursor-pointer"
            >
              View {cid === 'tcs' ? 'TCS' : cid} PDF
            </button>
          ))}
        </div>
      </div>
    );
  }

  // Construct iframe URL with PDF parameter hash
  const iframeSrc = `${company.pdfUrl}#page=${currentPage}&zoom=${zoom}`;

  return (
    <div 
      ref={containerRef}
      className={`bg-white rounded-3xl border border-slate-200/90 shadow-sm mb-8 flex flex-col transition-all ${
        isFullscreen ? 'fixed inset-0 z-50 rounded-none border-0 p-4 bg-slate-900' : 'p-4 sm:p-6'
      }`}
    >
      {/* Top Header & Metadata */}
      <div className={`flex flex-col lg:flex-row lg:items-center justify-between gap-4 mb-4 pb-4 border-b ${
        isFullscreen ? 'border-slate-800 text-white' : 'border-slate-100'
      }`}>
        {/* Title and Metadata */}
        <div className="flex items-center gap-3.5 min-w-0">
          <div className="w-11 h-11 rounded-2xl bg-purple-100 flex items-center justify-center text-purple-600 shrink-0 shadow-xs">
            <FileText size={22} />
          </div>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <h2 className={`text-base md:text-lg font-bold truncate ${
                isFullscreen ? 'text-white' : 'text-slate-900'
              }`}>
                {company.pdfTitle || `${company.name} Interview Questions`}
              </h2>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md text-[11px] font-semibold bg-purple-100 text-purple-700 shrink-0">
                <CheckCircle2 size={12} className="text-purple-600" />
                {totalPages} {totalPages === 1 ? 'Page' : 'Pages'}
              </span>
            </div>
            <p className={`text-xs mt-0.5 truncate ${isFullscreen ? 'text-slate-400' : 'text-slate-500'}`}>
              File: <span className="font-medium text-slate-700">{company.fileName}</span> &bull; {company.name} Technical Questions
            </p>
          </div>
        </div>

        {/* Action Controls: Fullscreen, Open New Tab, Download */}
        <div className="flex flex-wrap items-center gap-2 shrink-0">
          <button
            onClick={toggleFullscreen}
            title={isFullscreen ? "Exit Fullscreen" : "Open Fullscreen"}
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isFullscreen 
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white' 
                : 'border-slate-200 text-slate-700 hover:text-purple-700 hover:border-purple-300 hover:bg-purple-50/50'
            }`}
          >
            {isFullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Open Fullscreen'}</span>
          </button>

          <a 
            href={company.pdfUrl} 
            target="_blank" 
            rel="noreferrer"
            title="Open PDF in new browser tab"
            className={`inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
              isFullscreen 
                ? 'bg-slate-800 hover:bg-slate-700 border-slate-700 text-white' 
                : 'border-slate-200 text-slate-700 hover:text-purple-700 hover:border-purple-300 hover:bg-purple-50/50'
            }`}
          >
            <ExternalLink size={14} />
            <span>Open in Tab</span>
          </a>

          <a 
            href={company.pdfUrl} 
            download={company.fileName}
            title={`Download ${company.fileName}`}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-[#6366F1] hover:bg-[#4F46E5] text-white text-xs font-semibold shadow-xs hover:shadow transition-all cursor-pointer"
          >
            <Download size={14} />
            <span>Download PDF</span>
          </a>
        </div>
      </div>

      {/* Embedded Controls Toolbar: Page Navigation & Zoom Controls */}
      <div className={`flex flex-wrap items-center justify-between gap-3 px-4 py-2.5 rounded-2xl mb-3 ${
        isFullscreen ? 'bg-slate-800/90 text-slate-200 border border-slate-700' : 'bg-slate-50 border border-slate-200/80 text-slate-700'
      }`}>
        {/* Page Navigation */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-slate-500 mr-1 hidden sm:inline">Page</span>
          <button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            title="Previous Page"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
          >
            <ChevronLeft size={16} />
          </button>
          
          <div className="flex items-center gap-1 text-xs font-semibold px-2 py-1 bg-white border border-slate-200 rounded-lg">
            <input
              type="text"
              value={pageInput}
              onChange={handlePageInputChange}
              onBlur={handlePageInputBlur}
              onKeyDown={handlePageInputKeyDown}
              className="w-8 text-center text-xs font-bold text-slate-900 bg-transparent focus:outline-none"
              title="Enter page number"
            />
            <span className="text-slate-400">/</span>
            <span className="text-slate-600">{totalPages}</span>
          </div>

          <button
            onClick={handleNextPage}
            disabled={currentPage >= totalPages}
            title="Next Page"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
          >
            <ChevronRight size={16} />
          </button>
        </div>

        {/* Zoom Controls */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-medium text-slate-500 mr-1 hidden sm:inline">Zoom</span>
          <button
            onClick={handleZoomOut}
            disabled={zoom <= 50}
            title="Zoom Out"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
          >
            <ZoomOut size={15} />
          </button>

          <span className="text-xs font-semibold px-2 py-1 bg-white border border-slate-200 rounded-lg min-w-[52px] text-center text-slate-800">
            {zoom}%
          </span>

          <button
            onClick={handleZoomIn}
            disabled={zoom >= 200}
            title="Zoom In"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 disabled:opacity-40 disabled:cursor-not-allowed text-slate-700 transition-colors cursor-pointer"
          >
            <ZoomIn size={15} />
          </button>

          <button
            onClick={handleResetZoom}
            title="Reset Zoom to 100%"
            className="p-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 transition-colors ml-1 cursor-pointer"
          >
            <RotateCcw size={14} />
          </button>
        </div>
      </div>

      {/* Embedded PDF Viewer Iframe */}
      <div 
        className={`w-full rounded-2xl overflow-hidden border border-slate-200 bg-slate-900 transition-all ${
          isFullscreen ? 'flex-1 min-h-0' : 'h-[780px]'
        }`}
      >
        <iframe
          key={`${company.id}-${company.pdfUrl}-${currentPage}-${zoom}`}
          src={iframeSrc}
          className="w-full h-full border-0 bg-slate-100"
          title={`${company.name} Interview Questions PDF`}
        />
      </div>
    </div>
  );
};

export default CompanyPdfViewer;
