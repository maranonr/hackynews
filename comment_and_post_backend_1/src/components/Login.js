import React, { useState } from "react";
import { Link, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import signInImage from "../images/img1.jpg";
import GoogleLogin from "react-google-login";
import {
  handleLogin,
  handleGoogleLogin,
  selectAuthError,
  selectIsLoadingSubmit,
} from "../slices/auth";
import "./style2.css";
import "./stylelogin.css";

function Login({ history }) {
  const [creds, setCreds] = useState({ email: "", password: "", error: "" });
  const dispatch = useDispatch();
  const handleChange = (e) =>
    setCreds({ ...creds, [e.target.name]: e.target.value });
  const { email, password } = creds;
  const isLoading = useSelector(selectIsLoadingSubmit);
  const error = useSelector(selectAuthError);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return;
    try {
      await dispatch(handleLogin({ email, password }));
      window.location.href = "/";
    } catch (err) {
      console.log({ err });
    }
  };

  const responseGoogle = async (res) => {
    if (res.tokenId) {
      await dispatch(handleGoogleLogin(res));
      window.location.href = "/";
    }
  };
  return (
    <div className="container">
      <div className="row">
        <div className="col-md-6" style={{ padding: 0, margin: 0 }}>
          <img src={signInImage} width="100%" height="100%" />
        </div>

        <div className="col-md-6 col-sm-12" style={{ padding: 0, margin: 0 }}>
          <div className="col-sm-12 login-col">
            <div className="hacky2">
              <h1 className="hacky">Log in to Hacky News</h1>
            </div>
            <div className="login-form login-page">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="username">Email</label>
                  <input
                    type="email"
                    className="form-control"
                    placeholder="Email"
                    name="email"
                    value={email}
                    onChange={handleChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="username">Password</label>
                  <input
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    name="password"
                    value={password}
                    onChange={handleChange}
                    required
                  />

                  <p className="forgot-password">
                    <a>Forgot Password</a>
                  </p>
                </div>
                <div className="center">
                  <button
                    type="submit"
                    className="btn btn-black"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "SIGN IN"}
                  </button>

                  <GoogleLogin
                    clientId="646647642939-dpvcpj052v57m7kt671jsb6bgnvr7br4.apps.googleusercontent.com"
                    buttonText="Sign in with Google"
                    className="google-btn"
                    onSuccess={responseGoogle}
                    onFailure={responseGoogle}
                    cookiePolicy={"single_host_origin"}
                  />
                </div>
              </form>
              {/*<div className="google-btn" style={{margin: 20}}>
              <div className="google-icon-wrapper">
                <img
                  className="google-icon"
                  src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
                />
              </div>
              <p className="btn-text">
                <b>Sign in with google</b>
              </p>
            </div>*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default withRouter(Login);
