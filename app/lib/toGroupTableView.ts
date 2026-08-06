import { Group } from "../types/group";
import { GroupTableView } from "../types/groupTableView";

function formatStat(value: number | undefined): string {
  return String(value || 0);
}

export function toGroupTableView(group: Group): GroupTableView {
  const { participants, results } = group;

  const orders = participants.map(
    (participant, index) => participant.groupRanking || index + 1,
  );

  const rows = participants.map((participant, rowIndex) => ({
    id: participant.id,
    order: orders[rowIndex],
    name: participant.name,
    cells: participants.map((_, colIndex) =>
      rowIndex === colIndex
        ? "X"
        : (results[rowIndex] && results[rowIndex][colIndex]) || "",
    ),
    wins: formatStat(participant.wins),
    winsRate: Number(participant.winsRate || 0).toFixed(2),
    scored: formatStat(participant.pointsScored),
    received: formatStat(participant.pointsReceived),
    index: formatStat(participant.index),
  }));

  const rowsById = new Map(rows.map((row) => [row.id, row]));

  const matches = (group.matches || []).flatMap((match) => {
    const first = rowsById.get(match.firstId);
    const second = rowsById.get(match.secondId);
    if (!first || !second) {
      return [];
    }
    return [
      {
        firstOrder: first.order,
        firstName: first.name,
        secondOrder: second.order,
        secondName: second.name,
      },
    ];
  });

  return { id: group.id, orders, rows, matches };
}
