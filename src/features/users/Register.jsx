import React, { useState, useEffect } from "react";
import { useAddNewUsersMutation } from "./usersApiSlice";
import { useNavigate, Link } from "react-router-dom";

import "./Users.css";

const USER_REGEX = /^[A-z0-9]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const Register = () => {
  const [addNewUser, { isLoading, isSuccess, isError, error }] =
    useAddNewUsersMutation();

  const navigate = useNavigate();

  const [username, setUsername] = useState("");
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setValidUsername(USER_REGEX.test(username));
  }, [username]);

  useEffect(() => {
    setValidPassword(PWD_REGEX.test(password));
  }, [password]);

  useEffect(() => {
    if (isSuccess) {
      setUsername("");
      setPassword("");
      navigate("/");
    }
  }, [isSuccess, navigate]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);
  const onConfirmPwdChanged = (e) => setConfirmPassword(e.target.value);

  let pwdMatched = password === confirmPassword;

  const canRegister =
    [validUsername, validPassword, pwdMatched].every(Boolean) && !isLoading;

  const onRegisterUserClicked = async (e) => {
    e.preventDefault();
    if (canRegister) {
      await addNewUser({ username, password });
    }
  };

  const errClass = isError ? "errmsg" : "offscreen";
  const validUserClass = !validUsername ? "form_input--incomplete" : "";
  const validPwdClass = !validPassword ? "form_input--incomplete" : "";

  const content = (
    <div className="register-section">
      <p className={errClass}>{error?.data?.message}</p>

      <form className="register-form" onSubmit={onRegisterUserClicked}>
        <div className="form_title-row">
          <h2>Register</h2>
        </div>
        <div className="register-inputs">

          <div className="input-item">
            <label className="form_label" htmlFor="username">
              Username: [3-20 letters]
            </label>
            <input
              className={`form_input ${validUserClass}`}
              id="username"
              name="username"
              type="text"
              autoComplete="off"
              value={username}
              onChange={onUsernameChanged}
              required
            />
          </div>
          <div className="input-item">
            <label className="form_label" htmlFor="password">
              Password: [4-12 chars incl. !@#$%]
            </label>
            <input
              className={`form_input ${validPwdClass}`}
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={onPasswordChanged}
              required
            />
          </div>
          <div className="input-item">
            <label className="form_label" htmlFor="confirmPassword">
              Confirm Password:
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              value={confirmPassword}
              onChange={onConfirmPwdChanged}
              required
            />
          </div>

          {!pwdMatched && <p className="errmsg">Passwords do not match!</p>}

          <div className="form-btns-section">
            <button className="register-btn" title="Save" disabled={!canRegister}>
              Register
            </button>
            <div className="form_action-btns">
            <Link to='/'>← Back to Login</Link>
          </div>
          </div>
        </div>
      </form>
    </div>
  );

  return content;
};

export default Register;
