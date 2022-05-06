import React from "react";
import { Grid, Typography } from "@mui/material";
import axios from "axios";

export default function ScheduleInfo(props) {
  const { currentSchedule } = props;
  // console.log(currentSchedule);

  const [totalUniqueInstructors, setTotalUniqueInstructors] = React.useState(
    new Set()
  );
  let totalInstructors = new Set();
  for (let i = 0; i < currentSchedule.assignedClasses.length; ++i) {
    totalUniqueInstructors.add(
      currentSchedule.assignedClasses[i].assigned_instructor.id
    );
  }

  const [stats, setStats] = React.useState(null);

  const getStats = () => {
    axios
      .get("/get-stats")
      .then((response) => {
        // console.log(response);
        setStats(response.data.stats);
      })
      .catch((error) => console.log(error));
  };

  React.useEffect(() => {
    setTotalUniqueInstructors(totalInstructors);
    getStats()
  }, []);

  return (
    <>
      {stats ? (
        <Grid container spacing={2} width="500px" padding="1rem">
          <Grid item xs={4}>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold" }}
              display="flex"
              justifyContent="flex-start"
            >
              Schedule name:
            </Typography>
          </Grid>
          <Grid item xs={8}>
            <Typography
              variant="body1"
              display="flex"
              justifyContent="flex-end"
            >
              {currentSchedule.schedule_name}
            </Typography>
          </Grid>

          <Grid item xs={8}>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold" }}
              display="flex"
              justifyContent="flex-start"
            >
              Total assigned sections:
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="body1"
              display="flex"
              justifyContent="flex-end"
              color={
                currentSchedule.assignedClasses.length ===
                stats.totalNumSections
                  ? "green"
                  : "red"
              }
            >
              {`${currentSchedule.assignedClasses.length} / ${stats.totalNumSections}`}
            </Typography>
          </Grid>

          <Grid item xs={8}>
            <Typography
              variant="body1"
              sx={{ fontWeight: "bold" }}
              display="flex"
              justifyContent="flex-start"
            >
              Total Assigned instructors:
            </Typography>
          </Grid>
          <Grid item xs={4}>
            <Typography
              variant="body1"
              display="flex"
              justifyContent="flex-end"
              color={
                totalUniqueInstructors.size === stats.totalNumInstructors
                  ? "green"
                  : "red"
              }
            >
              {`${totalUniqueInstructors.size} / ${stats.totalNumInstructors}`}
            </Typography>
          </Grid>
        </Grid>
      ) : (
        <Grid container spacing={2} width="500px" padding="1rem"></Grid>
      )}
    </>
  );
}
