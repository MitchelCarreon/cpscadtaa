import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

import checkIcon from "../../assets/svg/check-icon.svg";
import closeIcon from "../../assets/svg/close-icon.svg";
import { Button } from "@mui/material";

import React from "react";
import axios from "axios";
import "./RegistrationRequestsTable.css";

import Chip from "@mui/material/Chip";
import FaceIcon from "@mui/icons-material/Face";
import ShieldIcon from "@mui/icons-material/Shield";
import SupervisorAccountIcon from "@mui/icons-material/SupervisorAccount";

import Tooltip from "@mui/material/Tooltip";

import AutorenewIcon from "@mui/icons-material/Autorenew";

// <RegistrationRequestsTable token={props.token}, setToken={setToken} />
export default function RegistrationRequestsTable(props) {
  const [tableData, setTableData] = React.useState([]);

  const { setNotify } = props;

  React.useEffect(() => getRegisterRequests(), []);

  function getRegisterRequests() {
    axios
      .get("/get-registration-requests", {
        headers: { Authorization: "Bearer " + props.token },
      })
      .then((response) => {
        console.log(response);
        const data = response.data;
        data.access_token && props.setToken(data.access_token);
        setTableData(data.validUsers);
      })
      .catch((error) => {
        console.log(error);
        localStorage.removeItem("token");
      });
  }

  function setRegistrationStatus(isApproved, user_email) {
    axios
      .post(
        "/set-registration-status",
        JSON.stringify({
          email: user_email,
          isApproved: isApproved,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + props.token,
          },
        }
      )
      .then((response) => {
        console.log(response);
        const data = response.data;
        data.access_token && props.setToken(data.access_token);

        setNotify({
          isOpen: true,
          message: "Registration request updated!",
          type: "success",
        });
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Unable to update registration request",
          type: "error",
        });
        console.log(error);
        localStorage.removeItem("token");
      });
    // getRegisterRequests(); // NOTE: calls setTableData() but does not update consistently

    // force a re-render
    setTableData((prevTableData) => {
      const index = tableData.findIndex((obj) => obj.email === user_email);
      prevTableData.splice(index, 1);
      return prevTableData;
    });
  }

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);
  // Avoid a layout jump when reaching the last page with empty rows.
  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - tableData.length) : 0;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const HeaderStyle = {
    fontWeight: "bold",
    borderBottom: "none",
    // fontFamily: "Open Sans",
    color: "#8898AA",
    padding: "0.5rem 0.5rem 0.5rem 1rem",
  };
  const HeaderBackgroundStyle = {
    backgroundColor: "#F6F9FC",
    borderBottom: "1px solid #E9ECEF",
    borderTop: "1px solid #E9ECEF",
  };
  const useStyles = makeStyles({
    table: {
      "& tbody tr:hover": {
        backgroundColor: "#FFFBF2",
        // backgroundColor: "#f0f0e9",
        cursor: "pointer",
      },
    },
  });
  const classes = useStyles();

  return (
    <TableContainer
      component={Paper}
      style={{ width: "77vw" }}
      className="regReqs-card-table"
    >
      <ThemeProvider theme={theme}>
        <Table aria-label="custom pagination table" className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell
                align="left"
                colSpan={4}
                style={{
                  fontWeight: "normal",
                  fontSize: "1rem",
                  padding: "1rem 1rem 1.1rem 1rem",
                }}
              >
                Review requests
              </TableCell>
            </TableRow>
            <TableRow style={HeaderBackgroundStyle}>
              <TableCell align="left" style={HeaderStyle}>
                Email Address
              </TableCell>
              <TableCell align="center" style={HeaderStyle}>
                Username
              </TableCell>
              <TableCell align="center" style={HeaderStyle}>
                Requested Access Level
              </TableCell>
              <TableCell></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {(rowsPerPage > 0
              ? tableData.slice(
                  page * rowsPerPage,
                  page * rowsPerPage + rowsPerPage
                )
              : tableData
            ).map((row) => (
              <TableRow key={row.username}>
                <TableCell
                  align="left"
                  style={{ fontWeight: "bold", fontSize: "small" }}
                >
                  {row.email}
                </TableCell>
                <TableCell
                  align="center"
                  component="th"
                  scope="row"
                  style={{ fontSize: "small" }}
                >
                  {row.username}
                </TableCell>

                {/* Reason for chips: Placeholder as button. Ability to modify access level later on maybe? */}
                {/* Chosen icons and color for distinction between access levels  */}
                <TableCell align="center" style={{ fontSize: "small" }}>
                  {row.accessLevel === "ASSISTANT" ? (
                    <Tooltip title="Has access to: Assistant page">
                      <Chip
                        variant="outlined"
                        icon={<FaceIcon />}
                        label={
                          row.accessLevel.charAt(0) +
                          row.accessLevel.slice(1).toLowerCase()
                        }
                        style={{ fontSize: "small" }}
                      />
                    </Tooltip>
                  ) : row.accessLevel === "ADMIN" ? (
                    <Tooltip title="Has access to: Setup and Assistant pages">
                      <Chip
                        variant="filled"
                        icon={<SupervisorAccountIcon />}
                        label={
                          row.accessLevel.charAt(0) +
                          row.accessLevel.slice(1).toLowerCase()
                        }
                        style={{ fontSize: "small" }}
                      />
                    </Tooltip>
                  ) : (
                    <Tooltip title="Has access to: Setup, Assistant, and Registration Request pages">
                      <Chip
                        variant="filled"
                        icon={<ShieldIcon style={{ color: "#B07888" }} />}
                        label={
                          row.accessLevel.charAt(0) +
                          row.accessLevel.slice(1).toLowerCase()
                        }
                        style={{ fontSize: "small" }}
                      />
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell align="center">
                  <Tooltip title="Approve">
                    <Button
                      className="btn-approve"
                      variant="contained"
                      onClick={() => setRegistrationStatus(true, row.email)}
                    >
                      <img src={checkIcon} alt="check mark" />
                    </Button>
                  </Tooltip>
                  <Tooltip title="Deny request">
                    <Button
                      className="btn-deny"
                      variant="contained"
                      onClick={() => setRegistrationStatus(false, row.email)}
                    >
                      <img src={closeIcon} alt="close mark" />
                    </Button>
                  </Tooltip>
                </TableCell>
              </TableRow>
            ))}

            {emptyRows > 0 && (
              <TableRow style={{ height: 53 * emptyRows }}>
                <TableCell colSpan={6} />
              </TableRow>
            )}
          </TableBody>

          <TableFooter>
            <TableRow>
              <Tooltip title="Refresh table" arrow>
                <IconButton
                  onClick={getRegisterRequests}
                  style={{ padding: "1rem" }}
                >
                  <AutorenewIcon />
                </IconButton>
              </Tooltip>
              <TablePagination
                rowsPerPageOptions={[3, 5]}
                colSpan={4}
                count={tableData.length}
                rowsPerPage={rowsPerPage}
                page={page}
                SelectProps={{
                  inputProps: {
                    "aria-label": "rows per page",
                  },
                  native: true,
                }}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
                ActionsComponent={TablePaginationActions}
              />
            </TableRow>
          </TableFooter>
        </Table>
      </ThemeProvider>
    </TableContainer>
  );
}

// TABLE PAGINATION (From Mui tables - custom pagination)
function TablePaginationActions(props) {
  const theme = useTheme();
  const { count, page, rowsPerPage, onPageChange } = props;

  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };

  const handleBackButtonClick = (event) => {
    onPageChange(event, page - 1);
  };

  const handleNextButtonClick = (event) => {
    onPageChange(event, page + 1);
  };

  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / rowsPerPage) - 1));
  };

  return (
    <Box sx={{ flexShrink: 0, ml: 2.5 }}>
      <IconButton
        onClick={handleFirstPageButtonClick}
        disabled={page === 0}
        aria-label="first page"
      >
        {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
      </IconButton>
      <IconButton
        onClick={handleBackButtonClick}
        disabled={page === 0}
        aria-label="previous page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowRight />
        ) : (
          <KeyboardArrowLeft />
        )}
      </IconButton>
      <IconButton
        onClick={handleNextButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="next page"
      >
        {theme.direction === "rtl" ? (
          <KeyboardArrowLeft />
        ) : (
          <KeyboardArrowRight />
        )}
      </IconButton>
      <IconButton
        onClick={handleLastPageButtonClick}
        disabled={page >= Math.ceil(count / rowsPerPage) - 1}
        aria-label="last page"
      >
        {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
      </IconButton>
    </Box>
  );
}
TablePaginationActions.propTypes = {
  count: PropTypes.number.isRequired,
  onPageChange: PropTypes.func.isRequired,
  page: PropTypes.number.isRequired,
  rowsPerPage: PropTypes.number.isRequired,
};
const theme = createTheme({
  typography: {
    fontFamily: ["Open sans"],
  },
});
