import React from "react";
import { Typography } from "@mui/material";

export default function InstructorInfo(props) {
  const { instructorsList, formData } = props;
  let pickedInstructorIndex = instructorsList.findIndex(
    (instructor) => instructor.id === formData.assignedInstructor
  );
  let currentInstructor = instructorsList[pickedInstructorIndex];
  // console.log(currentInstructor);
  return (
    <>
      {currentInstructor === undefined || currentInstructor === null ? (
        ""
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: "0.5rem" }}>
          <Typography style={{ fontWeight: "bold" }}>
            Instructor's expertise:
          </Typography>

          {currentInstructor.disciplineAreas.map((disciplineArea) => (
            <li style={{ margin: "5px 0" }}>
              <Typography>{`${disciplineArea.name}`}</Typography>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}
