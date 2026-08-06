import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";
import { ParticipantRowView } from "../types/participantRowView";

export function openParticipantsPdf(rows: ParticipantRowView[]): void {
    const doc = new jsPDF();
    autoTable(doc, {
        head: [["Name", "Year", "Club", "Ranking"]],
        body: rows.map((row) => [row.name, row.year, row.club, row.ranking]),
    });
    window.open(doc.output("bloburl"), "_blank");
}
