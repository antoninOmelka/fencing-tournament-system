import "./../../styles/global/global.css";

import {
  Paper,
  Table,
  TableBody,
  TableContainer,
  TableHead,
} from "@mui/material";
import { StyledTableCell, StyledTableRow } from "@/app/styles/shared/tables";
import { StyledButton } from "@/app/styles/shared/buttons";
import { GroupTableView } from "@/app/types/groupTableView";

type GroupTableProps = {
  view: GroupTableView;
};

function GroupTable({ view }: GroupTableProps) {
  return (
    <div className="group-table">
      <div className="table-header">
        <h2 className="group-title">Group {view.id}</h2>
        <StyledButton variant="contained" href={`/groups/${view.id}`}>
          Edit
        </StyledButton>
      </div>

      <TableContainer className="group-table" component={Paper}>
        <Table size="medium">
          <TableHead>
            <StyledTableRow>
              <StyledTableCell>Fencer</StyledTableCell>
              <StyledTableCell className="center"></StyledTableCell>
              {view.orders.map((order) => (
                <StyledTableCell className="result" key={order}>
                  {order}
                </StyledTableCell>
              ))}
              <StyledTableCell className="stat">V</StyledTableCell>
              <StyledTableCell className="stat">V/M</StyledTableCell>
              <StyledTableCell className="stat">Scored</StyledTableCell>
              <StyledTableCell className="stat">Received</StyledTableCell>
              <StyledTableCell className="stat">Index</StyledTableCell>
            </StyledTableRow>
          </TableHead>
          <TableBody>
            {view.rows.map((row, rowIndex) => (
              <StyledTableRow key={row.id}>
                <StyledTableCell>{row.name}</StyledTableCell>
                <StyledTableCell className="center">
                  {row.order}
                </StyledTableCell>
                {row.cells.map((cell, cellIndex) => (
                  <StyledTableCell className="result" key={cellIndex}>
                    {rowIndex === cellIndex ? (
                      <div className="group-table-diagonal"></div>
                    ) : (
                      cell
                    )}
                  </StyledTableCell>
                ))}
                <StyledTableCell className="stat">{row.wins}</StyledTableCell>
                <StyledTableCell className="stat">
                  {row.winsRate}
                </StyledTableCell>
                <StyledTableCell className="stat">{row.scored}</StyledTableCell>
                <StyledTableCell className="stat">
                  {row.received}
                </StyledTableCell>
                <StyledTableCell className="stat">{row.index}</StyledTableCell>
              </StyledTableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <div className="match-list">
        {view.matches.map((match, index) => (
          <div key={index}>
            <p>
              {match.firstOrder} {match.firstName}
            </p>
            <p>
              {match.secondOrder} {match.secondName}
            </p>
            <br />
          </div>
        ))}
      </div>
    </div>
  );
}

export default GroupTable;
