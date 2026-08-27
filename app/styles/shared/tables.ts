import {
  TableCell,
  tableCellClasses,
  TableContainer,
  TableRow,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const CELL_HEIGHT = "80px";
const CELL_WIDTHS = {
  order: "60px",
  name: "250px",
  year: "150px",
  club: "250px",
  ranking: "150px",
  actions: "200px",
};

// uniform narrow width for the stat columns (V, V/M, Scored, Received, Index);
// separate from CELL_WIDTHS, which sums up to the participants table width
const STAT_CELL_WIDTH = "80px";

// width of one editable result cell in the group matrix — wide enough for
// a "D3" in the text field without clipping
const RESULT_CELL_WIDTH = "90px";

const TOTAL_WIDTH = Object.values(CELL_WIDTHS).reduce(
  (sum, width) => sum + parseInt(width),
  0,
);

export const StyledTableContainer = styled(TableContainer, {
  shouldForwardProp: (prop) => prop !== "component",
})<{ component?: React.ElementType }>(({ theme }) => ({
  width: `${TOTAL_WIDTH}px`,
  margin: "auto",
  marginBottom: theme.spacing(3),
  boxShadow: theme.shadows[3],
}));

export const StyledTableActions = styled("div")({
  width: `${TOTAL_WIDTH}px`,
  margin: "auto",
  display: "flex",
  justifyContent: "flex-end",
});

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
  "&.order": {
    textAlign: "center",
    width: CELL_WIDTHS.order,
    minWidth: CELL_WIDTHS.order,
    maxWidth: CELL_WIDTHS.order,
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
  "&.center": {
    textAlign: "center",
    "& .MuiInputBase-input": {
      textAlign: "center",
    },
  },
  "&.stat": {
    textAlign: "center",
    width: STAT_CELL_WIDTH,
    minWidth: STAT_CELL_WIDTH,
    maxWidth: STAT_CELL_WIDTH,
    padding: theme.spacing(1),
  },
  "&.result": {
    textAlign: "center",
    width: RESULT_CELL_WIDTH,
    minWidth: RESULT_CELL_WIDTH,
    maxWidth: RESULT_CELL_WIDTH,
    padding: theme.spacing(1),
    "& .MuiInputBase-input": {
      textAlign: "center",
      paddingLeft: theme.spacing(0.5),
      paddingRight: theme.spacing(0.5),
    },
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
    },
  },
  "& .MuiTextField-root": {
    width: "100%",
    display: "flex",
    alignItems: "center",
  },

  "& .MuiInputBase-root": {
    height: "40px",
  },

  "& .MuiFormHelperText-root": {
    position: "absolute",
    bottom: "-1.7em",
    left: "0px",
  },

  position: "relative",
}));
