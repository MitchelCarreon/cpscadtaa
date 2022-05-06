import React from "react";
import { Form, useSectionForm } from "../SectionForm/useSectionForm";
import { Grid } from "@mui/material";
import Controls from "../SectionForm/controls/Controls";
import { Box } from "@mui/system";

const initialValues = {
  scheduleName: "",
  algorithmName: "",
};

const sampleAlgos = [
  { name: "Sample algo 1", key: "1" },
  { name: "Sample algo 2", key: "2" },
  { name: "Sample algo 3", key: "3" },
];

/* Makes use of useSectionForm. But uses a different input change handler (handleInputChangeGeneric) */
export default function ScheduleForm(props) {
  // validation
  const validate = (formDataFields = formData) => {
    let temp = { ...errors };

    // only check for algo name. Schedule name is NOT required (default name = "Created on datetime.now()")
    if ("algorithmName" in formDataFields) {
      temp.algorithmName = formDataFields.algorithmName ? "" : "*Required";
    }

    setErrors({ ...temp });
    if (formDataFields === formData) {
      return Object.values(temp).every((elem) => elem === "");
    }
  };
  // formData
  const { formData, errors, setErrors, resetForm, handleInputChangeGeneric } =
    useSectionForm(initialValues, true, validate);

  const { add } = props;

  // submitting form
  const handleSubmit = (event) => {
    event.preventDefault();

    if (validate()) {
      add(formData, resetForm);
    }
  };
  return (
    <Form style={{ width: "300px" }} onSubmit={handleSubmit}>
      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Controls.Input
            variant="outlined"
            name="scheduleName"
            label="Schedule name"
            value={formData.scheduleName}
            handleChange={handleInputChangeGeneric}
            error={errors.scheduleName}
          />
        </Grid>
        <Grid item xs={12}>
          <Controls.Select
            variant="filled"
            name="algorithmName"
            label="Choose an algorithm"
            value={formData.algorithmName}
            handleChange={handleInputChangeGeneric}
            options3={sampleAlgos}
            error={errors.algorithmName}
          />
        </Grid>
        <Grid item xs={12}>
          <Box display="flex" justifyContent="center">
            <Controls.Button
              text="Submit"
              type="submit"
              color="primary"
              variant="contained"
            />
          </Box>
        </Grid>
      </Grid>
    </Form>
  );
}
