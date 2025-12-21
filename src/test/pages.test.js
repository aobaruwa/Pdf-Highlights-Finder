import { describe, expect, test} from "vitest";
import { max, mul } from "../simple";
import {checkImgs} from '../Reader';
// import { PdfProcessor } from "../Reader";

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
        const pdfFilePath = "../Reader/test.pdf"; // Path to test pdf file
        const outDir = "Output"; // Output directory 
        const n_Pages = await checkImgs(pdfFilePath, outDir);
        expect(n_Pages).toBe(350);
    });
});