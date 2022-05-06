import React from "react";
import axios from "axios";
import Sidebar from "../../components/Sidebar";
import Loader from "../../components/LoadingScreen/Loader";
import "./EditSchedulePage.css"
import editSchedulesBackground from "../../assets/svg/background_edit_schedules.svg"

export default function EditSchedulePage(props) {
  const [loading, setLoading] = React.useState(true); // For <Loader />

  const [credentials, setCredentials] = React.useState(null);

  React.useEffect(() => {
    document.title = "Edit schedules - ADTAA";
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
          props.removeToken();
        }
      });
  }, []);

  if (loading === true) return <Loader message={""} />;
  else if (credentials === undefined || credentials === null) {
    return (
      <Loader
        message={"Authenticating... Please refresh if page does not load"}
      />
    );
  }
  return (
    <div className="background-edit-schedules">
      <div className="banner-edit-schedules">
        <img
            src={editSchedulesBackground}
          alt="edit schedules logo"
          className="edit-schedules-background"
        />
      </div>

      <Sidebar
        page="edit-schedules"
        accessLevel={credentials.user_access_level}
        email={credentials.user_email}
        logout={props.removeToken}
      />

      <div className="table-container-edit-schedules"></div>
    </div>
  );
}
