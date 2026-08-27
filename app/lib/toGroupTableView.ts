import { Group } from "../types/group";
import { GroupTableView } from "../types/groupTableView";

function formatStat(value: number | undefined): string {
  return String(value || 0);
}

export function toGroupTableView(group: Group): GroupTableView {
  const { participants } = group;
  const results = group.results || [];

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

  const indexById = new Map(
    participants.map((participant, index) => [participant.id, index]),
  );

  const matches = (group.matches || []).flatMap((match) => {
    const firstIndex = indexById.get(match.firstId);
    const secondIndex = indexById.get(match.secondId);
    if (firstIndex === undefined || secondIndex === undefined) {
      return [];
    }
    return [
      {
        firstOrder: orders[firstIndex],
        firstName: participants[firstIndex].name,
        firstResult:
          (results[firstIndex] && results[firstIndex][secondIndex]) || "",
        secondOrder: orders[secondIndex],
        secondName: participants[secondIndex].name,
        secondResult:
          (results[secondIndex] && results[secondIndex][firstIndex]) || "",
      },
    ];
  });

  return { id: group.id, orders, rows, matches };
}
