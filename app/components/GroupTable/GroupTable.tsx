import "./../../styles/global/global.css";

import { Paper, Table, TableBody, TableContainer, TableHead } from "@mui/material";
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
                            <StyledTableCell></StyledTableCell>
                            {view.orders.map((order) => (
                                <StyledTableCell key={order}>{order}</StyledTableCell>
                            ))}
                            <StyledTableCell>Wins</StyledTableCell>
                            <StyledTableCell>Wins Rate</StyledTableCell>
                            <StyledTableCell>Scored</StyledTableCell>
                            <StyledTableCell>Received</StyledTableCell>
                            <StyledTableCell>Index</StyledTableCell>
                        </StyledTableRow>
                    </TableHead>
                    <TableBody>
                        {view.rows.map((row) => (
                            <StyledTableRow key={row.id}>
                                <StyledTableCell>{row.name}</StyledTableCell>
                                <StyledTableCell>{row.order}</StyledTableCell>
                                {row.cells.map((cell, cellIndex) => (
                                    <StyledTableCell key={cellIndex}>{cell}</StyledTableCell>
                                ))}
                                <StyledTableCell>{row.wins}</StyledTableCell>
                                <StyledTableCell>{row.winsRate}</StyledTableCell>
                                <StyledTableCell>{row.scored}</StyledTableCell>
                                <StyledTableCell>{row.received}</StyledTableCell>
                                <StyledTableCell>{row.index}</StyledTableCell>
                            </StyledTableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <div className="match-list">
                {view.matches.map((match, index) => (
                    <div key={index}>
                        <p>{match.firstOrder} {match.firstName}</p>
                        <p>{match.secondOrder} {match.secondName}</p>
                        <br />
                    </div>
                ))}
            </div>
        </div>
    );
}

export default GroupTable;
