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

// import "./InstructorSetupTable.css";
import "./CourseSetupTable.css";
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
// import CustomToolTip from "../Forms/SectionForm/controls/CustomToolTip";
import Controls from "../../components/Forms/SectionForm/controls/Controls";

import axios from "axios";

import AutorenewIcon from "@mui/icons-material/Autorenew";
import MoreTimeOutlinedIcon from "@mui/icons-material/MoreTimeOutlined";
import { useNavigate } from "react-router-dom";

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

// for discipline area dropdown menu items
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

export default function CustomPaginationActionsTable(props) {
  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(5);

  const { setNotify } = props;

  const [tableData, setTableData] = React.useState([]);
  console.log(tableData);
  const [courseInfo, setCourseInfo] = React.useState({
    courseNameInput: "",
    courseNumberInput: "",
    courseDeptCodeInput: "CPSC",
  });
  console.log(courseInfo);
  const [disciplineAreas, setDisciplineAreas] = React.useState([]);

  // <FORM VALIDATION>
  const [validCourseName, setValidCourseName] = React.useState(false);
  const [courseNameFocus, setCourseNameFocus] = React.useState(false);

  const [validCourseNumber, setValidCourseNumber] = React.useState(false);
  const [courseNumberFocus, setCourseNumberFocus] = React.useState(false);

  const [validCourseDeptCode, setValidCourseDeptCode] = React.useState(false);
  const [courseDeptFocus, setCourseDeptFocus] = React.useState(false);

  const [validDisciplineAreas, setValidDisciplineAreas] = React.useState(false);
  const [disciplineAreasFocus, setDisciplineAreasFocus] = React.useState(false);

  React.useEffect(() => {
    const resultCourseName = courseInfo.courseNameInput === "" ? false : true;
    setValidCourseName(resultCourseName);
  }, [courseInfo.courseNameInput]);

  React.useEffect(() => {
    const resultCourseNumber =
      courseInfo.courseNumberInput === "" ? false : true;
    setValidCourseNumber(resultCourseNumber);
  }, [courseInfo.courseNumberInput]);

  React.useEffect(() => {
    const resultCourseDeptCode =
      courseInfo.courseDeptCodeInput === "" ? false : true;
    console.log(courseInfo.courseDeptCodeInput);
    setValidCourseDeptCode(resultCourseDeptCode);
  }, [courseInfo.courseDeptCodeInput]);

  React.useEffect(() => {
    const resultDisciplineAreas = disciplineAreas.length <= 0 ? false : true;
    setValidDisciplineAreas(resultDisciplineAreas);
  }, [disciplineAreas]);

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

  function deleteCourse(event, name, number) {
    axios
      .post(
        "/delete-course",
        JSON.stringify({
          courseName: name,
          courseNumber: number,
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
          message: "Course deleted!",
          type: "success",
        });
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Unable to delete course!",
          type: "error",
        });
        console.log(error);
        localStorage.removeItem("token");
      });

    setTableData((prevTableData) => {
      const indexToDelete = tableData.findIndex(
        (course) => course.courseName === name && course.courseNumber === number
      );

      // DELETE ROW from UI
      prevTableData.splice(indexToDelete, 1);

      // FOR updating CRN in frontend only.
      if (indexToDelete === 0) {
        prevTableData.forEach((elem) => {
          elem.courseReferenceNumber -= 1;
        });
      } else {
        prevTableData.forEach((elem, index) => {
          if (elem.courseReferenceNumber !== 100) {
            elem.courseReferenceNumber =
              prevTableData[index - 1].courseReferenceNumber + 1;
          }
        });
      }

      return prevTableData;
    });

    console.log(tableData);
  }

  function saveCurrentTable(courseIndex) {
    axios
      .post(
        "/add-course",
        {
          tableData: tableData,
          editCourseID: editCourseID,
          courseToEditIndex: courseIndex,
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + props.token,
          },
        }
      )
      .then((response) => {
        setNotify({
          isOpen: true,
          message: "Course added/modified!",
          type: "success",
        });
        console.log(response);
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Unable to add/modify course!",
          type: "error",
        });
        console.log(error);
      });
  }

  function addCourse(event) {
    const rowsInput = {
      id: -1,
      courseName: "",
      courseNumber: "",
      courseDeptCode: "",
      requiredExpertise: [],
    };

    setTableData((prevTableData) => [...prevTableData, rowsInput]);
  }

  const [actionSave, setActionSave] = React.useState(false);
  React.useEffect(() => {
    Promise.resolve().then(() => {
      // clear state for inputs. back to defaults.
      setCourseInfo({
        courseNameInput: "",
        courseNumberInput: "",
        courseDeptCodeInput: "CPSC",
      });
      setDisciplineAreas([]);

      // clear states for editing.
      setEditMode(false);
      setEditCourseID(-1);
      setAddMode(false);

      getCourseList();
    });
  }, [actionSave]);

  function saveCourse(event) {
    let indexOfNewCourse = tableData.findIndex(
      (course) =>
        course.courseName === "" &&
        course.courseNumber === "" &&
        course.courseDeptCode === "" &&
        !course.requiredExpertise.length
    );

    // If editing instructor (findIndex returns -1 if element not found. NOT related to default value of editInstructorID)
    if (indexOfNewCourse === -1) {
      indexOfNewCourse = tableData.findIndex(
        (course) => course.id === editCourseID
      );
    }
    console.log(indexOfNewCourse);

    Promise.resolve().then(() => {
      setTableData((prevTableData) => {
        let newTableData = prevTableData;

        newTableData[indexOfNewCourse] = {
          courseName: courseInfo.courseNameInput,
          courseNumber: courseInfo.courseNumberInput,
          courseDeptCode: courseInfo.courseDeptCodeInput,
          requiredExpertise: disciplineAreas,
        };

        return newTableData;
      });

      // console.log(tableData);
      saveCurrentTable(indexOfNewCourse);
      setActionSave(!actionSave);
    });
  }

  function handleCourseInputChange(e) {
    const { name, value } = e.target;
    setCourseInfo((prevCourseInfo) => {
      return {
        ...prevCourseInfo,
        [name]: value,
      };
    });
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

  // const textFieldsBorderStyle = useStyles();
  const theme = useTheme();

  function getCourseList() {
    axios
      .get("/get-course-list", {
        headers: { Authorization: "Bearer " + props.token },
      })
      .then((response) => {
        let retrievedTableData = response.data.TableData;

        if (retrievedTableData) {
          // Added. If table not empty.
          setTableData(
            retrievedTableData.map((course) => {
              return {
                id: course.id,
                courseName: course.name,
                courseNumber: course.number,
                courseDeptCode: course.deptCode,
                courseReferenceNumber: course.referenceNumber,
                requiredExpertise: course.disciplineAreas.map(
                  (disciplineArea) => disciplineArea.name
                ),
              };
            })
          );
        }
      })
      .catch((error) => console.log(error));
  }
  React.useEffect(() => getCourseList(), []);

  const [editCourseID, setEditCourseID] = React.useState(-1);
  const [editMode, setEditMode] = React.useState(false);
  const [addMode, setAddMode] = React.useState(false);

  React.useEffect(() => {
    if (editCourseID === -1) {
    } else {
      setEditMode(true);
      editCourse(editCourseID);
    }
  }, [editCourseID]);

  function editCourse(course_id) {
    let indexToEdit = tableData.findIndex((course) => course.id === course_id);

    setCourseInfo((prevCourseInfo) => {
      return {
        courseNameInput: tableData[indexToEdit].courseName,
        courseNumberInput: tableData[indexToEdit].courseNumber,
        courseDeptCodeInput: tableData[indexToEdit].courseDeptCode,
      };
    });

    setDisciplineAreas(tableData[indexToEdit].requiredExpertise);
  }

  // TODO: Change to navigate to new page.
  let navigate = useNavigate();
  function goToAssignSectionsPage() {
    let path = "/assign-sections";
    navigate(path);
  }

  return (
    <TableContainer
      component={Paper}
      style={{ width: "77vw" }}
      className="course-card-table"
    >
      {/* <ThemeProvider theme={theme}> */}
      <Table aria-label="Course table" className={classes.table}>
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
              Offered Courses
            </TableCell>
            {/* <TableCell align="right" colSpan={2}>
                Button here!
              </TableCell> */}
          </TableRow>

          <TableRow style={HeaderBackgroundStyle}>
            <TableCell style={HeaderStyle}>Course Name</TableCell>
            <TableCell style={HeaderStyle}>Course #</TableCell>
            {/* <TableCell style={HeaderStyle}>Reference #</TableCell> */}
            <TableCell style={HeaderStyle}>Department Code</TableCell>
            <TableCell style={HeaderStyle}>Required expertise</TableCell>
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
                <TableCell style={{ fontWeight: "bold" }}>
                  {row.courseName === "" || editCourseID === row.id ? (
                    <TextField
                      variant="outlined"
                      name="courseNameInput"
                      label="course name"
                      style={{ width: "100%" }}
                      value={courseInfo.courseNameInput}
                      onChange={handleCourseInputChange}
                      autoFocus
                      onFocus={() => setCourseNameFocus(true)}
                      onBlur={() => setCourseNameFocus(false)}
                      error={!validCourseName && courseNameFocus}
                      autoComplete="off"
                    />
                  ) : (
                    <Tooltip
                      title={
                        row.courseReferenceNumber
                          ? `CRN: ${row.courseReferenceNumber}`
                          : `CRN: ${100 + tableData.length - 1}`
                      }
                      arrow
                      placement="left"
                    >
                      <span>{row.courseName}</span>
                    </Tooltip>
                  )}
                </TableCell>
                <TableCell>
                  {row.courseNumber === "" || editCourseID === row.id ? (
                    <TextField
                      variant="outlined"
                      name="courseNumberInput"
                      type="number"
                      label="course #"
                      style={{ width: "100%" }}
                      value={courseInfo.courseNumberInput}
                      onChange={handleCourseInputChange}
                      onFocus={() => setCourseNumberFocus(true)}
                      onBlur={() => setCourseNumberFocus(false)}
                      error={!validCourseNumber && courseNumberFocus}
                      autoComplete="off"
                    />
                  ) : (
                    row.courseNumber
                  )}
                </TableCell>

                <TableCell>
                  {row.courseDeptCode === "" || editCourseID === row.id ? (
                    <TextField
                      variant="outlined"
                      name="courseDeptCodeInput"
                      label="dept. code"
                      style={{ width: "100%" }}
                      value={courseInfo.courseDeptCodeInput}
                      onChange={handleCourseInputChange}
                      onFocus={() => setCourseDeptFocus(true)}
                      onBlur={() => setCourseDeptFocus(false)}
                      error={!validCourseDeptCode && courseDeptFocus}
                      autoComplete="off"
                    />
                  ) : (
                    row.courseDeptCode
                  )}
                </TableCell>
                <TableCell>
                  {!row.requiredExpertise.length || editCourseID === row.id ? (
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
                      {row.requiredExpertise.map((disciplineArea) => (
                        <Chip label={disciplineArea} />
                      ))}
                    </div>
                  )}
                </TableCell>

                <TableCell>
                  {row.id === -1 || editCourseID === row.id ? (
                    <Tooltip title="Save">
                      <IconButton
                        disabled={
                          !validCourseName ||
                          !validCourseNumber ||
                          !validCourseDeptCode ||
                          !validDisciplineAreas
                        }
                        className="save-btn"
                        onClick={(e) => {
                          saveCourse(e);
                        }}
                      >
                        <SaveIcon className="save-btn-icon" />
                      </IconButton>
                    </Tooltip>
                  ) : (
                    <>
                      <Controls.CustomToolTip title="Edit">
                        <IconButton
                          disabled={addMode}
                          className="edit-btn"
                          onClick={() => {
                            setEditCourseID(row.id);
                          }}
                        >
                          <EditIcon />
                        </IconButton>
                      </Controls.CustomToolTip>

                      <Tooltip title="Delete">
                        <IconButton
                          className="delete-btn"
                          onClick={(e) => {
                            deleteCourse(e, row.courseName, row.courseNumber);
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
                className="add-course-btn"
                variant="contained"
                onClick={(event) => {
                  Promise.resolve().then(() => {
                    setAddMode(true);
                    addCourse(event);
                  });
                }}
                disabled={
                  editMode || tableData.some((course) => course.id === -1)
                    ? true
                    : false
                }
              >
                <AddIcon />
              </Button>

              <Tooltip title="Refresh table" arrow placement="bottom">
                <IconButton
                  onClick={() => {
                    Promise.resolve().then(() => {
                      setCourseInfo({
                        courseNameInput: "",
                        courseNumberInput: "",
                        courseDeptCodeInput: "CPSC",
                      });
                      setDisciplineAreas([]);

                      setEditMode(false);
                      setEditCourseID(-1);
                      setAddMode(false);

                      getCourseList();
                    });
                  }}
                >
                  <AutorenewIcon />
                </IconButton>
              </Tooltip>

              <Tooltip title="Assign sections" arrow placement="bottom">
                <IconButton
                  onClick={goToAssignSectionsPage}
                  className="go-to-assign-sections-btn"
                  disabled={tableData.length > 0 ? false : true}
                >
                  <MoreTimeOutlinedIcon />
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
// const theme = createTheme({
//   typography: {
//     fontFamily: ["Open sans"],
//   },
// });
