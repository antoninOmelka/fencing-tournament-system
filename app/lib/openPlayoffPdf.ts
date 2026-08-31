import jsPDF from "jspdf";
import { createPdfDocument } from "./createPdfDocument";
import { PlayoffSideView, PlayoffView } from "../types/playoffView";

const MARGIN = 14;
const TITLE_Y = 15;
const BRACKET_TOP = 28;
const COLUMN_GAP = 8;
const SIDE_HEIGHT = 7;
const SEED_WIDTH = 6;

function truncate(doc: jsPDF, text: string, maxWidth: number): string {
  if (doc.getTextWidth(text) <= maxWidth) {
    return text;
  }
  let shortened = text;
  while (
    shortened.length > 1 &&
    doc.getTextWidth(`${shortened}...`) > maxWidth
  ) {
    shortened = shortened.slice(0, -1);
  }
  return `${shortened}...`;
}

export async function openPlayoffPdf(view: PlayoffView): Promise<void> {
  const doc = await createPdfDocument();
  doc.text("Playoff", MARGIN, TITLE_Y);

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const { rounds } = view;
  const columnWidth =
    (pageWidth - 2 * MARGIN - COLUMN_GAP * (rounds.length - 1)) /
    rounds.length;

  // vertical center of every match box: the first round is spread evenly,
  // each later match sits between the two matches feeding it
  const availableHeight = pageHeight - BRACKET_TOP - MARGIN;
  const slotHeight = availableHeight / rounds[0].matches.length;
  const centersByRound: number[][] = [];
  rounds.forEach((round, roundIndex) => {
    if (roundIndex === 0) {
      centersByRound.push(
        round.matches.map(
          (_, index) => BRACKET_TOP + slotHeight * index + slotHeight / 2,
        ),
      );
    } else {
      const previous = centersByRound[roundIndex - 1];
      centersByRound.push(
        round.matches.map(
          (_, index) => (previous[2 * index] + previous[2 * index + 1]) / 2,
        ),
      );
    }
  });

  function drawSide(side: PlayoffSideView, x: number, y: number): void {
    if (side.isWinner) {
      doc.setFillColor(225, 225, 225);
      doc.rect(x, y, columnWidth, SIDE_HEIGHT, "FD");
    } else {
      doc.rect(x, y, columnWidth, SIDE_HEIGHT);
    }

    doc.setFontSize(9);
    const textY = y + SIDE_HEIGHT / 2;
    if (side.seed !== null) {
      doc.setTextColor(120);
      doc.text(String(side.seed), x + 2, textY, { baseline: "middle" });
    }
    doc.setTextColor(side.participantId === null ? 150 : 0);
    doc.text(
      truncate(doc, side.label, columnWidth - SEED_WIDTH - 4),
      x + 2 + SEED_WIDTH,
      textY,
      { baseline: "middle" },
    );
    doc.setTextColor(0);
  }

  rounds.forEach((round, roundIndex) => {
    const x = MARGIN + roundIndex * (columnWidth + COLUMN_GAP);

    doc.setFontSize(11);
    doc.setTextColor(0);
    doc.text(round.title, x, BRACKET_TOP - 3);

    round.matches.forEach((match, matchIndex) => {
      const center = centersByRound[roundIndex][matchIndex];
      drawSide(match.first, x, center - SIDE_HEIGHT);
      drawSide(match.second, x, center);

      // elbow connector into the match this one feeds
      if (roundIndex < rounds.length - 1) {
        const nextCenter = centersByRound[roundIndex + 1][
          Math.floor(matchIndex / 2)
        ];
        const boxEnd = x + columnWidth;
        const midX = boxEnd + COLUMN_GAP / 2;
        doc.line(boxEnd, center, midX, center);
        doc.line(midX, center, midX, nextCenter);
        doc.line(midX, nextCenter, boxEnd + COLUMN_GAP, nextCenter);
      }
    });
  });

  window.open(doc.output("bloburl"), "_blank");
}
