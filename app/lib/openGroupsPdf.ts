import autoTable from "jspdf-autotable";
import { createPdfDocument, PDF_FONT } from "./createPdfDocument";
import { GroupTableView } from "../types/groupTableView";

// jspdf-autotable records the last rendered table on the document, but
// ships no typing for it
type DocWithAutoTable = { lastAutoTable: { finalY: number } };

export async function openGroupsPdf(views: GroupTableView[]): Promise<void> {
  const doc = await createPdfDocument();

  views.forEach((view, index) => {
    if (index > 0) {
      doc.addPage();
    }
    doc.text(`Group ${view.id}`, 14, 15);

    autoTable(doc, {
      startY: 20,
      styles: { font: PDF_FONT },
      head: [
        [
          "Fencer",
          "",
          ...view.orders.map(String),
          "V",
          "V/M",
          "Scored",
          "Received",
          "Index",
        ],
      ],
      body: view.rows.map((row) => [
        row.name,
        row.order,
        ...row.cells,
        row.wins,
        row.winsRate,
        row.scored,
        row.received,
        row.index,
      ]),
    });

    if (view.matches.length > 0) {
      const matrixEndY = (doc as unknown as DocWithAutoTable).lastAutoTable
        .finalY;
      autoTable(doc, {
        startY: matrixEndY + 8,
        styles: { font: PDF_FONT },
        head: [["Fencer", "Score", "Fencer", "Score"]],
        body: view.matches.map((match) => [
          `${match.firstOrder} ${match.firstName}`,
          match.firstResult,
          `${match.secondOrder} ${match.secondName}`,
          match.secondResult,
        ]),
      });
    }
  });

  window.open(doc.output("bloburl"), "_blank");
}
