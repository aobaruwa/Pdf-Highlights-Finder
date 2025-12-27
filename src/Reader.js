import { pdf } from "pdf-to-img";
import { promises as fs } from 'node:fs';

// Count the number of pages in PDF document
export async function checkImgs(fPath, outDir){
    const document = await pdf(fPath, { scale: 1 });
    return document.length;
}

// TODO: extract pages of PDF document
export async function extractPages(fPath, outDir){
    
    let counter = 1;
    const document = await pdf(fPath, { scale: 1 });
    // check existence of output directory
    try {
            await fs.access(outDir, fs.constants.F_OK);
            console.log(`${outDir} exists`);
    } catch (err) {
        console.log(`${outDir} doesn't exist - creating directory ...`);
        await fs.mkdir(outDir, { recursive: true });
    }
    // save each page as image
    for await (const img of document) {
        console.log(`Saving page ${counter} as image...`);
        console.log(`Output path: ${outDir}/page${counter}.png`); 
        
        await fs.writeFile(`${outDir}/page${counter}.png`, img);
        counter ++;
    }
    return document;
}
// Check if a page has highlights