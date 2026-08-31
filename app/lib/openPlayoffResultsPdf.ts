import autoTable from "jspdf-autotable";
import { createPdfDocument, PDF_FONT } from "./createPdfDocument";
import { PlayoffStandingRow } from "../types/playoffView";

export async function openPlayoffResultsPdf(
  rows: PlayoffStandingRow[],
): Promise<void> {
  const doc = await createPdfDocument();
  doc.text("Playoff Results", 14, 15);
  autoTable(doc, {
    startY: 20,
    styles: { font: PDF_FONT },
    head: [["Place", "Name", "Year", "Club"]],
    body: rows.map((row) => [row.place, row.name, row.year, row.club]),
  });
  window.open(doc.output("bloburl"), "_blank");
}
