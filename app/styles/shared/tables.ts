import { TableCell, tableCellClasses, TableContainer, TableRow } from "@mui/material";
import { styled } from "@mui/material/styles";

const CELL_HEIGHT = "57px";
const CELL_WIDTHS = {
  name: "250px",
  year: "150px",
  club: "250px",
  ranking: "150px",
  actions: "200px",
};

const TOTAL_WIDTH = Object.values(CELL_WIDTHS).reduce(
  (sum, width) => sum + parseInt(width), 0
);

export const StyledTableContainer = styled(TableContainer, {
    shouldForwardProp: (prop) => prop !== "component"
  })<{ component?: React.ElementType }>(({ theme }) => ({
    width: `${TOTAL_WIDTH}px`,
    margin: "auto",
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    boxShadow: theme.shadows[3],
  }));
  
  export const StyledTableRow = styled(TableRow)(({ theme }) => ({
    height: CELL_HEIGHT,
    "&:nth-of-type(odd)": {
      backgroundColor: theme.palette.action.hover,
    },
    "&.present": {
      backgroundColor: theme.palette.info.light,
    },
    "&:last-child td, &:last-child th": {
      border: 0,
    },
    transition: theme.transitions.create("background-color", {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    height: CELL_HEIGHT,
    padding: theme.spacing(2),
    lineHeight: "1.5",
    verticalAlign: "middle",
    borderBottom: `1px solid ${theme.palette.divider}`,
    boxSizing: "border-box",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
    
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
    "&.name": {
      width: CELL_WIDTHS.name,
      minWidth: CELL_WIDTHS.name,
      maxWidth: CELL_WIDTHS.name,
    },
    "&.year": {
      width: CELL_WIDTHS.year,
      minWidth: CELL_WIDTHS.year,
      maxWidth: CELL_WIDTHS.year,
    },
    "&.club": {
      width: CELL_WIDTHS.club,
      minWidth: CELL_WIDTHS.club,
      maxWidth: CELL_WIDTHS.club,
    },
    "&.ranking": {
      width: CELL_WIDTHS.ranking,
      minWidth: CELL_WIDTHS.ranking,
      maxWidth: CELL_WIDTHS.ranking,
    },
    "&.actions": {
      display: "table-cell",
      textAlign: "center",
      width: CELL_WIDTHS.actions,
      minWidth: CELL_WIDTHS.actions,
      maxWidth: CELL_WIDTHS.actions,
      "& .action-buttons": {
        display: "inline-flex",
        alignItems: "center",
        gap: theme.spacing(1),
      }
    },
    "& .MuiTextField-root": {
      margin: 0,
      width: "95%",
      "& .MuiInputBase-root": {
        height: "40px",
      },
      "& .MuiOutlinedInput-input": {
        padding: "8px 14px",
      }
    }
  }));