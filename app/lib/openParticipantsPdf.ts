import autoTable from "jspdf-autotable";
import { createPdfDocument, PDF_FONT } from "./createPdfDocument";
import { ParticipantRowView } from "../types/participantRowView";

export async function openParticipantsPdf(
  rows: ParticipantRowView[],
): Promise<void> {
  const doc = await createPdfDocument();
  autoTable(doc, {
    styles: { font: PDF_FONT },
    head: [["#", "Name", "Year", "Club", "Ranking"]],
    body: rows.map((row, index) => [
      index + 1,
      row.name,
      row.year,
      row.club,
      row.ranking,
    ]),
  });
  window.open(doc.output("bloburl"), "_blank");
}
