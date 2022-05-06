import React from "react";
import "./SetupPage.css";
import Sidebar from "../../components/Sidebar";
import InstructorSetupTable from "../../components/Tables/InstructorSetupTable";
import CourseSetupTable from "../../components/Tables/CourseSetupTable";
import gearBackground from "../../assets/svg/background_gear.svg";

import axios from "axios";

import Loader from "../../components/LoadingScreen/Loader";
import { Navigate } from "react-router-dom";

import Notification from "../../components/Forms/SectionForm/controls/Notification"

export default function SetupPage(props) {
  document.title = "Setup - ADTAA";
  const [loading, setLoading] = React.useState(true); // For <Loader />

  const [notify, setNotify] = React.useState({
    isOpen: false,
    message: "",
    type: "",
  });

  const [credentials, setCredentials] = React.useState(null);
  React.useEffect(() => {
    setTimeout(() => setLoading(false), 1500);

    axios
      .get("/credentials", {
        headers: { Authorization: "Bearer " + props.token },
      })
      .then((response) => {
        console.log(response);
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
          props.removeToken()
        }
      });
  }, []);

  if (loading === true) return <Loader message={""} />;
  else if (credentials === undefined || credentials === null) {
    return (
      <Loader message={"Authenticating... Please refresh if page does not load"} />
    );
  } else if (
    credentials.user_access_level !== "ROOT" &&
    credentials.user_access_level !== "ADMIN"
  ) {
    // handles going to page via URL and unauthorized access.
    return <Navigate replace to="/dashboard" />;
  }
  return (
    <div className="background-setup">
      <div className="banner-setup">
        <img src={gearBackground} alt="gear logo" className="gear-background" />
      </div>

      <Sidebar
        page="setup"
        accessLevel={credentials.user_access_level}
        email={credentials.user_email}
        logout={props.removeToken}
      />

      <div className="table-container-setup">
        <InstructorSetupTable token={props.token} setToken={props.setToken} setNotify={setNotify}/>
        <br />
        <br />
        <br />

        <CourseSetupTable token={props.token} setToken={props.setToken} setNotify={setNotify} />
        <Notification notify={notify} setNotify={setNotify} />
      </div>
    </div>
  );
}

// else if (credentials === undefined || credentials === null)
//   // handles tampering using localStorage.setItem("token") and localStorage.removeItem("token")
//   return (
//     <Loader message={"Authentication failed. Please refresh the page"} />
//   );
