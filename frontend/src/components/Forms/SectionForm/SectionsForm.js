import { Grid } from "@mui/material";
import React from "react";
import Controls from "./controls/Controls";

import { useSectionForm, Form } from "./useSectionForm";
import { Box } from "@mui/system";

import axios from "axios";
import { add, addMinutes, differenceInMinutes, sub } from "date-fns";

// Explanation on SectionForm validation:
// Restrictions/Constraints:
// Course# --> MUST NOT be empty
// Section# --> MUST NOT be empty. MUST BE unique based on course# (e.g., There can't be two section #1 in Course# 235)
// # of meeting days --> WILL NEVER be empty.
// PeriodDay --> MUST NOT be empty. MUST NOT match another PeriodDay.
// PeriodStart --> WILL NEVER be empty. MUST conform to numMeetingDays (if numMeetingDays == 2, then PeriodStart = PeriodEnd - 75. Else PeriodStart = PeriodEnd - 50)
// PeriodEnd --> Read-only. WILL NEVER be empty. MUST conform to numMeetingDays (if numMeetingDays ==2, then PeriodEnd = PeriodStart + 75. Else PeriodEnd = PeriodStart + 50)

// Handled by Frontend validation:
// Course# --> CHECKS if not empty
// PeriodDay --> CHECKS if not empty AND does not match other PeriodDays

// Handled by backend:
// Section# --> Unique constraint.

// NOOOO PeriodStart or PeriodEnd validation?
// None. TimePicker has minTime and maxTime to set error. That was inconvenient.
// ALTERNATIVE: Made PeriodEnd-Field to be read-only. Upon changing PeriodStart, PeriodEnd changes based on numMeetingPeriods (latest value)
// Changing numMeetingPeriods (using the radio button), also changes all PeriodEnds (+75min or +50min)
// CONSEQUENCE: useSectionForm.handleInputChange is no longer reusable. SOLUTION: make another handleInputChange2 in useSectionForm to reuse.

const radioGroupItems = [
  { id: 1, title: "1" }, // NEW_ADD_ONE
  { id: 2, title: "2" }, // id is value, title is label of radio button
  { id: 3, title: "3" },
];

const validClassDays = [
  { name: "Monday", key: "M" }, // value is name.
  { name: "Tuesday", key: "T" },
  { name: "Wednesday", key: "W" },
  { name: "Thursday", key: "Th" },
  { name: "Friday", key: "F" },
];

const initialValues = {
  id: -1,
  courseNumber: "",
  sectionNumber: "",
  numMeetingPeriods: 2,

  meetingPeriod1Day: "",
  meetingPeriod1Start: new Date(),
  meetingPeriod1End: add(new Date(), { minutes: 75 }),

  meetingPeriod2Day: "",
  meetingPeriod2Start: new Date(),
  meetingPeriod2End: add(new Date(), { minutes: 75 }),

  meetingPeriod3Day: "",
  meetingPeriod3Start: new Date(),
  meetingPeriod3End: add(new Date(), { minutes: 50 }),
};
export default function SectionsForm(props) {
  function getAvailableCourses() {
    axios
      .get("/get-course-list", {
        headers: { Authorization: "Bearer " + props.token },
      })
      .then((response) => {
        let retrievedCourseList = response.data.TableData;

        if (retrievedCourseList) {
          setCourseList(retrievedCourseList);
        }
      })
      .catch((error) => console.log(error));
  }
  React.useEffect(() => getAvailableCourses(), []);

  const [courseList, setCourseList] = React.useState([]);

  const validate = (formDataFields = formData) => {
    let temp = { ...errors };
    console.log(formDataFields);

    if ("sectionNumber" in formDataFields) {
      temp.sectionNumber = formDataFields.sectionNumber ? "" : "*Required"; // empty string is falsy. thus, error={key.value}
    }
    if ("courseNumber" in formDataFields) {
      temp.courseNumber = formDataFields.courseNumber ? "" : "*Required";
    }

    if ("meetingPeriod1Day" in formDataFields) {
      temp.meetingPeriod1Day =
        formDataFields.meetingPeriod1Day &&
        formDataFields.meetingPeriod1Day !== formData.meetingPeriod2Day &&
        formDataFields.meetingPeriod1Day !== formData.meetingPeriod3Day
          ? ""
          : "*Required. Days must be unique.";
    }
    if (formData.numMeetingPeriods == 2) {
      // NEW_ADD_ONE
      if ("meetingPeriod2Day" in formDataFields) {
        temp.meetingPeriod2Day =
          formDataFields.meetingPeriod2Day &&
          formDataFields.meetingPeriod2Day !== formData.meetingPeriod1Day &&
          formDataFields.meetingPeriod2Day !== formData.meetingPeriod3Day
            ? ""
            : "*Required. Days must be unique.";
      }
    }

    if (formData.numMeetingPeriods == 3) {
      if ("meetingPeriod2Day" in formDataFields) {
        temp.meetingPeriod2Day =
          formDataFields.meetingPeriod2Day &&
          formDataFields.meetingPeriod2Day !== formData.meetingPeriod1Day &&
          formDataFields.meetingPeriod2Day !== formData.meetingPeriod3Day
            ? ""
            : "*Required. Days must be unique.";
      }
      if ("meetingPeriod3Day" in formDataFields) {
        temp.meetingPeriod3Day =
          formDataFields.meetingPeriod3Day &&
          formDataFields.meetingPeriod3Day !== formData.meetingPeriod1Day &&
          formDataFields.meetingPeriod3Day !== formData.meetingPeriod2Day
            ? ""
            : "*Required. Days must be unique.";
      }
    }

    setErrors({ ...temp });

    if (formDataFields === formData) {
      return Object.values(temp).every((elem) => elem === ""); // for validate() call. before Submitting the form
    }
  };

  const {
    formData,
    setFormData,
    errors,
    setErrors,
    resetForm,
    handleInputChange,
  } = useSectionForm(initialValues, true, validate);

  const { addOrEdit, sectionToEdit } = props;

  // FOR displaying input inside form after clicking edit-btn
  React.useEffect(() => {
    if (sectionToEdit !== null) {
      // console.log(sectionToEdit);

      setFormData({
        ...sectionToEdit,

        meetingPeriod1Day: sectionToEdit.meetingPeriods[0].meetDay,
        meetingPeriod1Start: new Date(
          sectionToEdit.meetingPeriods[0].startTime
        ),
        meetingPeriod1End: new Date(sectionToEdit.meetingPeriods[0].endTime),

        // Back when life was much fun and simpler... 2 v 3 meetingPeriods.
        // meetingPeriod2Day: sectionToEdit.meetingPeriods[1].meetDay,
        // meetingPeriod2Start: new Date(
        //   sectionToEdit.meetingPeriods[1].startTime
        // ),
        // meetingPeriod2End: new Date(sectionToEdit.meetingPeriods[1].endTime),

        meetingPeriod2Day:
          sectionToEdit.numMeetingPeriods <= 1
            ? ""
            : sectionToEdit.meetingPeriods[1].meetDay,
        meetingPeriod2Start:
          sectionToEdit.numMeetingPeriods <= 1
            ? new Date()
            : new Date(sectionToEdit.meetingPeriods[1].startTime),
        meetingPeriod2End:
          sectionToEdit.numMeetingPeriods <= 1
            ? new Date()
            : new Date(sectionToEdit.meetingPeriods[1].endTime),

        meetingPeriod3Day:
          sectionToEdit.numMeetingPeriods <= 2
            ? ""
            : sectionToEdit.meetingPeriods[2].meetDay,
        meetingPeriod3Start:
          sectionToEdit.numMeetingPeriods <= 2
            ? new Date() // new Date(). Otherwise, time picker throws a stupid error. also, route needs a date object to do convert_utc_to_cst
            : new Date(sectionToEdit.meetingPeriods[2].startTime), // time picker only allows Date() objects.
        meetingPeriod3End:
          sectionToEdit.numMeetingPeriods <= 2
            ? new Date()
            : new Date(sectionToEdit.meetingPeriods[2].endTime),
      });
    }
  }, [sectionToEdit]);

  const handleSubmit = (event) => {
    event.preventDefault(); // avoid refresh upon submit-btn-click

    if (validate()) {
      addOrEdit(formData, resetForm);
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      <Grid container spacing={4}>
        <Grid item xs={5}>
          <Controls.Select
            variant="filled"
            name="courseNumber"
            label="Course #"
            value={formData.courseNumber}
            handleChange={handleInputChange}
            options={courseList}
            error={errors.courseNumber}
          />
        </Grid>
        <Grid item xs={4}>
          <Controls.Input
            variant="filled"
            label="Section #"
            name="sectionNumber"
            value={formData.sectionNumber}
            handleChange={handleInputChange}
            type="number"
            error={errors.sectionNumber}
          />
        </Grid>

        <Grid item xs={3}>
          <Controls.RadioGroup
            name="numMeetingPeriods"
            label="# of meeting days:"
            value={formData.numMeetingPeriods}
            handleChange={handleInputChange}
            items={radioGroupItems}
          />
        </Grid>
        {formData.numMeetingPeriods >= "1" && (
          <>
            <Grid item xs={5}>
              <Controls.Select
                name="meetingPeriod1Day"
                variant="standard"
                label="Period 1 Day"
                value={formData.meetingPeriod1Day}
                handleChange={handleInputChange}
                options2={validClassDays}
                error={errors.meetingPeriod1Day}
              />
            </Grid>

            <Grid item xs={3.5}>
              <Controls.TimePicker
                name="meetingPeriod1Start"
                label="Period 1 Start time"
                value={formData.meetingPeriod1Start}
                handleChange={handleInputChange}
                minTime={new Date(0, 0, 0, 7, 0)}
                maxTime={new Date(0, 0, 0, 20, 0)}
              />
            </Grid>
            <Grid item xs={3.5}>
              <Controls.TimePicker
                name="meetingPeriod1End"
                label="Period 1 End time"
                value={formData.meetingPeriod1End}
                // handleChange={handleInputChange}
                readOnly
              />
            </Grid>
            {formData.numMeetingPeriods >= "2" && (
              <>
                <Grid item xs={5}>
                  <Controls.Select
                    name="meetingPeriod2Day"
                    variant="standard"
                    label="Period 2 Day"
                    value={formData.meetingPeriod2Day}
                    handleChange={handleInputChange}
                    options2={validClassDays}
                    error={errors.meetingPeriod2Day}
                  />
                </Grid>
                <Grid item xs={3.5}>
                  <Controls.TimePicker
                    name="meetingPeriod2Start"
                    label="Period 2 Start time"
                    value={formData.meetingPeriod2Start}
                    handleChange={handleInputChange}
                    minTime={new Date(0, 0, 0, 7, 0)}
                    maxTime={new Date(0, 0, 0, 20, 0)}
                  />
                </Grid>
                <Grid item xs={3.5}>
                  <Controls.TimePicker
                    name="meetingPeriod2End"
                    label="Period 2 End time"
                    value={formData.meetingPeriod2End}
                    // handleChange={handleInputChange}
                    readOnly
                  />
                </Grid>
                {formData.numMeetingPeriods >= "3" && (
                  <>
                    <Grid item xs={5}>
                      <Controls.Select
                        name="meetingPeriod3Day"
                        variant="standard"
                        label="Period 3 Day"
                        value={formData.meetingPeriod3Day}
                        handleChange={handleInputChange}
                        options2={validClassDays}
                        error={errors.meetingPeriod3Day}
                      />
                    </Grid>
                    <Grid item xs={3.5} align="center">
                      <Controls.TimePicker
                        name="meetingPeriod3Start"
                        label="Period 3 Start time"
                        value={formData.meetingPeriod3Start}
                        handleChange={handleInputChange}
                        minTime={new Date(0, 0, 0, 7, 0)}
                        maxTime={new Date(0, 0, 0, 20, 0)}
                      />
                    </Grid>
                    <Grid item xs={3.5} align="center">
                      <Controls.TimePicker
                        name="meetingPeriod3End"
                        label="Period 3 End time"
                        value={formData.meetingPeriod3End}
                        // handleChange={handleInputChange}
                        readOnly
                      />
                    </Grid>
                  </>
                )}
              </>
            )}
          </>
        )}

        <Grid item xs={12}>
          <Box display="flex" justifyContent="flex-end">
            <Controls.Button
              text="Submit"
              type="submit"
              color="primary"
              variant="contained"
            />
            <Controls.Button
              text="Reset"
              variant="text"
              disableRipple
              color="primary"
              sx={{ marginLeft: "10px" }}
              handleClick={resetForm}
            />
          </Box>
        </Grid>
      </Grid>
    </Form>
  );
}
