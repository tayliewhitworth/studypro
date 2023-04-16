import React, { useState, useEffect } from "react";
import { useUpdateUserMutation } from "./usersApiSlice";

const USER_REGEX = /^[A-z0-9]{3,20}$/;
const PWD_REGEX = /^[A-z0-9!@#$%]{4,12}$/;

const EditUserForm = ({ user }) => {
  const [updateUser, { isLoading, isSuccess, isError, error }] =
    useUpdateUserMutation();

  const [username, setUsername] = useState(user.username);
  const [validUsername, setValidUsername] = useState(false);
  const [password, setPassword] = useState("");
  const [validPassword, setValidPassword] = useState(false);

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
    }
  }, [isSuccess]);

  const onUsernameChanged = (e) => setUsername(e.target.value);
  const onPasswordChanged = (e) => setPassword(e.target.value);

  const onSaveUserClicked = async (e) => {
    if (password) {
      await updateUser({ id: user.id, username, password });
    } else {
      await updateUser({ id: user.id, username });
    }
  };

  let canSave;
  if (password) {
    canSave = [validUsername, validPassword].every(Boolean) && !isLoading;
  } else {
    canSave = [validUsername].every(Boolean) && !isLoading;
  }

  const errClass = isError ? "errmsg" : "offscreen";
  const validUserClass = !validUsername ? "form_input--incomplete" : "";
  const validPwdClass =
    password && !validPassword ? "form_input--incomplete" : "";

  const errContent = error?.data?.message;

  const content = (
    <>
      <p className={errClass}>{errContent}</p>

      <form className="user-form" onSubmit={(e) => e.preventDefault()}>
        <div className="form_title-row">
          <h2>Edit Profile</h2>
        </div>
        <div className="form-grid">
          <div className="input-item">
            <label className="form_label" htmlFor="username">
              Username: <span className="nowrap">[3-20 letters]</span>
            </label>
            <input
              className={`form_input ${validUserClass}`}
              id="username"
              name="username"
              type="text"
              autoComplete="off"
              value={username}
              onChange={onUsernameChanged}
            />
          </div>

          <div className="input-item">
            <label className="form_label" htmlFor="password">
              Password: <span className="nowrap">[empty = no change]</span>{" "}
              <span className="nowrap">[4-12 chars incl. !@#$%]</span>
            </label>
            <input
              className={`form_input ${validPwdClass}`}
              id="password"
              name="password"
              type="password"
              value={password}
              onChange={onPasswordChanged}
            />
          </div>
          <div className="form_action-btns">
            <button
              className="update-userBtn"
              title="Save"
              onClick={onSaveUserClicked}
              disabled={!canSave}
            >
              Update
            </button>
          </div>
        </div>
      </form>
    </>
  );

  return content;
};

export default EditUserForm;
