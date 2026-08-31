import autoTable from "jspdf-autotable";
import { createPdfDocument, PDF_FONT } from "./createPdfDocument";
import { ResultsTableRow } from "../types/resultsTableRow";

export async function openResultsPdf(rows: ResultsTableRow[]): Promise<void> {
  const doc = await createPdfDocument();
  doc.text("Group Results", 14, 15);
  autoTable(doc, {
    startY: 20,
    styles: { font: PDF_FONT },
    head: [
      [
        "Place",
        "Name",
        "Year",
        "Club",
        "V",
        "V/M",
        "Scored",
        "Received",
        "Index",
      ],
    ],
    body: rows.map((row) => [
      row.place,
      row.name,
      row.year,
      row.club,
      row.wins,
      row.winsRate,
      row.scored,
      row.received,
      row.index,
    ]),
  });
  window.open(doc.output("bloburl"), "_blank");
}
