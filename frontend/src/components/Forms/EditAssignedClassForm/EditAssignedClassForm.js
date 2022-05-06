import { Grid, Paper } from "@mui/material";
import React from "react";
import Controls from "../SectionForm/controls/Controls";
import { useSectionForm, Form } from "../SectionForm/useSectionForm";
import axios from "axios";
import { Box } from "@mui/system";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowsLeftRight } from "@fortawesome/free-solid-svg-icons";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import { format } from "date-fns";
import SectionInfo from "../../SectionInfo";
import InstructorInfo from "../../InstructorInfo";

const initialValues = {
  assignedInstructor: "",
  assignedSection: "",
};

export default function EditAssignedClassForm(props) {
  const { assignedClassToEdit, editAssignedClass } = props;

  const validate = () => {}; // No validation
  const {
    formData,
    setFormData,
    errors,
    setErrors,
    resetForm,
    handleInputChangeGeneric,
  } = useSectionForm(initialValues, false, validate);

//   console.log(formData);

  const [sectionsList, setSectionsList] = React.useState([]);
  const [instructorsList, setInstructorsList] = React.useState([]);

  React.useEffect(() => {
    if (assignedClassToEdit !== null) {
      setFormData({
        assignedInstructor: assignedClassToEdit.assigned_instructor.id,
        assignedSection: assignedClassToEdit.assigned_section.id,
      });
    }
   
  }, [assignedClassToEdit]);

  const handleSubmit = (event) => {
    event.preventDefault()

    editAssignedClass(assignedClassToEdit.id, formData, resetForm)
  }

  function getAvailableSections() {
    axios
      .get("/get-sections", {
        headers: { Authorization: "Bearer " + props.token },
      })
      .then((response) => {
        //   console.log(response)
        let retrievedSectionsList = response.data.TableData;
        if (retrievedSectionsList) {
          setSectionsList(retrievedSectionsList);
        }
      })
      .catch((error) => console.log(error));
  }
  function getAvailableInstructors() {
    axios
      .get("/get-instructors-roster", {
        headers: { Authorization: "Bearer " + props.token },
      })
      .then((response) => {
        // console.log(response);
        let retrievedInstructorsList = response.data.TableData;

        if (retrievedInstructorsList) {
          setInstructorsList(retrievedInstructorsList);
        }
      })
      .catch((error) => console.log(error));
  }

  React.useEffect(() => {
    getAvailableSections();
    getAvailableInstructors();
  }, []);

  //   console.log(instructorsList);

  return (
    <>
      {instructorsList === [] || sectionsList === [] ? (
        ""
      ) : (
        <Form onSubmit={handleSubmit}>
          <Grid container spacing={4} width="720px">
            <Grid item xs={6}>
              <Controls.Select
                variant="filled"
                name="assignedSection"
                label="Section"
                value={formData.assignedSection}
                handleChange={handleInputChangeGeneric}
                options4={sectionsList}
              />
            </Grid>
            <Grid item xs={6}>
              <Controls.Select
                variant="outlined"
                name="assignedInstructor"
                label="Instructor"
                value={formData.assignedInstructor}
                handleChange={handleInputChangeGeneric}
                options5={instructorsList}
              />
            </Grid>

            <Grid item xs={5.5}>
              <Paper
                style={{
                  display: "flex",
                  justifyContent: "flex-start",
                }}
              >
                <SectionInfo formData={formData} sectionsList={sectionsList} />
              </Paper>
            </Grid>
            <Grid
              item
              xs={1}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
              }}
            >
              <AddCircleOutlineIcon size="xlarge" />
            </Grid>
            <Grid item xs={5.5}>
              <Paper style={{ display: "flex", justifyContent: "center" }}>
                <div
                  style={{
                    width: "100%",
                    display: "flex",
                    flexDirection: "column",
                  }}
                >
                  <InstructorInfo formData={formData} instructorsList={instructorsList} />
                </div>
              </Paper>
            </Grid>

            <Grid item xs={12} display="flex" justifyContent="flex-end">
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
            </Grid>
          </Grid>
        </Form>
      )}
    </>
  );
}
