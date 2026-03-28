/**
 * STANDALONE PDF HIGHLIGHT SCANNER
 * 
 * This module provides a robust function to scan a PDF document (loaded via pdf.js)
 * and identify pages that contain highlight annotations.
 */

/**
 * Scans a PDF document and returns an array of page numbers containing highlights.
 * 
 * @param {Object} pdfDocument - The pdf.js document object (usually from getDocument().promise).
 * @returns {Promise<number[]>} - A promise that resolves to an array of 1-indexed page numbers.
 * 
 * @example
 * import { detectHighlightedPages } from './highlightScanner';
 * const highlightedPages = await detectHighlightedPages(pdf);
 */
export const detectHighlightedPages = async (pdfDocument) => {
  if (!pdfDocument || typeof pdfDocument.getPage !== 'function') {
    throw new Error('Invalid PDF document object provided. Expected a pdf.js document proxy.');
  }

  const highlightedPages = [];
  const totalPages = pdfDocument.numPages;

  try {
    for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
      // Load the page
      const page = await pdfDocument.getPage(pageNum);
      
      // Fetch annotations for the page
      const annotations = await page.getAnnotations();
      
      // Check if any annotation is of type 'Highlight'
      const hasHighlight = annotations.some(
        (annotation) => annotation.subtype === 'Highlight'
      );

      if (hasHighlight) {
        highlightedPages.push(pageNum);
      }
    }
  } catch (error) {
    console.error(`[HighlightScanner] Error processing document:`, error);
    throw error;
  }

  return highlightedPages;
};

/**
 * Advanced Scanner: Returns metadata about highlights including positions.
 * (Optional extra functionality for library-like usage)
 */
export const getHighlightsMetadata = async (pdfDocument) => {
  const metadata = [];
  const totalPages = pdfDocument.numPages;

  for (let pageNum = 1; pageNum <= totalPages; pageNum++) {
    const page = await pdfDocument.getPage(pageNum);
    const annotations = await page.getAnnotations();
    
    const highlights = annotations
      .filter((ann) => ann.subtype === 'Highlight')
      .map((ann) => ({
        id: ann.id,
        rect: ann.rect, // [x1, y1, x2, y2]
        color: ann.color, // [r, g, b]
        opacity: ann.opacity,
        contents: ann.contents || '',
      }));

    if (highlights.length > 0) {
      metadata.push({ page: pageNum, highlights });
    }
  }

  return metadata;
};
