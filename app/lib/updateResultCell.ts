export function updateResultCell(results: string[][], rowIndex: number, colIndex: number, value: string): string[][] {
    return results.map((row, rIndex) =>
        rIndex === rowIndex
            ? row.map((cell, cIndex) => (cIndex === colIndex ? value : cell))
            : row
    );
}
