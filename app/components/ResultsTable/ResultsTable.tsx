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
            <StyledTableCell>Place</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Club</StyledTableCell>
            <StyledTableCell>Index</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell>{row.place}</StyledTableCell>
              <StyledTableCell>{row.name}</StyledTableCell>
              <StyledTableCell>{row.club}</StyledTableCell>
              <StyledTableCell>{row.index}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default ResultsTable;
