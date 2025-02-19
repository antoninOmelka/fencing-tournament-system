import { TableCell, tableCellClasses, TableContainer, TableRow } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StyledTableContainer = styled(TableContainer, {
    shouldForwardProp: (prop) => prop !== 'component'
  })<{ component?: React.ElementType }>(({ theme }) => ({
    maxWidth: 800,
    margin: 'auto',
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(3),
    boxShadow: theme.shadows[3],
  }));
  
  export const StyledTableRow = styled(TableRow, {
    shouldForwardProp: (prop) => prop !== 'ispresent'
  })<{ ispresent?: string }>(({ theme, ispresent }) => ({
    // Base styles
    '&:nth-of-type(odd)': {
      backgroundColor: ispresent === 'true' 
        ? theme.palette.info.light 
        : theme.palette.action.hover,
    },
    // Present participant styles
    backgroundColor: ispresent === 'true' ? theme.palette.info.light : 'inherit',
    '&:hover': {
      backgroundColor: ispresent === 'true' 
        ? theme.palette.info.main 
        : theme.palette.action.selected,
    },
    // Hide last border
    '&:last-child td, &:last-child th': {
      border: 0,
    },
    transition: theme.transitions.create('background-color', {
      duration: theme.transitions.duration.shortest,
    }),
  }));

  export const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
      backgroundColor: theme.palette.common.black,
      color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
      fontSize: 14,
    },
  }));