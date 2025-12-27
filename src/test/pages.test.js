import { describe, expect, test} from "vitest";
import { max, mul } from "../simple";
import { checkImgs, extractPages } from '../Reader';
import { promises as fs } from 'node:fs';   
describe('max', () => {
    test('should return the maximum value in an array', () => {
        expect(max(1, 3)).toBe(3);
    });
    // AAA
    // Arrange: Set up Remote and TV
    // Act: Turn the TV off
    // Assert: make sure the TV is off
});
describe('mul', () => {
    test('should multiply two numbers', () => {
        expect(mul(4, 5)).toBe(20);
    });
});
describe('pdfReader', () => {
    test('Should read pdf file and report the number of pages', async() => {
        const pdfFilePath = "/Users/ahmedbaruwa/Desktop/Contrib/Salma-Abugideri-Mohamed-Hag-Magid_Before-You-Tie-the-Knot-A-Guide-for-Couples__E_1351_B-odd7ih.pdf"; // Path to test pdf file
        const outDir = "Output"; // Output directory 
        const n_Pages = await checkImgs(pdfFilePath, outDir);
        expect(n_Pages).toBe(350);
    });
});
describe('pageExtraction', () => {
    test('Should extract pages from pdf file and save as images', async() => {
        const pdfFilePath = "/Users/ahmedbaruwa/Desktop/Contrib/Salma-Abugideri-Mohamed-Hag-Magid_Before-You-Tie-the-Knot-A-Guide-for-Couples__E_1351_B-odd7ih.pdf"; // Path to test pdf file
        const outDir = "/Users/ahmedbaruwa/Desktop/Contrib/Pdf-Highlights-Finder/src/Output"; // Output directory 
        const document = await extractPages(pdfFilePath, outDir);
        const numImagesInOutputDir = fs.readdir(outDir).length; //.filter(file => /\.(png|jpg|jpeg|gif)$/i.test(file)).length;
        expect(document.length).toBe(350);
    }, 86400);
});