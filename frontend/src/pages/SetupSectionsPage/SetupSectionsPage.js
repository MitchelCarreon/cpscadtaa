import React from "react";
import "./SetupSectionsPage.css";
import Sidebar from "../../components/Sidebar";

import gearBackground from "../../assets/svg/background_gear.svg";

import axios from "axios";

import Loader from "../../components/LoadingScreen/Loader";
import { Navigate } from "react-router-dom";

import SectionSetupTable from "../../components/Tables/SectionSetupTable";
import SectionsForm from "../../components/Forms/SectionForm/SectionsForm";

import useTable from "../../components/Tables/useTable";
import {
  TableBody,
  TableCell,
  TableRow,
  Paper,
  Toolbar,
  InputAdornment,
  Tooltip,
} from "@mui/material";
import Controls from "../../components/Forms/SectionForm/controls/Controls";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import { makeStyles } from "@mui/styles";
import Popup from "../../components/Forms/Popup";
import { format } from "date-fns";
import SettingsIcon from "@mui/icons-material/Settings";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import Notification from "../../components/Forms/SectionForm/controls/Notification";
import { utcToZonedTime } from "date-fns-tz";

export default function SetupSectionsPage(props) {
  document.title = "Setup sections - ADTAA";
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
          // localStorage.removeItem("token");
          props.removeToken();
        }
      });
  }, []);

  const headerCells = [
    { id: "courseNumber", label: "Course #" },
    { id: "sectionNumber", label: "Section #" },
    { id: "numMeetingPeriods", label: "# of meeting periods" },
    {
      id: "meetingPeriod1Day",
      label: "Day 1",
      disableSorting: true,
    },
    {
      id: "meetingPeriod1Start",
      label: "Start 1",
      disableSorting: true,
    },
    {
      id: "meetingPeriod1End",
      label: "End 1",
      disableSorting: true,
    },
    {
      id: "meetingPeriod2Day",
      label: "Day 2",
      disableSorting: true,
    },
    {
      id: "meetingPeriod2Start",
      label: "Start 2",
      disableSorting: true,
    },
    {
      id: "meetingPeriod2End",
      label: "End 2",
      disableSorting: true,
    },
    {
      id: "meetingPeriod3Day",
      label: "Day 3",
      disableSorting: true,
    },
    {
      id: "meetingPeriod3Start",
      label: "Start 3",
      disableSorting: true,
    },
    {
      id: "meetingPeriod3End",
      label: "End 3",
      disableSorting: true,
    },
    { id: "actions", label: "", disableSorting: true },
  ];

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
    // newButton: {
    //   position: "absolute !important",
    //   right: "10px",
    // },
    // startIcon: {
    //   margin: "0px",
    // },
  });
  const classes = useStyles();

  const [filterFn, setFilterFn] = React.useState({
    fn: (items) => {
      return items;
    },
  });
  const [openPopup, setOpenPopup] = React.useState(false);
  const [tableData, setTableData] = React.useState(); // records
  console.log(tableData);
  const [sectionToEdit, setSectionToEdit] = React.useState(null);
  const [notify, setNotify] = React.useState({
    isOpen: false,
    message: "",
    type: "",
  });
  // console.log(tableData);

  React.useEffect(() => {
    axios
      .get("/get-sections", {
        headers: { Authorization: "Bearer " + props.token },
      })
      .then((response) => {
        console.log(response);
        response.data.access_token &&
          props.setToken(response.data.access_token);

        let retrievedTableData = response.data.TableData;
        setTableData(retrievedTableData);
      })
      .catch((error) => console.log(error));
  }, []);

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
        } else
          return items.filter((item) =>
            item.courseNumber.toString().includes(target.value)
          );
      },
    });
    // console.log(target.value)
  }

  let navigate = useNavigate();
  function goToSetupPage() {
    let path = "/setup";
    navigate(path);
  }

  // used by SectionsForm.
  const addOrEdit = (formData, resetForm) => {
    // if new
    if (formData.id === -1) {
      axios
        .post("/add-section", formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + props.token,
          },
        })
        .then((response) => {
          console.log(response);
          response.data.access_token &&
            props.setToken(response.data.access_token);

          // update frontend records/tableData
          setTableData(response.data.TableData);
          setNotify({
            isOpen: true,
            message: "Section added!",
            type: "success",
          });
        })
        .catch((error) => {
          setNotify({
            isOpen: true,
            message: "Unable to add section. Section # must be unique.",
            type: "error",
          });
          console.log(error);
        });
    } else {
      // elif id !== -1 ---> editing section
      axios
        .post("/update-section", formData, {
          headers: {
            "Content-Type": "application/json",
            Authorization: "Bearer " + props.token,
          },
        })
        .then((response) => {
          // console.log(response);
          response.data.access_token &&
            props.setToken(response.data.access_token);

          // update frontend records/tableData
          setTableData(response.data.TableData);
          setNotify({
            isOpen: true,
            message: "Section modified!",
            type: "success",
          });
        })
        .catch((error) => {
          setNotify({
            isOpen: true,
            message: "Unable to modify section.",
            type: "error",
          });
          console.log(error);
        });
    }

    // Issue: Resetting the form is shown during closing form.
    // SOLUTION: Promise.resolve().then()
    // CON: Might affect performance.
    setOpenPopup(false);
    resetForm();
    setSectionToEdit(null);
  };

  function openInPopUp(sectionToEdit) {
    setSectionToEdit(sectionToEdit);
    setOpenPopup(true);
  }

  function deleteSection(section) {
    axios
      .post("/delete-section", section, {
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + props.token,
        },
      })
      .then((response) => {
        response.data.access_token &&
          props.setToken(response.data.access_token);

        // update frontend records/tableData
        setTableData(response.data.TableData);
        setNotify({
          isOpen: true,
          message: "Section deleted!",
          type: "success",
        });
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Unable to delete section!",
          type: "error",
        });
        console.log(error);
      });
  }

  if (loading === true) return <Loader message={""} />;
  else if (credentials === undefined || credentials === null) {
    return (
      <Loader
        message={"Authenticating... Please refresh if page does not load"}
      />
    );
  } else if (
    credentials.user_access_level !== "ROOT" &&
    credentials.user_access_level !== "ADMIN"
  ) {
    // handles going to page via URL and unauthorized access.
    return <Navigate replace to="/dashboard" />;
  }
  return (
    <div className="background-setup-sections">
      <div className="banner-setup-sections">
        <img src={gearBackground} alt="gear logo" className="gear-background" />
      </div>

      <Sidebar
        page="setup-sections"
        accessLevel={credentials.user_access_level}
        email={credentials.user_email}
        logout={props.removeToken}
      />

      <div className="table-container-setup-sections">
        {/* <SectionSetupTable token={props.token} setToken={props.setToken} /> */}

        <Paper className={classes.pageContent}>
          <Toolbar>
            <Controls.Input
              label="Search by course #"
              className={classes.searchInput}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
              handleChange={handleSearch}
            />
            {/* <Controls.Button
              variant="contained"
              text="Add section"
              // classes={{startIcon: classes.startIcon}}
              style={{ position: "absolute", right: "30px" }}
              startIcon={<AddIcon />}
              color="primary"
              handleClick={() => {
                setOpenPopup(true);
                setSectionToEdit(null);
              }}
            /> */}
            <Controls.ActionButton
              color="primary"
              handleClick={() => {
                setOpenPopup(true);
                setSectionToEdit(null);
              }}
              style={{
                padding: "0.65rem 2rem",
                position: "absolute",
                right: "20px",
              }}
            >
              <AddIcon fontSize="medium" />
            </Controls.ActionButton>
          </Toolbar>
          <TableContainer>
            <TableHeader />
            <TableBody>
              {tableDataAfterPagingAndSorting().map((elem) => (
                <TableRow key={elem.id}>
                  <TableCell style={{ width: "0px", fontWeight: "bold" }}>
                    <Tooltip title={elem.courseName} placement="left" arrow>
                      <span>{elem.courseNumber}</span>
                    </Tooltip>
                  </TableCell>

                  <TableCell style={{ width: "0px" }}>
                    {elem.sectionNumber}
                  </TableCell>
                  <TableCell style={{ width: "0px" }}>
                    {elem.meetingPeriods.length}
                  </TableCell>
                  {elem.meetingPeriods.map((meetingPeriod) => {
                    console.log(meetingPeriod.startTime)
                    return (
                      <>
                        <TableCell>{meetingPeriod.meetDay}</TableCell>
                        <TableCell>
                          {format(
                            utcToZonedTime(
                              `${meetingPeriod.startTime}Z`,
                              "America/Chicago"
                            ),
                            "HH:mm",
                            {
                              timeZone: "America/Chicago",
                            }
                          )}
                        </TableCell>
                        <TableCell>
                          {format(
                            utcToZonedTime(
                              `${meetingPeriod.endTime}Z`,
                              "America/Chicago"
                            ),
                            "HH:mm",
                            {
                              timeZone: "America/Chicago",
                            }
                          )}
                        </TableCell>
                      </>
                    );
                  })}

                  {elem.meetingPeriods.length === 1 && (
                    <>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </>
                  )}
                  {elem.meetingPeriods.length === 2 && (
                    <>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                      <TableCell></TableCell>
                    </>
                  )}
                  <TableCell align="center" style={{ width: "125px" }}>
                    <Controls.ActionButton
                      color="primary"
                      handleClick={() => {
                        openInPopUp(elem);
                      }}
                      style={{ margin: "0.15rem" }}
                      tooltipTitle="Edit"
                      tooltipPlacement="left"
                      isTooltipArrow={true}
                    >
                      <EditIcon fontSize="small" />
                    </Controls.ActionButton>

                    <Controls.ActionButton
                      color="secondary"
                      style={{ margin: "0.15rem" }}
                      handleClick={() => {
                        deleteSection(elem);
                      }}
                      tooltipTitle="Delete"
                      tooltipPlacement="right"
                      isTooltipArrow={true}
                    >
                      <DeleteIcon fontSize="small" />
                    </Controls.ActionButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </TableContainer>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: "10px",
            }}
          >
            <Tooltip title="Assign courses and instructors" arrow>
              <IconButton onClick={goToSetupPage} style={{ color: "#732d40" }}>
                <ArrowBackIcon />
              </IconButton>
            </Tooltip>
            <TablePagination />
          </div>
        </Paper>
        <Popup
          title={sectionToEdit === null ? "Add section" : "Edit section"}
          openPopup={openPopup}
          setOpenPopup={setOpenPopup}
        >
          <SectionsForm
            token={props.token}
            setToken={props.setToken}
            addOrEdit={addOrEdit}
            sectionToEdit={sectionToEdit}
          />
        </Popup>
        <Notification notify={notify} setNotify={setNotify} />
      </div>
    </div>
  );
}
