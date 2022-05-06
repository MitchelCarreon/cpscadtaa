import {
  Table,
  TableHead as MuiTableHead,
  TableRow,
  TableCell,
  TablePagination as MuiTablePagination,
  TableSortLabel,
} from "@mui/material";
import React, { useState } from "react";
import { makeStyles } from "@mui/styles";

const useStyles = makeStyles({
  table: {
    marginTop: "24px",
    "& thead th": {
      fontWeight: "600",
      backgroundColor: "rgb(246, 249, 252)",
      color: "rgb(136, 152, 170)",
      padding: "6px",
    },
    "& tbody td": {
      fontWeight: "300",
      padding: "6px",
    },
    "& tbody tr:hover": {
      backgroundColor: "#FFFBF2",
      // backgroundColor: "#fcfcfa",
      cursor: "pointer",
    },
  },
});

export default function useTable(tableData, headerCells, filterFn) {
  const classes = useStyles();
  function TableContainer(props) {
    return <Table className={classes.table}>{props.children}</Table>;
  }

  function TableHeader() {
    const handleSortRequest = (cellId) => {
      const isAsc = orderBy === cellId && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(cellId);
    };

    return (
      <MuiTableHead>
        <TableRow>
          {headerCells.map((headCell) => (
            <TableCell
              key={headCell.id}
              sortDirection={orderBy === headCell.id ? order : false}
            >
              {headCell.disableSorting ? (
                headCell.label
              ) : (
                <TableSortLabel
                  active={orderBy === headCell.id}
                  direction={orderBy === headCell.id ? order : "asc"}
                  onClick={() => {
                    handleSortRequest(headCell.id);
                  }}
                >
                  {headCell.label}
                </TableSortLabel>
              )}
            </TableCell>
          ))}
        </TableRow>
      </MuiTableHead>
    );
  }

  // states for pagination
  const pages = [5, 10];
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(pages[1]);
  const [order, setOrder] = useState();
  const [orderBy, setOrderBy] = useState();

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  function sort(array, comparator) {
    const stabilizedThis = array.map((el, index) => [el, index]);
    stabilizedThis.sort((a, b) => {
      const order = comparator(a[0], b[0]);
      if (order !== 0) return order;
      return a[1] - b[1];
    });
    return stabilizedThis.map((el) => el[0]);
  }

  function getComparator(order, orderBy) {
    return order === "desc"
      ? (a, b) => descendingComparator(a, b, orderBy)
      : (a, b) => -descendingComparator(a, b, orderBy);
  }

  function descendingComparator(a, b, orderBy) {
    if (b[orderBy] < a[orderBy]) {
      return -1;
    }
    if (b[orderBy] > a[orderBy]) {
      return 1;
    }
    return 0;
  }

  const tableDataAfterPagingAndSorting = () => {
    return sort(filterFn.fn(tableData), getComparator(order, orderBy)).slice(
      page * rowsPerPage,
      (page + 1) * rowsPerPage
    );
  };

  function TablePagination() {
    return (
      <MuiTablePagination
        component="div"
        page={page}
        rowsPerPageOptions={pages}
        rowsPerPage={rowsPerPage}
        count={tableData.length}
        onPageChange={handleChangePage}
        onRowsPerPageChange={handleChangeRowsPerPage}
      />
    );
  }

  return {
    TableContainer,
    TableHeader,  
    TablePagination,
    tableDataAfterPagingAndSorting: tableDataAfterPagingAndSorting,
  };
}
