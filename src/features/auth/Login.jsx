import { useRef, useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";

import { useDispatch } from "react-redux";
import { setCredentials } from "./authSlice";
import { useLoginMutation } from "./authApiSlice";

import usePersist from "../../hooks/usePersist";

import { PacmanLoader } from "react-spinners";

const Login = () => {
  const userRef = useRef();
  const errRef = useRef();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [persist, setPersist] = usePersist();

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [login, { isLoading }] = useLoginMutation();

  useEffect(() => {
    userRef.current.focus();
  }, []);

  useEffect(() => {
    setErrMsg("");
  }, [username, password]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const { accessToken } = await login({ username, password }).unwrap();
      dispatch(setCredentials({ accessToken }));
      setUsername("");
      setPassword("");
      navigate("/home");
    } catch (err) {
      if (!err.status) {
        setErrMsg("No Server Response");
      } else if (err.status === 400) {
        setErrMsg("Missing Username or Password");
      } else if (err.status === 401) {
        setErrMsg("Unauthorized");
      } else {
        setErrMsg(err.data?.message);
      }
      errRef.current.focus();
    }
  };

  const handleUserInput = (e) => setUsername(e.target.value);
  const handlePwdInput = (e) => setPassword(e.target.value);
  const handleToggle = () => setPersist((prev) => !prev);

  const errClass = errMsg ? "errmsg" : "offscreen";

  if (isLoading) {
    return (
      <div className="login-section">
        <div className="loading">
          <PacmanLoader color="#fad85d" />
        </div>
      </div>
    );
  }

  return (
    <div className="login-section">
      <div className="login-box">
        <div className="title-box">
          <p className="login-title">Login</p>
          <p>Hey there, Get ready to study!</p>
        </div>
        <p ref={errRef} className={errClass} aria-live="assertive">
          {errMsg}
        </p>
        <form className="login-form" onSubmit={handleSubmit}>
          <div className="input-item">
            <label htmlFor="username">Username</label>
            <input
              id="username"
              type="text"
              ref={userRef}
              value={username}
              autoComplete="off"
              required
              placeholder="Enter username"
              onChange={handleUserInput}
            />
          </div>
          <div className="input-item">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              required
              placeholder="Enter password"
              onChange={handlePwdInput}
            />
          </div>
          <button className="form-btn">Sign in</button>

          <label htmlFor="persist" className="form-persist">
            <input
              type="checkbox"
              className="form-checkbox"
              id="persist"
              onChange={handleToggle}
              checked={persist}
            />
            Trust this Device
          </label>
        </form>
        <div className="register-link">
          <p>
            Don't have an account?{" "}
            <span>
              <Link to="/register">Register Now</Link>
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
