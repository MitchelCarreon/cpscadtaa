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

import "./SectionSetupTable.css";

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

import axios from "axios";

import AutorenewIcon from "@mui/icons-material/Autorenew";
import { useNavigate } from "react-router-dom";

import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { TimePicker } from "@mui/x-date-pickers/TimePicker";

import add from "date-fns/add";
import differenceInMinutes from "date-fns/differenceInMinutes";

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;

const MenuPropsMeetingDays = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: "13vw", // Width of dropdown menu. never goes below field_width.
    },
  },
};

const validMeetingDays = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
];

function getStyles(meetingDay, meetingDaysInput, theme) {
  return {
    fontWeight:
      meetingDaysInput.indexOf(meetingDay) === -1
        ? theme.typography.fontWeightRegular
        : theme.typography.fontWeightMedium,
    // fontSize: "x-small",
  };
}

const useStyles = makeStyles({
  table: {
    "& tbody tr:hover": {
      // backgroundColor: "#FFFBF2",
      backgroundColor: "#fcfcfa",      
      cursor: "pointer",
    },
  },
});

export default function CustomPaginationActionsTable(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const [availableCourses, setAvailableCourses] = React.useState([]);

  const [tableData, setTableData] = React.useState([]);
  //   console.log(tableData)

  // INPUT
  const [sectionInfo, setSectionInfo] = React.useState({
    courseNumberInput: "",
    sectionNumberInput: "",
  });
  //   console.log(sectionInfo)

  const [meetingDaysInput, setMeetingDaysInput] = React.useState([]);
  //   console.log(meetingDaysInput)

  const [startMeetingTimeInput, setStartMeetingTimeInput] = React.useState(
    new Date("2008-08-16T09:25:00")
  );
  //   console.log(startMeetingTimeInput);

  const [endMeetingTimeInput, setEndMeetingTimeInput] = React.useState(
    new Date("2008-08-16T10:40:00")
  );
  //   console.log(endMeetingTimeInput);

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

  //   function deleteCourse(event, name, number) {
  //     axios
  //       .post(
  //         "/delete-course",
  //         JSON.stringify({
  //           courseName: name,
  //           courseNumber: number,
  //         }),
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: "Bearer " + props.token,
  //           },
  //         }
  //       )
  //       .then((response) => {
  //         console.log(response);
  //         const data = response.data;
  //         data.access_token && props.setToken(data.access_token);
  //       })
  //       .catch((error) => {
  //         console.log(error);
  //         localStorage.removeItem("token");
  //       });

  //     setTableData((prevTableData) => {
  //       const indexToDelete = tableData.findIndex(
  //         (course) => course.courseName === name && course.courseNumber === number
  //       );
  //       prevTableData.splice(indexToDelete, 1);
  //       return prevTableData;
  //     });

  //     console.log(tableData);
  //   }

  //   function saveCurrentTable(courseIndex) {
  //     axios
  //       .post(
  //         "/add-course",
  //         {
  //           tableData: tableData,
  //           editCourseID: editCourseID,
  //           courseToEditIndex: courseIndex,
  //         },
  //         {
  //           headers: {
  //             "Content-Type": "application/json",
  //             Authorization: "Bearer " + props.token,
  //           },
  //         }
  //       )
  //       .then((response) => console.log(response))
  //       .catch((error) => console.log(error));
  //   }

  function addSection(event) {
    const rowsInput = {
      id: -1,
      courseNumber: "",
      sectionNumber: "",
      meetingDays: [],
      startMeetingTime: new Date("2008-08-16T09:25:00"),
      endMeetingTime: new Date("2008-08-16T09:25:00"),
    };

    setTableData((prevTableData) => [...prevTableData, rowsInput]);
  }

  const [actionSave, setActionSave] = React.useState(false);
  React.useEffect(() => {
    Promise.resolve().then(() => {
      // clear state for inputs. back to defaults.
      setSectionInfo({
        courseNumberInput: "",
        sectionNumberInput: "",
      });
      setMeetingDaysInput([]);
      setStartMeetingTimeInput(new Date("2008-08-16T09:25:00"));
      setEndMeetingTimeInput(new Date("2008-08-16T10:40:00"));

      // clear states for editing.
      setEditMode(false);
      setEditSectionID(-1);

      // getCourseList();
    });
  }, [actionSave]);

  function saveSection(event) {
    let indexOfNewSection = tableData.findIndex((section) => section.id === -1);

    // If editing instructor (findIndex returns -1 if element not found. NOT related to default value of editInstructorID)
    if (indexOfNewSection === -1) {
      indexOfNewSection = tableData.findIndex(
        (section) => section.id === editSectionID
      );
    }
    // console.log(indexOfNewSection);

    Promise.resolve().then(() => {
      setTableData((prevTableData) => {
        let newTableData = prevTableData;

        newTableData[indexOfNewSection] = {
          courseNumber: sectionInfo.courseNumberInput,
          sectionNumber: sectionInfo.sectionNumberInput,
          meetingDaysInput: meetingDaysInput,
          startMeetingTime: startMeetingTimeInput,
          endMeetingTime: endMeetingTimeInput,
        };

        return newTableData;
      });

      console.log(tableData);
      //   saveCurrentTable(indexOfNewSection);
      //   setActionSave(!actionSave);
    });
  }

  // ONCHANGE functions
  function handleSectionInfoChange(e) {
    const { name, value } = e.target;
    setSectionInfo((prevCourseInfo) => {
      return {
        ...prevCourseInfo,
        [name]: value,
      };
    });
  }

  const handleMeetDaysSelectChange = (event) => {
    const {
      target: { value },
    } = event;

    setMeetingDaysInput(
      // On autofill we get a stringified value.
      typeof value === "string" ? value.split(",") : value
    );
  };

  const handleStartMeetTimeChange = (newStartMeetingTime) => {
    setStartMeetingTimeInput(newStartMeetingTime);
    let endTime = null;
    switch (meetingDaysInput.length) {
      case 1:
      case 3:
        endTime = add(newStartMeetingTime, { minutes: 50 });
        setEndMeetingTimeInput(endTime);
        break;
      case 2:
      default:
        endTime = add(newStartMeetingTime, { hours: 1, minutes: 15 });
        setEndMeetingTimeInput(endTime);
        break;
    }
    // if (meetingDaysInput.length === 2) {
    //   var endTime = add(newStartMeetingTime, { hours: 1, minutes: 15 });
    //   setEndMeetingTimeInput(endTime);
    // } else {
    //   endTime = add(newStartMeetingTime, { minutes: 50 });
    //   setEndMeetingTimeInput(endTime);
    // }
  };

  const handleEndMeetTimeChange = (newEndMeetingTime) => {
    setEndMeetingTimeInput(newEndMeetingTime);
  };

  // const textFieldsBorderStyle = useStyles();
  const theme = useTheme();

  function getAvailableCourses() {
    axios
      .get("/get-course-list", {
        headers: { Authorization: "Bearer " + props.token },
      })
      .then((response) => {
        let retrievedTableData = response.data.TableData;

        if (retrievedTableData) {
          setAvailableCourses(retrievedTableData);
        }
      })
      .catch((error) => console.log(error));
  }
  React.useEffect(() => getAvailableCourses(), []);

  const [editSectionID, setEditSectionID] = React.useState(-1);
  const [editMode, setEditMode] = React.useState(false);

  React.useEffect(() => {
    if (editSectionID === -1) {
    } else {
      setEditMode(true);
      //   editCourse(editSectionID);
    }
  }, [editSectionID]);

  //   function editCourse(course_id) {
  //     let indexToEdit = tableData.findIndex((course) => course.id === course_id);

  //     setSectionInfo((prevCourseInfo) => {
  //       return {
  //         courseNumberInput: tableData[indexToEdit].courseName,
  //         sectionNumberInput: tableData[indexToEdit].courseNumber,
  //         meetingDaysInput: tableData[indexToEdit].courseDeptCode,
  //       };
  //     });

  //     setMeetingDaysInput(tableData[indexToEdit].requiredExpertise);
  //   }

  return (
    <TableContainer
      component={Paper}
      style={{ width: "77vw" }}
      className="section-card-table"
    >
      <ThemeProvider theme={theme}>
        <Table aria-label="Course table">
          <TableHead>
            <TableRow>
              <TableCell
                colSpan={5}
                style={{
                  fontWeight: "bold",
                  fontSize: "0.9rem",
                  padding: "1rem 1rem 1.3rem 1rem",
                  borderBottom: "none",
                }}
              >
                Assign sections
              </TableCell>
            </TableRow>
            <TableRow style={HeaderBackgroundStyle}>
              <TableCell style={HeaderStyle}>Course #</TableCell>
              <TableCell style={HeaderStyle}>Section #</TableCell>
              <TableCell style={HeaderStyle}>Meeting Days</TableCell>
              <TableCell style={HeaderStyle}>Start Times</TableCell>
              <TableCell style={HeaderStyle}>End Times</TableCell>
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
                  <TableCell style={{ width: "15vw" }}>
                    {row.courseNumber === "" || editSectionID === row.id ? (
                      <FormControl fullWidth>
                        <InputLabel id="demo-simple-select-label">
                          course #
                        </InputLabel>
                        <Select
                          labelId="demo-simple-select-label"
                          id="demo-simple-select"
                          name="courseNumberInput"
                          value={sectionInfo.courseNumberInput}
                          label="course #"
                          onChange={handleSectionInfoChange}
                        >
                          {availableCourses.map((course) => (
                            <MenuItem key={course.id} value={course.number}>
                              {`${course.name} (${course.number})`}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      row.courseNumber
                    )}
                  </TableCell>

                  <TableCell style={{ width: 150 }}>
                    {row.sectionNumber === "" || editSectionID === row.id ? (
                      <TextField
                        variant="outlined"
                        name="sectionNumberInput"
                        type="number"
                        label="section #"
                        fullWidth
                        value={sectionInfo.sectionNumberInput}
                        onChange={handleSectionInfoChange}
                        // onFocus={() => setCourseNumberFocus(true)}
                        // onBlur={() => setCourseNumberFocus(false)}
                        // error={!validCourseNumber && courseNumberFocus}
                        autoComplete="off"
                      />
                    ) : (
                      row.sectionNumber
                    )}
                  </TableCell>

                  <TableCell style={{ width: "13vw" }}>
                    {!row.meetingDays.length || editSectionID === row.id ? (
                      <FormControl fullWidth>
                        <InputLabel
                          id="demo-multiple-chip-label"
                          //   error={!validDisciplineAreas && disciplineAreasFocus}
                        >
                          Meeting days
                        </InputLabel>
                        <Select
                          labelId="demo-multiple-chip-label"
                          label="Meeting days"
                          id="demo-multiple-chip"
                          name="meetingDaysInput"
                          multiple
                          value={meetingDaysInput}
                          onChange={handleMeetDaysSelectChange}
                          input={
                            <OutlinedInput
                              id="select-multiple-chip"
                              label="Meeting days"
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
                                <Chip
                                  size="small"
                                  key={value}
                                  label={
                                    value.substring(0, 2) !== "Th"
                                      ? value.charAt(0)
                                      : value.substring(0, 2)
                                  }
                                />
                              ))}
                            </Box>
                          )}
                          MenuProps={MenuPropsMeetingDays}
                          //   onFocus={() => setDisciplineAreasFocus(true)}
                          //   onBlur={() => setDisciplineAreasFocus(false)}
                          //   error={!validDisciplineAreas && disciplineAreasFocus}
                        >
                          {validMeetingDays.map((meetingDay) => (
                            <MenuItem
                              key={meetingDay}
                              value={meetingDay}
                              style={getStyles(
                                meetingDay,
                                meetingDaysInput,
                                theme
                              )}
                              disabled={
                                meetingDaysInput.length >= 3 &&
                                !meetingDaysInput.find(
                                  (selectedMeetingDay) =>
                                    selectedMeetingDay === meetingDay
                                )
                              }
                            >
                              {meetingDay}
                            </MenuItem>
                          ))}
                        </Select>
                      </FormControl>
                    ) : (
                      <div className="list-items-discipline-areas">
                        {row.meetingDays.map((meetingDay) => (
                          <Chip label={meetingDay} />
                        ))}
                      </div>
                    )}
                  </TableCell>

                  <TableCell>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        label="Start time"
                        value={startMeetingTimeInput}
                        onChange={handleStartMeetTimeChange}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth />
                        )}
                        disabled={meetingDaysInput.length <= 0}
                      />
                    </LocalizationProvider>
                  </TableCell>

                  <TableCell>
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                      <TimePicker
                        label="End time"
                        value={endMeetingTimeInput}
                        onChange={handleEndMeetTimeChange}
                        renderInput={(params) => (
                          <TextField {...params} fullWidth />
                        )}
                        disabled={meetingDaysInput.length <= 0}
                      />
                    </LocalizationProvider>
                  </TableCell>

                  <TableCell>
                    {row.id === -1 || editSectionID === row.id ? (
                      <Tooltip title="Save">
                        <IconButton
                          //   disabled={
                          //     !validCourseName ||
                          //     !validCourseNumber ||
                          //     !validCourseDeptCode ||
                          //     !validDisciplineAreas
                          //   }
                          className="save-btn"
                          onClick={(e) => {
                            saveSection(e);
                          }}
                        >
                          <SaveIcon className="save-btn-icon" />
                        </IconButton>
                      </Tooltip>
                    ) : (
                      <>
                        <Tooltip title="Edit">
                          <IconButton
                            className="edit-btn"
                            // onClick={() => {
                            //   setEditCourseID(row.id);
                            // }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Delete">
                          <IconButton
                            className="delete-btn"
                            // onClick={(e) => {
                            //   deleteCourse(e, row.courseName, row.courseNumber);
                            // }}
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
                  className="add-section-btn"
                  variant="contained"
                  onClick={(event) => addSection(event)}
                  disabled={
                    editMode || tableData.some((course) => course.id === -1)
                      ? true
                      : false
                  }
                >
                  <AddIcon />
                </Button>

                <Tooltip title="Refresh table">
                  <IconButton
                  //   onClick={getCourseList}
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
