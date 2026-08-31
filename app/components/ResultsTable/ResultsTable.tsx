import "@/app/styles/global/global.css";

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
} from "@mui/material";
import { StyledTableRow, StyledTableCell } from "@/app/styles/shared/tables";
import { ResultsTableRow } from "@/app/types/resultsTableRow";

type ResultsTableProps = {
  rows: ResultsTableRow[];
};

function ResultsTable({ rows }: ResultsTableProps) {
  return (
    <TableContainer className="group-table" component={Paper}>
      <Table size="medium">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell className="order">#</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Year</StyledTableCell>
            <StyledTableCell>Club</StyledTableCell>
            <StyledTableCell className="stat">V</StyledTableCell>
            <StyledTableCell className="stat">V/M</StyledTableCell>
            <StyledTableCell className="stat">Scored</StyledTableCell>
            <StyledTableCell className="stat">Received</StyledTableCell>
            <StyledTableCell className="stat">Index</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell className="order">{row.place}</StyledTableCell>
              <StyledTableCell>{row.name}</StyledTableCell>
              <StyledTableCell>{row.year}</StyledTableCell>
              <StyledTableCell>{row.club}</StyledTableCell>
              <StyledTableCell className="stat">{row.wins}</StyledTableCell>
              <StyledTableCell className="stat">{row.winsRate}</StyledTableCell>
              <StyledTableCell className="stat">{row.scored}</StyledTableCell>
              <StyledTableCell className="stat">{row.received}</StyledTableCell>
              <StyledTableCell className="stat">{row.index}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ResultsTable;
