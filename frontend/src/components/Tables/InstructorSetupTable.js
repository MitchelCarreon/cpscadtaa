import * as React from "react";
import PropTypes from "prop-types";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableContainer from "@mui/material/TableContainer";
import TableFooter from "@mui/material/TableFooter";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

import IconButton from "@mui/material/IconButton";
import FirstPageIcon from "@mui/icons-material/FirstPage";
import KeyboardArrowLeft from "@mui/icons-material/KeyboardArrowLeft";
import KeyboardArrowRight from "@mui/icons-material/KeyboardArrowRight";
import LastPageIcon from "@mui/icons-material/LastPage";

import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import { Button } from "@mui/material";

import "./InstructorSetupTable.css";
import { ThemeProvider, createTheme, styled } from "@mui/material/styles";
import { makeStyles } from "@mui/styles";

import { TextField } from "@mui/material";
// import { makeStyles } from "@mui/styles";

import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";

import Tooltip from "@mui/material/Tooltip";
import CustomToolTip from "../Forms/SectionForm/controls/CustomToolTip";

import axios from "axios";

import AutorenewIcon from "@mui/icons-material/Autorenew";
import { BorderColor } from "@mui/icons-material";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

// TODO: Put in a constants file and import here.
const recognizedDisciplineAreas = [
  "Artificial Intelligence",
  "Computer Organization",
  "Cybersecurity",
  "Data structures",
  "Data Structures and Algorithms",
  "Game Development",
  "Hardware Designs",
  "Mobile Applications",
  "Networks",
  "Operating Systems",
  "Parallel and Distributed Systems",
  "Programming Languages",
  "Programming-C++",
  "Programming-Python",
  "Software Development Methodologies",
  "Software Engineering",
  "Theory of Computation",
  "Virtual Reality",
];

function getStyles(name, disciplineAreas, theme) {
  return {
    fontWeight:
      disciplineAreas.indexOf(name) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
    // fontSize: "x-small",
  };
}
const useStyles = makeStyles({
  table: {
    "& tbody tr:hover": {
      backgroundColor: "#FFFBF2",
      // backgroundColor: "#fcfcfa",
      cursor: "pointer",
    },
  },
});

// alternative way to make styles. typography and palette.
const outerTheme = createTheme({
  typography: {
    fontFamily: ["Open sans"],
  },
});

export default function CustomPaginationActionsTable(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const { setNotify } = props;

  const [tableData, setTableData] = React.useState([]);
  console.log(tableData);
  const [instructorName, setInstructorName] = React.useState({
    lastNameInput: "",
    firstNameInput: "",
  });

  // NEW (1)
  const [instructorMaxLoad, setInstructorMaxLoad] = React.useState("");

  const [disciplineAreas, setDisciplineAreas] = React.useState([]);

  // <FORM VALIDATION>
  const [validFirstName, setValidFirstName] = React.useState(false);
  const [firstNameFocus, setFirstNameFocus] = React.useState(false);

  const [validLastName, setValidLastName] = React.useState(false);
  const [lastNameFocus, setLastNameFocus] = React.useState(false);

  const [validDisciplineAreas, setValidDisciplineAreas] = React.useState(false);
  const [disciplineAreasFocus, setDisciplineAreasFocus] = React.useState(false);

  // NEW (2)
  const [validMaxLoad, setValidMaxLoad] = React.useState(false);
  const [maxLoadFocus, setMaxLoadFocus] = React.useState(false);

  // Last name validation
  React.useEffect(() => {
    const resultLastName = instructorName.lastNameInput === "" ? false : true;
    setValidLastName(resultLastName);
  }, [instructorName.lastNameInput]);

  // First name validation
  React.useEffect(() => {
    const resultFirstName = instructorName.firstNameInput === "" ? false : true;
    setValidFirstName(resultFirstName);
  }, [instructorName.firstNameInput]);

  // Discipline areas validation
  React.useEffect(() => {
    const resultDisciplineAreas = disciplineAreas.length <= 0 ? false : true;
    setValidDisciplineAreas(resultDisciplineAreas);
  }, [disciplineAreas]);

  // NEW (3) Max Load validation
  React.useEffect(() => {
    const resultMaxLoad =
      instructorMaxLoad <= 0 || instructorMaxLoad > 4 ? false : true;
    setValidMaxLoad(resultMaxLoad);
  }, [instructorMaxLoad]);

  // </FORM VALIDATION>

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
  };
  const HeaderBackgroundStyle = {
    backgroundColor: "#F6F9FC",
    borderBottom: "1px solid #E9ECEF",
    borderTop: "1px solid #E9ECEF",
  };

  const classes = useStyles();

  function deleteInstructor(event, lastName, firstName) {
    axios
      .post(
        "/delete-instructor",
        JSON.stringify({
          instructorLastName: lastName,
          instructorFirstName: firstName,
        }),
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + props.token,
          },
        }
      )
      .then((response) => {
        // console.log(response);
        const data = response.data;
        data.access_token && props.setToken(data.access_token);

        setNotify({
          isOpen: true,
          message: "Instructor deleted!",
          type: "success",
        });
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Unable to delete instructor!",
          type: "error",
        });
        console.log(error);
        localStorage.removeItem("token");
      });

    setTableData((prevTableData) => {
      const indexToDelete = tableData.findIndex(
        (element) =>
          element.lastName === lastName && element.firstName === firstName
      );
      prevTableData.splice(indexToDelete, 1);
      return prevTableData;
    });
  }

  function saveCurrentTable(instructorIndex) {
    axios
      .post(
        "/add-instructor",
        {
          tableData: tableData,
          editInstructorID: editInstructorID,
          instructorToEditIndex: instructorIndex,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + props.token,
          },
        }
      )
      .then((response) => {
        // console.log(response);
        setNotify({
          isOpen: true,
          message: "Instructor added/modified!",
          type: "success",
        });
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Unable to add/modify instructor.",
          type: "error",
        });
        console.log(error);
      });
  }

  function addInstructor(event) {
    // console.log(event);
    const rowsInput = {
      id: -1,
      lastName: "",
      firstName: "",
      maxLoad: "", // NEW (4)
      expertise: [],
    };

    setTableData((prevTableData) => [...prevTableData, rowsInput]);
  }

  const [actionSave, setActionSave] = React.useState(false);
  React.useEffect(() => {
    // PROBLEM DESCRIPTION:
    // Sometimes and not always, after clicking the editBTN then the saveBTN (W/O clicking the addBTN).
    // Its corresponding Select field will show up but empty. The intended behavior is for it not to show up and show chips instead.
    // Behavior is always fine upon clicking the editBTN. TextFields and Select show up with expected values.
    // The problem only shows up upon clicking the saveBTN.
    // ASSUMPTIONS:
    // 1. The PROBLEM must be isolated within saveInstructor() which saveBTN executes onClick.
    // 1.1. The PROBLEM must be async-related since the behavior is inconsistent (sometimes successful, sometimes fails).
    // 1.2. Since it is only possible to see the select field when "(!row.expertise.length || editInstructorID === row.id)",
    // the PROBLEM must lie on editInstructorID since no changes, at this time,
    // are made on row.expertise.length (refers to an element in tableData)
    // 2. It must be the case that: disciplineAreas state has been set empty, then rendered (causing an empty TextField).
    //  Only afterwards, did setEditInstructorID trigger (so it was probably batched in a different group and waiting for its render).
    // 2.1. In successsul times, it must be the case that: setEditInstructorID ran (s.t. this !== row.id) and disciplineAreas state has been set empty.
    // Then rendered in the same batch.
    // 2.2. Since we don't know exactly how it batches the execution of these async setStates. I think the most feasible solution (but inefficient)
    //  is to make each state change s.t. each one triggers a re-render (not batched).

    // SOLUTION:
    // A. We know that useState is async. To force a render for each state change, we can wrap code
    // (pass as an arrow function) in a Promise.resolve().then()
    // B. To execute code based on a state, we can wrap code in a useEffect(). So that, for every change of this state (actionSave),
    // the code is ran.

    Promise.resolve().then(() => {
      // clear state for inputs. back to defaults.
      setInstructorName({
        lastNameInput: "",
        firstNameInput: "",
      });
      setDisciplineAreas([]);

      setInstructorMaxLoad(""); // NEW (5)

      // clear states for editing.
      setEditMode(false);
      setEditInstructorID(-1);
      setAddMode(false);

      getInstructorRoster();
    });
  }, [actionSave]);

  function saveInstructor(event) {
    let indexOfNewInstructor = tableData.findIndex(
      (instructor) =>
        instructor.lastName === "" &&
        instructor.firstName === "" &&
        !instructor.expertise.length
    );

    // If editing instructor (findIndex returns -1 if element not found. NOT related to default value of editInstructorID)
    if (indexOfNewInstructor === -1) {
      indexOfNewInstructor = tableData.findIndex(
        (instructor) => instructor.id === editInstructorID
      );
    }
    // console.log(indexOfNewInstructor);

    Promise.resolve().then(() => {
      setTableData((prevTableData) => {
        let newTableData = prevTableData;

        newTableData[indexOfNewInstructor] = {
          lastName: instructorName.lastNameInput,
          firstName: instructorName.firstNameInput,
          maxLoad: instructorMaxLoad, // NEW (6)
          expertise: disciplineAreas,
        };

        return newTableData;
      });

      // console.log(tableData);
      saveCurrentTable(indexOfNewInstructor);
      setActionSave(!actionSave);
    });
  }

  function handleInstructorInputChange(e) {
    const { name, value } = e.target;
    setInstructorName((prevInstructorName) => {
      return {
        ...prevInstructorName,
        [name]: value,
      };
    });

    // console.log(instructorName);
  }

  const handleSelectChange = (event) => {
    const {
      target: { value },
    } = event;
    setDisciplineAreas(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  // NEW (11)
  function handleInstructorMaxLoadChange(event) {
    const { value } = event.target;
    setInstructorMaxLoad(value);
  }

  // const textFieldsBorderStyle = useStyles();
  const theme = useTheme();

  function getInstructorRoster() {
    axios
      .get("/get-instructors-roster", {
        headers: { Authorization: "Bearer " + props.token },
      })
      .then((response) => {
        let retrievedTableData = response.data.TableData;
        // console.log(retrievedTableData);

        /* 
          EXPLANATION FOR multiple use of Array.map() as seen below ---->
            backend returns more than what is necessary. (instructor_id might come in handy though)
            This was done via serialization through Marshmallow.Schema which exposed extra fields such as id.
            Error occurs when schema fields are left to one element (Must be a list or tuple)
            Potential solution: tuple("<name_of_field_here>")
        */
        if (retrievedTableData) {
          // Added recently. If table not empty.
          setTableData(
            retrievedTableData.map((instructor) => {
              return {
                id: instructor.id,
                lastName: instructor.lastName,
                firstName: instructor.firstName,
                maxLoad: instructor.maxLoad, // NEW (7)
                expertise: instructor.disciplineAreas.map(
                  (disciplineArea) => disciplineArea.name
                ),
              };
            })
          );
        }
      })
      .catch((error) => console.log(error));
  }
  React.useEffect(() => getInstructorRoster(), []);

  const [editInstructorID, setEditInstructorID] = React.useState(-1);
  const [editMode, setEditMode] = React.useState(false);
  const [addMode, setAddMode] = React.useState(false);

  // EDITING ROWS . States for editMode and editInstructorID
  // console.log(`EditMode: ${editMode}, editInstructorID: ${editInstructorID}`);
  // console.log(tableData);
  React.useEffect(() => {
    if (editInstructorID === -1) {
      // quick fix for initial render upon loading page. whatever results this may have, they're all unintended side-effects.
    } else {
      setEditMode(true);
      editInstructor(editInstructorID);
    }
  }, [editInstructorID]);

  function editInstructor(instructor_id) {
    let indexToEdit = tableData.findIndex(
      (instructor) => instructor.id === instructor_id
    );

    // For values inside textfields. a way of "dynamically setting defaultValue". Added for edit functionality.
    setInstructorName((prevInstructorName) => {
      return {
        firstNameInput: tableData[indexToEdit].firstName,
        lastNameInput: tableData[indexToEdit].lastName,
      };
    });

    // NEW (13)
    setInstructorMaxLoad(tableData[indexToEdit].maxLoad);

    // console.log(tableData[indexToEdit].expertise)
    setDisciplineAreas(tableData[indexToEdit].expertise);
  }

  return (
    <TableContainer
      component={Paper}
      style={{ width: "77vw" }}
      className="instructor-card-table"
    >
      {/* <ThemeProvider theme={outerTheme}> */}
      <Table aria-label="Instructor table" className={classes.table}>
        <TableHead>
          <TableRow>
            <TableCell
              colSpan={3}
              style={{
                fontWeight: "bold",
                fontSize: "0.9rem",
                padding: "1rem 1rem 1.3rem 1rem",
                borderBottom: "none",
              }}
            >
              Current Roster
            </TableCell>
            <TableCell
              align="right"
              colSpan={2}
              style={{ borderBottom: "none" }}
            >
              Instructors
            </TableCell>
          </TableRow>
          {/* NEW (9) */}
          <TableRow style={HeaderBackgroundStyle}>
            <TableCell style={HeaderStyle}>Last Name</TableCell>
            <TableCell style={HeaderStyle}>First Name</TableCell>
            <TableCell style={HeaderStyle}>Max load</TableCell>
            <TableCell style={HeaderStyle}>Expertise</TableCell>
            <TableCell
              style={{
                width: "5rem",
                borderBottom: "none",
                borderTop: "none",
              }}
              aria-label="btns-area"
            ></TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {(rowsPerPage > 0
            ? tableData.slice(
                page * rowsPerPage,
                page * rowsPerPage + rowsPerPage
              )
            : tableData
          ).map((row) => {
            return (
              <TableRow key={row.name} style={{ border: "none" }}>
                <TableCell className="last-name-text">
                  {row.lastName === "" || editInstructorID === row.id ? (
                    <TextField
                      variant="outlined"
                      name="lastNameInput"
                      label="last name"
                      style={{ width: "100%" }}
                      value={instructorName.lastNameInput}
                      onChange={handleInstructorInputChange}
                      autoFocus
                      onFocus={() => setLastNameFocus(true)}
                      onBlur={() => setLastNameFocus(false)}
                      error={!validLastName && lastNameFocus}
                      autoComplete="off"
                    />
                  ) : (
                    row.lastName
                  )}
                </TableCell>
                <TableCell>
                  {row.firstName === "" || editInstructorID === row.id ? (
                    <TextField
                      variant="outlined"
                      name="firstNameInput"
                      label="first name"
                      style={{ width: "100%" }}
                      value={instructorName.firstNameInput}
                      onChange={handleInstructorInputChange}
                      onFocus={() => setFirstNameFocus(true)}
                      onBlur={() => setFirstNameFocus(false)}
                      error={!validFirstName && firstNameFocus}
                      autoComplete="off"
                    />
                  ) : (
                    row.firstName
                  )}
                </TableCell>
                {/* NEW (7) */}
                <TableCell>
                  {row.maxLoad === "" || editInstructorID === row.id ? (
                    <TextField
                      variant="outlined"
                      name="maxLoadInput"
                      label="Max load"
                      type="number"
                      style={{ width: "100%" }}
                      value={instructorMaxLoad}
                      onChange={handleInstructorMaxLoadChange}
                      onFocus={() => setMaxLoadFocus(true)}
                      onBlur={() => setMaxLoadFocus(false)}
                      error={!validMaxLoad && maxLoadFocus}
                      autoComplete="off"
                    />
                  ) : (
                    row.maxLoad
                  )}
                </TableCell>

                <TableCell>
                  {!row.expertise.length || editInstructorID === row.id ? (
                    <FormControl sx={{ width: 300 }}>
                      <InputLabel
                        id="demo-multiple-chip-label"
                        error={!validDisciplineAreas && disciplineAreasFocus}
                      >
                        Discipline areas
                      </InputLabel>
                      <Select
                        labelId="demo-multiple-chip-label"
                        label="Discipline areas"
                        id="demo-multiple-chip"
                        name="disciplineAreasInput"
                        width="200"
                        multiple
                        value={disciplineAreas}
                        onChange={handleSelectChange}
                        input={
                          <OutlinedInput
                            id="select-multiple-chip"
                            label="Discipline areas"
                          />
                        }
                        renderValue={(selected) => (
                          <Box
                            sx={{
                              display: "flex",
                              flexWrap: "wrap",
                              gap: 0.5,
                            }}
                          >
                            {selected.map((value) => (
                              <Chip key={value} label={value} />
                            ))}
                          </Box>
                        )}
                        MenuProps={MenuProps}
                        onFocus={() => setDisciplineAreasFocus(true)}
                        onBlur={() => setDisciplineAreasFocus(false)}
                        error={!validDisciplineAreas && disciplineAreasFocus}
                      >
                        {recognizedDisciplineAreas.map((name) => (
                          <MenuItem
                            key={name}
                            value={name}
                            style={getStyles(name, disciplineAreas, theme)}
                          >
                            {name}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  ) : (
                    <div className="list-items-discipline-areas">
                      {row.expertise.map((disciplineArea) => (
                        <Chip label={disciplineArea} />
                      ))}
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  {row.id === -1 || editInstructorID === row.id ? (
                    <Tooltip title="Save">
                      <IconButton
                        disabled={
                          !validLastName ||
                          !validFirstName ||
                          !validDisciplineAreas ||
                          !validMaxLoad
                        }
                        className="save-btn"
                        onClick={(e) => {
                          saveInstructor(e);
                        }}
                      >
                        <SaveIcon className="save-btn-icon" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <>
                      <CustomToolTip title="Edit">
                        <IconButton
                          className="edit-btn"
                          disabled={addMode}
                          onClick={() => {
                            setEditInstructorID(row.id);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </CustomToolTip>
                      <Tooltip title="Delete">
                        <IconButton
                          className="delete-btn"
                          onClick={(e) => {
                            deleteInstructor(e, row.lastName, row.firstName);
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </Tooltip>
                    </>
                  )}
                </TableCell>
              </TableRow>
            );
          })}

          {emptyRows > 0 && (
            <TableRow style={{ height: 53 * emptyRows }}>
              <TableCell colSpan={6} />
            </TableRow>
          )}
        </TableBody>

        <TableFooter>
          <TableRow>
            <TableCell colspan={2} style={{ padding: "0rem" }}>
              <Button
                className="add-instructor-btn"
                variant="contained"
                onClick={(event) => {
                  Promise.resolve().then(() => {
                    setAddMode(true);
                    addInstructor(event);
                  });
                }}
                disabled={
                  editMode ||
                  tableData.some((instructor) => instructor.lastName === "")
                    ? true
                    : false
                }
              >
                <AddIcon />
              </Button>

              <Tooltip title="Refresh table" arrow>
                <IconButton
                  onClick={() => {
                    Promise.resolve().then(() => {
                      // clear state for inputs. back to defaults.
                      setInstructorName({
                        lastNameInput: "",
                        firstNameInput: "",
                      });
                      setDisciplineAreas([]);

                      setInstructorMaxLoad(""); // NEW (10)

                      setEditMode(false);
                      setEditInstructorID(-1);
                      setAddMode(false);

                      getInstructorRoster();
                    });
                  }}
                >
                  <AutorenewIcon />
                </IconButton>
              </Tooltip>
            </TableCell>

            <TablePagination
              rowsPerPageOptions={[3, 5]}
              colSpan={3}
              count={tableData.length}
              rowsPerPage={rowsPerPage}
              style={{ border: "none" }}
              page={page}
              SelectProps={{
                inputProps: {
                  "aria-label": "Rows per page",
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
      {/* </ThemeProvider> */}
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
