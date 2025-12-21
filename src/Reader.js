import { pdf } from "pdf-to-img";

// Count the number of pages in PDF document
export async function checkImgs(fPath, outDir){
    const document = await pdf(fPath, { scale: 3 });
    return document.length;
}

// TODO: extract pages of PDF document

// Check if a page has highlights