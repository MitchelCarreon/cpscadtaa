import React from "react";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListSubheader from "@mui/material/ListSubheader";
import ListItemButton from "@mui/material/ListItemButton";
import axios from "axios";
import useSchedulesList from "./useSchedulesScrollableList";

export default function SchedulesScrollableList(props) {
  const { schedulesList, setSchedulesList } = useSchedulesList();

  const { setTableData, setCurrentSchedule, setOpenPopup } = props;

  const getSchedules = () => {
    // console.log("Getting schedules");
    axios
      .get("/get-schedules")
      .then((response) => {
        console.log(response);
        setSchedulesList(response.data.TableData);
      })
      .catch((error) => console.log(error));
  };

  React.useEffect(() => {
    getSchedules();
  }, []);

  return (
    <List
      sx={{
        width: "100%",
        width: 400,
        bgcolor: "background.paper",
        position: "relative",
        overflowY: "scroll",
        overflowX: "auto",
        minHeight: 200,
        "& ul": { padding: 0 },
      }}
      subheader={<li />}
    >
      {/* useEffect comes after initial render. 
      conditional rendering solves this by rendering "" if schedulesList is empty */}
      {schedulesList
        ? schedulesList.map((schedule) => (
            <ListItem key={schedule.id} component="div" disablePadding>
              <ListItemButton
                onClick={() => {
                  let scheduleItem = schedulesList.find(
                    (item) =>
                      item.schedule_name === schedule.schedule_name &&
                      item.id === schedule.id
                  );
                  setTableData(scheduleItem.assignedClasses);
                  setCurrentSchedule(scheduleItem);
                  setOpenPopup(false)
                }}
              >
                <ListItemText primary={schedule.schedule_name} />
              </ListItemButton>
            </ListItem>
          ))
        : ""}
    </List>
  );
}


