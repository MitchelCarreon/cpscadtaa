import React from "react";
import "./RegisterPage.css";
import rect_left from "../../assets/svg/background_rectangle.svg";
import rect_right from "../../assets/svg/background_rectangle2.svg";
import ualrLogo from "../../assets/svg/uarLogoRed.svg";

import axios from "axios";
import { useRef, useState, useEffect } from "react";

/* MUI components */
import { Button } from "@mui/material";

// import APIService from "../../components/APIService";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCheck,
  faInfoCircle,
  faTimes,
} from "@fortawesome/free-solid-svg-icons";

import { Link } from "react-router-dom";
import Notification from "../../components/Forms/SectionForm/controls/Notification";

/* FORM VALIDATION REGEX */
const USERNAME_REGEX = /^[A-z][A-z0-9-_]{3,23}$/;
const EMAIL_REGEX = /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/;
const PWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#$%]).{8,24}$/;

export default function RegisterPage() {
  document.title = "Sign up for ADTAA"
  const [notify, setNotify] = React.useState({
    isOpen: false,
    message: "",
    type: "",
  });
  const [formData, setFormData] = React.useState({
    email: "",
    username: "",
    password: "",
    passwordConfirm: "",
    accessLevel: "",
  });
  console.log(formData);

  const insertUser = () => {
    axios
      .post("/register-user", formData)
      .then((response) => {
        console.log(response);
        setNotify({
          isOpen: true,
          message: "Registration request submitted! Check your email for a confirmation link.",
          type: "success",
        });
      })
      .catch((error) => {
        setNotify({
          isOpen: true,
          message: "Unable to submit a registration request",
          type: "error",
        });
        console.log(error);
      });
  };

  function handleSubmit(e) {
    e.preventDefault();

    /* prevent js button-enabling hack */
    const usernameTest = USERNAME_REGEX.test(formData.username);
    const passwordTest = PWD_REGEX.test(formData.password);
    if (!usernameTest || !passwordTest) {
      setErrMsg("Invalid entry");
      return;
    }

    insertUser();
    setFormData({
      email: "",
      username: "",
      password: "",
      passwordConfirm: "",
      accessLevel: "",
    });
  }

  function handleChange(e) {
    const { name, value, type, checked } = e.target;
    console.log(value)
    setFormData((prevFormData) => {
      return {
        ...prevFormData,
        [name]: type === "checkbox" ? checked : value,
      };
    });
  }

  /* FORM VALIDATION */

  const userRef = useRef();
  const errRef = useRef();

  const [validUsername, setValidUsername] = useState(false);
  const [userFocus, setUserFocus] = useState(false);

  const [validEmail, setValidEmail] = useState(false);
  const [emailFocus, setEmailFocus] = useState(false);

  const [validPwd, setValidPwd] = useState(false);
  const [pwdFocus, setPwdFocus] = useState(false);

  const [validMatch, setValidMatch] = useState(false);
  const [matchFocus, setMatchFocus] = useState(false);

  const [errMsg, setErrMsg] = useState("");
  // const [success, setSuccess] = useState("");

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    const resultUsername = USERNAME_REGEX.test(formData.username);
    setValidUsername(resultUsername);
  }, [formData.username]);
  useEffect(() => {
    const resultEmail = EMAIL_REGEX.test(formData.email);
    setValidEmail(resultEmail);
  }, [formData.email]);
  useEffect(() => {
    const resultPwd = PWD_REGEX.test(formData.password);
    setValidPwd(resultPwd);
    setValidMatch(formData.password === formData.passwordConfirm);
  }, [formData.passwordConfirm, formData.password]);

  useEffect(() => {
    setErrMsg("");
  }, [formData]);

  return (
    <div className="background-register">
      <img
        className="red-rectangle-left"
        src={rect_left}
        alt="left red rectangle"
      />
      <img
        className="red-rectangle-right"
        src={rect_right}
        alt="right red rectangle"
      />

      <img className="ualr-logo-red" src={ualrLogo} alt="ualr logo in red" />

      <div className="card">
        <section className="card-title">
          <h1 className="card-title-create">Create an account</h1>
          <p>Submit a registration request with your desired access level</p>
        </section>

        <p
          ref={errRef}
          className={errMsg ? "errmsg" : "offscreen"}
          aria-live="assertive"
        >
          {errMsg}
        </p>
        <form className="input-fields" onSubmit={handleSubmit}>
          <div className="input-fields-top">
            <div className="input-wrapper">
              <input
                type="email"
                className="input-field-email"
                placeholder="Email Address"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                autoComplete="off"
                ref={userRef}
                aria-describedby="uidnote"
                onFocus={() => setEmailFocus(true)}
                onBlur={() => setEmailFocus(false)}
              />
              <span className="errspan">
                <FontAwesomeIcon
                  icon={faCheck}
                  className={validEmail ? "valid" : "hide"}
                />

                <FontAwesomeIcon
                  icon={faTimes}
                  color="red"
                  className={validEmail || !formData.email ? "hide" : "invalid"}
                />
              </span>
            </div>

            <select
              id="access-levels"
              name="accessLevel"
              value={formData.accessLevel}
              onChange={handleChange}
              required
            >
              {/* <optgroup label="Access levels"> */}
              <option value="" disabled selected>
                Access level
              </option>
              <option value="ROOT">Root</option>
              <option value="ADMIN">Admin</option>
              <option value="ASSISTANT">Assistant</option>
              {/* </optgroup> */}
            </select>
          </div>

          <div className="input-wrapper">
            <input
              type="text"
              placeholder="Username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              autoComplete="off"
              required
              aria-describedby="uidnote"
              onFocus={() => setUserFocus(true)}
              onBlur={() => setUserFocus(false)}
            />
            <span className="errspan">
              <FontAwesomeIcon
                icon={faCheck}
                className={validUsername ? "valid" : "hide"}
              />

              <FontAwesomeIcon
                icon={faTimes}
                color="red"
                className={
                  validUsername || !formData.username ? "hide" : "invalid"
                }
              />
            </span>
          </div>
          <p
            id="uidnote"
            className={
              userFocus && formData.username && !validUsername
                ? "instructions"
                : "offscreen"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            4 to 24 characters.
            <br />
            Must begin with a letter.
            <br />
            Letters, numbers, underscores, hyphens allowed.
          </p>
          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              autoComplete="off"
              onFocus={() => setPwdFocus(true)}
              onBlur={() => setPwdFocus(false)}
              aria-describedby="pwdnote"
            />
            <span className="errspan">
              <FontAwesomeIcon
                icon={faCheck}
                className={validPwd ? "valid" : "hide"}
              />

              <FontAwesomeIcon
                icon={faTimes}
                color="red"
                className={validPwd || !formData.password ? "hide" : "invalid"}
              />
            </span>
          </div>
          <p
            id="pwdnote"
            className={
              pwdFocus && formData.password && !validPwd
                ? "instructions"
                : "offscreen"
            }
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            8 to 24 characters.
            <br />
            Must include uppercase and lowercase letters, a number and a special
            character.
            <br />
            Allowed special characters:{" "}
            <span aria-label="exclamation mark">!</span>{" "}
            <span aria-label="at symbol">@</span>{" "}
            <span aria-label="hashtag">#</span>{" "}
            <span aria-label="dollar sign">$</span>{" "}
            <span aria-label="percent">%</span>
          </p>

          <div className="input-wrapper">
            <input
              type="password"
              placeholder="Confirm password"
              name="passwordConfirm"
              value={formData.passwordConfirm}
              onChange={handleChange}
              required
              autoComplete="off"
              onFocus={() => setMatchFocus(true)}
              onBlur={() => setMatchFocus(false)}
              aria-describedby="confirmnote"
            />
            <span className="errspan">
              <FontAwesomeIcon
                icon={faCheck}
                className={
                  validMatch && formData.passwordConfirm ? "valid" : "hide"
                }
              />

              <FontAwesomeIcon
                icon={faTimes}
                color="red"
                className={
                  validMatch || !formData.passwordConfirm ? "hide" : "invalid"
                }
              />
            </span>
          </div>
          <p
            id="confirmnote"
            className={!validMatch && matchFocus ? "instructions" : "offscreen"}
          >
            <FontAwesomeIcon icon={faInfoCircle} />
            Passwords do not match.
          </p>
          <button
            type="submit"
            disabled={
              !validUsername || !validPwd || !validMatch || !validEmail
                ? true
                : false
            }
            className="register-btn"
          >
            Create Account
          </button>

          <div className="sign-in-full-text">
            <span>Already Have An Account? </span>
            <Link to="/login">Sign In</Link>
          </div>
        </form>
      </div>
      <Notification notify={notify} setNotify={setNotify} />
    </div>
  );
}
