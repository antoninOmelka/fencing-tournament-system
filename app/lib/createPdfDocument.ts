import jsPDF from "jspdf";

// jsPDF's built-in fonts cover only Latin-1, so Czech characters like
// ť/č/ě/ř/ů render as garbage — embed a unicode font instead
const FONT_FILE = "Geist-Regular.ttf";
const FONT_URL = `/fonts/${FONT_FILE}`;

export const PDF_FONT = "Geist";

let cachedFontBase64: string | null = null;

async function loadFontBase64(): Promise<string> {
  if (cachedFontBase64) {
    return cachedFontBase64;
  }

  const response = await fetch(FONT_URL);
  if (!response.ok) {
    throw new Error(`Failed to load PDF font: ${response.statusText}`);
  }

  const buffer = await response.arrayBuffer();
  const bytes = new Uint8Array(buffer);
  let binary = "";
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }

  cachedFontBase64 = btoa(binary);
  return cachedFontBase64;
}

export async function createPdfDocument(): Promise<jsPDF> {
  const fontBase64 = await loadFontBase64();

  const doc = new jsPDF();
  doc.addFileToVFS(FONT_FILE, fontBase64);
  doc.addFont(FONT_FILE, PDF_FONT, "normal");
  // table headers ask for a bold face — map it to the same file
  doc.addFont(FONT_FILE, PDF_FONT, "bold");
  doc.setFont(PDF_FONT);

  return doc;
}
