import React from "react";
import { format } from "date-fns";
import { Typography } from "@mui/material";

export default function SectionInfo(props) {
  const { sectionsList, formData } = props;
  let pickedSectionIndex = sectionsList.findIndex(
    (section) => section.id === formData.assignedSection
  );
  let currentSection = sectionsList[pickedSectionIndex];
//   console.log(currentSection);
  return (
    <>
      {currentSection === undefined || currentSection === null ? (
        ""
      ) : (
        <ul style={{ listStyle: "none", paddingLeft: "2rem" }}>
          <Typography style={{ fontWeight: "bold" }}>
            Meeting periods:
          </Typography>
          {currentSection.meetingPeriods.map((meetingPeriod) => (
            <li style={{ margin: "5px 0" }}>
              <Typography>
                {`${meetingPeriod.meetDay}, ${format(
                  new Date(meetingPeriod.startTime),
                  "HH:mm"
                )} - ${format(new Date(meetingPeriod.endTime), "HH:mm")}`}
              </Typography>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

// meetingPeriod.endTime
