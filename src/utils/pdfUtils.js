import { PDFDocument } from 'pdf-lib';
import { detectHighlightedPages } from './highlightScanner';

/**
 * Scans a PDF document for highlight annotations.
 * @param {Object} pdf - The pdf.js document object.
 * @returns {Promise<number[]>} - A promise that resolves to an array of highlighted page numbers (1-indexed).
 */
export const scanForHighlights = async (pdf) => {
  return await detectHighlightedPages(pdf);
};

/**
 * Exports specified pages from a PDF file as a new PDF.
 * @param {File} file - The original PDF file.
 * @param {number[]} highlightedPages - Array of page numbers to export (1-indexed).
 * @returns {Promise<Blob>} - A promise that resolves to a Blob representing the new PDF.
 */
export const exportHighlightedPages = async (file, highlightedPages) => {
  if (!file || highlightedPages.length === 0) return null;
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdfDoc = await PDFDocument.load(arrayBuffer);
    const newPdf = await PDFDocument.create();
    
    // pdf-lib pages are 0-indexed, highlightedPages are 1-indexed
    const pagesToCopy = highlightedPages.map(p => p - 1);
    const copiedPages = await newPdf.copyPages(pdfDoc, pagesToCopy);
    
    copiedPages.forEach(page => newPdf.addPage(page));
    
    const pdfBytes = await newPdf.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });
  } catch (error) {
    console.error("Export failed:", error);
    throw error;
  }
};
