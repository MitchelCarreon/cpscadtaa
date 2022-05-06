import "./Sidebar.css";

import React from "react";
import monitorImg from "../assets/svg/sidebar/sidebar_monitor.svg";
import gearImg from "../assets/svg/sidebar/sidebar_gear.svg";
import assistImg from "../assets/svg/sidebar/sidebar_assist.svg";
import pencilImg from "../assets/svg/sidebar/sidebar_pencil.svg";
import personImg from "../assets/svg/sidebar/sidebar_person.svg";
import ualrLogo from "../assets/svg/sidebar/sidebar_ualr.svg";
import userLogo from "../assets/svg/user-logo-bottom.svg";
import keyLogo from "../assets/svg/key-logo-bottom.svg";
import powerLogo from "../assets/svg/power-off-solid.svg";

import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

export default function Sidebar(props) {
  let navigate = useNavigate();
  function goToDashboard(e) {
    let path = "/dashboard";
    navigate(path);
  }
  function goToAssistantPage(e) {
    let path = "/assistant";
    navigate(path);
  }
  function goToSetupPage(e) {
    let path = "/setup";
    navigate(path);
  }
  function goToEditPage(e) {
    let path = "/edit-schedules";
    navigate(path);
  }
  function goToRegReqsPage(e) {
    let path = "/registration-requests";
    navigate(path);
  }

  console.log(props.accessLevel);

  return (
    <div
      className="sidebar"
      onClick={() => {
        window.scrollTo(0, 0);
      }}
    >
      <ul className="sidebar-items">
        <li onClick={goToDashboard}>
          <img src={monitorImg} alt="monitor icon" />
          {/* <Link to="/dashboard">Dashboard</Link>           */}
          <p>Dashboard</p>
        </li>
        <li
          className={`${
            props.page === "assistant" ? "sidebar-current-page" : ""
          }`}
          onClick={goToAssistantPage}
        >
          <img src={assistImg} alt="icon of people carrying box" />
          {/* <Link to="/assistant">Assistant</Link> */}
          <p>Assistant</p>
        </li>
        {(props.accessLevel === "ROOT" || props.accessLevel === "ADMIN") && (
          <>
            <li
              className={`${
                props.page === "setup" || props.page === "setup-sections"
                  ? "sidebar-current-page"
                  : ""
              }`}
              onClick={goToSetupPage}
            >
              <img src={gearImg} alt="gear icon" />
              {/* <Link to="/setup">Setup</Link> */}
              {props.page !== "setup-sections" ? (
                <p>Setup</p>
              ) : (
                <p>
                  <i>Assigning sections</i>
                </p>
              )}
            </li>
            {/* <li
              className={`${
                props.page === "edit-schedules" ? "sidebar-current-page" : ""
              }`}
              onClick={goToEditPage}
            >
              <img src={pencilImg} alt="pencil icon" />
              <p>Edit</p>
            </li> */}
          </>
        )}
        {props.accessLevel === "ROOT" && (
          <li
            className={`${
              props.page === "regRequests" ? "sidebar-current-page" : ""
            }`}
            onClick={goToRegReqsPage}
          >
            <img src={personImg} alt="person icon" />
            {/* <Link to="/registration-requests">Registration requests</Link> */}
            <p>Registration requests</p>
          </li>
        )}
        <li onClick={() => props.logout()}>
          <img src={powerLogo} alt="logout" />
          <p>Logout</p>
        </li>
      </ul>

      <hr className="solid-line-sidebar-divider" />

      <img src={ualrLogo} alt="ualr logo" className="sidebar-ualr-logo" />
      <section className="user-credentials">
        <div>
          <img src={keyLogo} alt="user email logo" />
          <p>
            <i>{props.accessLevel}</i>
          </p>
        </div>
        <div>
          <img src={userLogo} alt="user email logo" />
          <p>
            <i>{props.email}</i>
          </p>
        </div>
      </section>

      <hr className="solid-line-sidebar-divider" />
    </div>
  );
}
