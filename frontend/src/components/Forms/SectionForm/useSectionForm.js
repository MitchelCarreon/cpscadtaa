import React, { useState } from "react";
import { makeStyles } from "@mui/styles";
import { addMinutes } from "date-fns";

// validateOnChange --> real-time validation on form.
export function useSectionForm(
  initialValues,
  validateOnChange = false,
  validate
) {
  const [formData, setFormData] = useState(initialValues);
  console.log(formData);
  const [errors, setErrors] = useState({});

  function handleInputChange(event) {
    const { name, value, label } = event.target;

    // Automatically assign endTime based on name and formData.numMeetingPeriods
    // Why? No time validation/error. Alternatively, force endTime to conform to required totalTime based on numMeetingDays.
    // let minutesToAdd = formData.numMeetingPeriods == 2 ? 75 : 50; // original. 2v3 meeting periods.
    let minutesToAdd =
      formData.numMeetingPeriods == 2
        ? 75
        : formData.numMeetingPeriods == 1
        ? 150
        : 50;
    console.log(minutesToAdd);
    if (name === "meetingPeriod1Start") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        meetingPeriod1End: addMinutes(value, minutesToAdd),
      }));
    } else if (name === "meetingPeriod2Start") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        meetingPeriod2End: addMinutes(value, minutesToAdd),
      }));
    } else if (name === "meetingPeriod3Start") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        meetingPeriod3End: addMinutes(value, minutesToAdd),
      }));
    } else if (name === "numMeetingPeriods") {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
        meetingPeriod1End: addMinutes(
          formData.meetingPeriod1Start,
          value == 2 ? 75 : value == 1 ? 150 : 50 // if 2 meeting periods, add 75. else if 1 meeting period, add 150. else add 50
        ),
        meetingPeriod2End: addMinutes(
          formData.meetingPeriod2Start,
          value == 2 ? 75 : value == 1 ? 150 : 50
        ),
        meetingPeriod3End: addMinutes(
          formData.meetingPeriod3Start,
          value == 2 ? 75 : value == 1 ? 150 : 50
          // value == 2 ? 75 : 50 // original. 2 v 3  meeting periods.
        ),
      }));
    } else {
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value,
      }));
    }

    // Solution for: No automatic endTime assignment based on startTime.
    // Solution for: No automatic endTime assignment based on numMeetingPeriods

    // setFormData((prevFormData) => ({
    //   ...prevFormData,
    //   [name]: value,
    // }));

    if (validateOnChange) {
      validate({ [name]: value });
    }
  }

  function handleInputChangeGeneric(event) {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));

    if (validateOnChange) {
      validate({ [name]: value });
    }
  }

  const resetForm = () => {
    setFormData(initialValues);
    setErrors({});
  };

  return {
    formData,
    setFormData,
    errors,
    setErrors,
    resetForm,
    handleInputChange,
    handleInputChangeGeneric,
  };
}

export function Form(props) {
  const useStyles = makeStyles({
    root: {
      "& .MuiFormControl-root": {
        width: "100%",
      },
    },
  });

  const classes = useStyles();
  const { children, ...others } = props;
  return (
    <form className={classes.root} autoComplete="off" {...others}>
      {children}
    </form>
  );
}
