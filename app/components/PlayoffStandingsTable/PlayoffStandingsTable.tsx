import "@/app/styles/global/global.css";

import {
  Table,
  TableBody,
  TableContainer,
  TableHead,
  Paper,
} from "@mui/material";
import { StyledTableRow, StyledTableCell } from "@/app/styles/shared/tables";
import { PlayoffStandingRow } from "@/app/types/playoffView";

type PlayoffStandingsTableProps = {
  rows: PlayoffStandingRow[];
};

function PlayoffStandingsTable({ rows }: PlayoffStandingsTableProps) {
  return (
    <TableContainer className="group-table" component={Paper}>
      <Table size="medium">
        <TableHead>
          <StyledTableRow>
            <StyledTableCell className="order">#</StyledTableCell>
            <StyledTableCell>Name</StyledTableCell>
            <StyledTableCell>Year</StyledTableCell>
            <StyledTableCell>Club</StyledTableCell>
          </StyledTableRow>
        </TableHead>
        <TableBody>
          {rows.map((row) => (
            <StyledTableRow key={row.id}>
              <StyledTableCell className="order">{row.place}</StyledTableCell>
              <StyledTableCell>{row.name}</StyledTableCell>
              <StyledTableCell>{row.year}</StyledTableCell>
              <StyledTableCell>{row.club}</StyledTableCell>
            </StyledTableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

export default PlayoffStandingsTable;
