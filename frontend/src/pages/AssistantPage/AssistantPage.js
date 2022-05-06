import React from "react";
import axios from "axios";
import Loader from "../../components/LoadingScreen/Loader";
import { Navigate } from "react-router-dom";

import assistantBackground from "../../assets/svg/background_assistant.svg";
import Sidebar from "../../components/Sidebar";
import "./AssistantPage.css";

import Controls from "../../components/Forms/SectionForm/controls/Controls";
import {
  InputAdornment,
  Paper,
  Toolbar,
  TableBody,
  TableCell,
  TableRow,
  Chip,
  Tooltip,
  TableFooter,
  IconButton,
  Typography,
  Grid,
  TableHead,
} from "@mui/material";
import useTable from "../../components/Tables/useTable";

import { makeStyles } from "@mui/styles";
import SearchIcon from "@mui/icons-material/Search";
import FiberNewOutlinedIcon from "@mui/icons-material/FiberNewOutlined";
import AssignmentOutlinedIcon from "@mui/icons-material/AssignmentOutlined";
import DeleteIcon from "@mui/icons-material/Delete";
import DeleteForeverIcon from "@mui/icons-material/DeleteForever";
import InfoIcon from "@mui/icons-material/Info";

import Popup from "../../components/Forms/Popup";
import ScheduleForm from "../../components/Forms/ScheduleForm/ScheduleForm";
import SchedulesScrollableList from "../../components/SchedulesScrollableList";

import ScheduleInfo from "../../components/ScheduleInfo";
import CreateIcon from "@mui/icons-material/Create";
import EditAssignedClassForm from "../../components/Forms/EditAssignedClassForm/EditAssignedClassForm";

export default function AssistantPage(props) {
  document.title = "Assistant - ADTAA";
  const [loading, setLoading] = React.useState(true); // For <Loader />

  const [credentials, setCredentials] = React.useState(null);

  React.useEffect(() => {
    setTimeout(() => setLoading(false), 1500);

    axios
      .get("/credentials", {
        headers: { Authorization: "Bearer " + props.token },
      })
      .then((response) => {
        // console.log(response);
        const data = response.data;
        data.access_token && props.setToken(data.access_token);
        setCredentials({
          user_email: data.email,
          user_access_level: data.accessLevel,
        });
      })
      .catch((error) => {
        if (error.response) {
          console.log(error.response);
          console.log(error.response.status);
          console.log(error.response.headers);
          setCredentials(null);
          props.removeToken(); // logout upon failure to verify credentials. Token expired.
        }
      });
  }, []);

  const [tableData, setTableData] = React.useState(null);
  
  const [currentSchedule, setCurrentSchedule] = React.useState(null);

  // console.log(tableData);
  console.log(currentSchedule);
  

  const editAssignedClass = (assignedClassID, formData, resetForm) => {
    axios
      .post("/edit-assigned-class", {
        formData: formData,
        assignedClassID: assignedClassID,
      })
      .then((response) => {
        // console.log(response);

        let retrievedTableData = response.data.TableData;
        // update current schedule
        let currentScheduleIndex = retrievedTableData.findIndex(
          (schedule) => schedule.id === currentSchedule.id
        );
        setCurrentSchedule(retrievedTableData[currentScheduleIndex]);

        // update table data (assignedClasses)
        setTableData(retrievedTableData[currentScheduleIndex].assignedClasses);
      })
      .catch((error) => console.log(error));

    setOpenPopupEditClass(false);
    resetForm();
    setAssignedClassToEdit(null);
  };
  const deleteAssignedClass = (assignedClassID) => {
    // console.log(`${assignedClassID}`);
    axios
      .post(
        "/delete-assigned-class",
        { assignedClassID: assignedClassID },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        console.log(response);
        let retrievedTableData = response.data.TableData;

        // update current schedule
        let currentScheduleIndex = retrievedTableData.findIndex(
          (schedule) => schedule.id === currentSchedule.id
        );
        setCurrentSchedule(retrievedTableData[currentScheduleIndex]);

        // update table data (assignedClasses)
        setTableData(retrievedTableData[currentScheduleIndex].assignedClasses);
      })
      .catch((error) => console.log(error));
  };
  const deleteSchedule = () => {
    axios
      .post(
        "/delete-schedule",
        { currentScheduleID: currentSchedule.id },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((response) => {
        // console.log(response);

        let retrievedTableData = response.data.TableData;
        if (retrievedTableData.length > 0) {
          // If not empty, get last/most recent schedule in returned list from backend.
          setCurrentSchedule(retrievedTableData[retrievedTableData.length - 1]);
          setTableData(
            retrievedTableData[retrievedTableData.length - 1].assignedClasses
          );
          // setSchedulesList(retrievedTableData); // for clipboard button (displaying all schedule names)
        } else {
          setCurrentSchedule(null);
          setTableData(retrievedTableData);
        }
      })
      .catch((error) => console.log(error));
  };

  const generateSchedule = (formData) => {
    // console.log("Clicked! Generating schedule...");
    axios
      .post("/generate-schedule", formData, {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        let retrievedTableData = response.data.TableData;
        if (retrievedTableData.length > 0) {
          // If not empty, get last/MOST RECENT schedule in returned list from backend.
          setCurrentSchedule(retrievedTableData[retrievedTableData.length - 1]);
          setTableData(
            retrievedTableData[retrievedTableData.length - 1].assignedClasses
          ); // retrievedTableData[0].assignedClasses
        } else setTableData(retrievedTableData);
        // console.log(response);
      })
      .catch((error) => console.log(error));
  };

  // getSchedules() used for initial render
  const getSchedules = () => {
    // console.log("Getting schedules");
    axios
      .get("/get-schedules")
      .then((response) => {
        // console.log(response);
        let retrievedTableData = response.data.TableData;
        if (retrievedTableData.length > 0) {
          setCurrentSchedule(retrievedTableData[retrievedTableData.length - 1]);
          setTableData(
            retrievedTableData[retrievedTableData.length - 1].assignedClasses
          ); // retrievedTableData[0].assignedClasses
        } else {
          setTableData(retrievedTableData);
          setCurrentSchedule(null);
        }
      })
      .catch((error) => console.log(error));
  };

  React.useEffect(() => {
    getSchedules();
  }, []);

  const headerCells = [
    {
      id: "assigned_section.course_info.number", // id has no functionality.
      label: "Course name",
      disableSorting: true,
    },
    {
      id: "assigned_section.sectionNumber",
      label: "Section #",
      disableSorting: true,
    },
    {
      id: "assigned_instructor.lastName",
      label: "Instructor name",
      disableSorting: true,
    },
    {
      id: "commonDisciplineAreas",
      label: "Common discipline areas",
      disableSorting: true,
    },
    { id: "actions", label: "", disableSorting: true },
  ];
  const [filterFn, setFilterFn] = React.useState({
    fn: (items) => {
      return items;
    },
  });
  const {
    TableContainer,
    TableHeader,
    TablePagination,
    tableDataAfterPagingAndSorting,
  } = useTable(tableData, headerCells, filterFn);

  function handleSearch(event) {
    let target = event.target;
    setFilterFn({
      fn: (items) => {
        if (target.value === "") {
          return items;
        } else {
          return items.filter(
            (item) =>
              item.assigned_instructor.lastName
                .toString()
                .toLowerCase()
                .includes(target.value.toLowerCase()) ||
              item.assigned_section.course_info.number
                .toString()
                .includes(target.value)
          );
        }
      },
    });
    // console.log(target.value)
  }

  const useStyles = makeStyles({
    pageContent: {
      margin: "40px",
      padding: "24px",
      width: "75vw", // Table is at 100%. 100% of Paper (77vw)
    },
    searchInput: {
      width: "65%",
      "& label.Mui-focused": {
        color: "#732d40",
      },
      "& .MuiOutlinedInput-root": {
        "&.Mui-focused fieldset": {
          borderColor: "#732d40",
        },
      },
    },
  });
  const classes = useStyles();

  const add = (formData, resetForm) => {
    generateSchedule(formData);

    setOpenPopupNew(false);
    resetForm();
  };

  const [openPopupNew, setOpenPopupNew] = React.useState(false);
  const [openPopupInfo, setOpenPopupInfo] = React.useState(false);
  const [openPopupSchedules, setOpenPopupSchedules] = React.useState(false);

  const [openPopupEditClass, setOpenPopupEditClass] = React.useState(false);
  const [assignedClassToEdit, setAssignedClassToEdit] = React.useState(null);

  function openInEditPopUp(assignedClassToEdit) {
    setOpenPopupEditClass(true);
    setAssignedClassToEdit(assignedClassToEdit);
  }

  // REMINDER: last return is equivalent to "else return"
  if (loading === true) return <Loader message={""} />;
  else if (credentials === undefined || credentials === null) {
    return (
      <Loader
        message={"Authenticating... Please refresh if page does not load"}
      />
    );
  }

  const HeaderStyle = {
    fontWeight: "bold",
    borderBottom: "none",
    // fontFamily: "Open Sans",
    color: "#8898AA",
  };
  return (
    <div className="background-assistant">
      <div className="banner-assistant">
        <img
          src={assistantBackground}
          alt="assistant logo"
          className="assistant-background"
        />
      </div>

      <Sidebar
        page="assistant"
        accessLevel={credentials.user_access_level}
        email={credentials.user_email}
        logout={props.removeToken}
      />

      <div className="table-container-assistant">
        <Paper className={classes.pageContent}>
          <Toolbar>
            <Controls.Input
              label="Search by last name or course #"
              className={classes.searchInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment>
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              handleChange={handleSearch}
            />

            <Controls.ActionButton
              color="quarternary"
              handleClick={() => {
                setOpenPopupInfo(true);
              }}
              style={{ position: "absolute", right: "70px" }}
              disabled={tableData.length <= 0}
              tooltipTitle="Show schedule information"
              tooltipPlacement="top"
              isTooltipArrow={true}
            >
              <InfoIcon />
            </Controls.ActionButton>

            <Controls.ActionButton
              color="primary"
              style={{
                padding: "0.1rem 0",
                width: "10rem",
                position: "absolute",
                right: "120px",
              }}
              handleClick={() => {
                setOpenPopupNew(true);
              }}
              tooltipTitle="Generate new schedule"
            >
              <FiberNewOutlinedIcon fontSize="large" />
            </Controls.ActionButton>

            <Controls.ActionButton
              color="primary"
              style={{
                position: "absolute",
                right: "20px",
              }}
              tooltipTitle="Show schedule list"
              handleClick={() => {
                setOpenPopupSchedules(true);
              }}
            >
              <AssignmentOutlinedIcon />
            </Controls.ActionButton>
          </Toolbar>
          <TableContainer>
            <TableHead>
              <TableCell style={HeaderStyle}>Course name</TableCell>
              <TableCell style={HeaderStyle}>Section #</TableCell>
              <TableCell style={HeaderStyle}>Instructor name</TableCell>
              <TableCell style={HeaderStyle}>Common discipline areas</TableCell>
              {credentials.user_access_level !== "ASSISTANT" ? (
                <TableCell style={HeaderStyle}></TableCell>
              ) : (
                ""
              )}
            </TableHead>
            <TableBody>
              {(tableData.length <= 0 && currentSchedule !== null)  && (
                <TableRow>
                  <Typography variant="h6" style={{ padding: "1rem" }}>
                    Empty schedule!
                  </Typography>
                </TableRow>
              )}
              {tableData.length > 0 &&
                tableDataAfterPagingAndSorting().map((elem) => {
                  // console.log(elem);
                  return (
                    <TableRow key={elem.id}>
                      <TableCell style={{ fontWeight: "bold", width: "0px" }}>
                        <Tooltip
                          title={`Course #${elem.assigned_section.course_info.number}`}
                          placement="left"
                          arrow
                        >
                          <span>{elem.assigned_section.course_info.name}</span>
                        </Tooltip>
                      </TableCell>

                      <TableCell style={{ width: "0px" }}>
                        {elem.assigned_section.sectionNumber}
                      </TableCell>
                      <TableCell style={{ width: "0px" }}>
                        {`${elem.assigned_instructor.lastName}, ${elem.assigned_instructor.firstName}`}
                      </TableCell>
                      <TableCell style={{ height: "40px", width: "260px" }}>
                        <div
                          style={{
                            display: "flex",
                            gap: "5px",
                            flexWrap: "wrap",
                          }}
                        >
                          {elem.assigned_instructor.disciplineAreas
                            .filter((item) =>
                              elem.assigned_section.course_info.disciplineAreas.some(
                                ({ name }) => item.name === name
                              )
                            )
                            .map((listItem) => (
                              <Chip label={listItem.name}></Chip>
                            ))}
                        </div>
                      </TableCell>
                      {credentials.user_access_level !== "ASSISTANT" ? (
                        <TableCell align="right" style={{ width: "0px" }}>
                          <IconButton
                            onClick={() => {
                              openInEditPopUp(elem);
                            }}
                          >
                            <CreateIcon fontSize="small" />
                          </IconButton>
                          <IconButton
                            onClick={(event) => {
                              deleteAssignedClass(elem.id);
                            }}
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </TableCell>
                      ) : (
                        ""
                      )}
                    </TableRow>
                  );
                })}
            </TableBody>

            <TableFooter>
              <TableRow>
                <TableCell colspan={3} style={{ borderBottom: "0" }}>
                  <Tooltip title="Delete schedule" arrow>
                    <IconButton
                      style={{
                        color: "#732d40",
                      }}
                      className="delete-schedule-btn"
                      onClick={deleteSchedule}
                      disabled={currentSchedule === null ? true : false}
                    >
                      <DeleteForeverIcon fontSize="large" />
                    </IconButton>
                  </Tooltip>
                </TableCell>
                <TableCell colspan={2} style={{ borderBottom: "0" }}>
                  <TablePagination />
                </TableCell>
              </TableRow>
            </TableFooter>
          </TableContainer>
        </Paper>
        {/* GENERATE NEW POPUP */}
        <Popup
          title="Generate schedule"
          openPopup={openPopupNew}
          setOpenPopup={setOpenPopupNew}
        >
          <ScheduleForm token={props.token} add={add} />
        </Popup>
        {/* INFO POPUP */}
        <Popup
          title="Schedule info"
          openPopup={openPopupInfo}
          setOpenPopup={setOpenPopupInfo}
        >
          <ScheduleInfo currentSchedule={currentSchedule} />
        </Popup>
        {/* SCHEDULES LIST POPUP */}
        <Popup
          title="Existing schedules"
          openPopup={openPopupSchedules}
          setOpenPopup={setOpenPopupSchedules}
        >
          <SchedulesScrollableList
            setTableData={setTableData}
            setCurrentSchedule={setCurrentSchedule}
            setOpenPopup={setOpenPopupSchedules}
          />
        </Popup>
        {/* EDIT ASSIGNEDCLASS POPUP */}
        <Popup
          title="Edit assigned class"
          openPopup={openPopupEditClass}
          setOpenPopup={setOpenPopupEditClass}
        >
          <EditAssignedClassForm
            assignedClassToEdit={assignedClassToEdit}
            token={props.token}
            editAssignedClass={editAssignedClass}
          />
        </Popup>
      </div>
    </div>
  );
}
