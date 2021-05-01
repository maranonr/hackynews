import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, withRouter } from "react-router-dom";
import GoogleLogin from "react-google-login";
import ImageUploader from "react-images-upload";

import signUpImage from "../images/img3.jpg";
import {
  handleSignup,
  selectAuthError,
  selectIsLoadingSubmit,
  handleGoogleLogin,
} from "../slices/auth";
import "./styles.css";

const Signup = ({ history }) => {
  const isLoading = useSelector(selectIsLoadingSubmit);
  const [file, setFile] = useState([]);
  const [img, setImg] = useState("");
  const [creds, setCreds] = useState({
    email: "",
    password: "",
    name: "",
    error: "",
  });
  const dispatch = useDispatch();
  const handleChange = (e) =>
    setCreds({ ...creds, [e.target.name]: e.target.value });

  useEffect(() => {
    if (file.length) {
      const singleFile = file[0];
      var reader = new FileReader();
      reader.onloadend = function () {
        setImg(reader.result);
      };
      reader.readAsDataURL(singleFile);
    }
  }, [file])

  const { email, password, name } = creds;
  const error = useSelector(selectAuthError);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password || !name) return;
    try {
      await dispatch(handleSignup({ email, password, name, img }));
      history.push("/login");
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
        <div className="col-md-6 col-sm-12" style={{ padding: 0, margin: 0 }}>
          <img src={signUpImage} width="100%" height="100%" />
        </div>
        <div className="col-md-6 col-sm-12" style={{ padding: 0, margin: 0 }}>
          <div className="col-sm-12">
            <div className="login-form">
              {error && (
                <div className="alert alert-danger" role="alert">
                  {error}
                </div>
              )}
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="username">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    name="name"
                    value={name}
                    onChange={handleChange}
                    required
                  />
                </div>
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
                </div>
                <div className="form-group">
                  <label className="username">Profile Image</label>
                  <ImageUploader
                    withIcon={true}
                    buttonText="Choose image"
                    onChange={setFile}
                    imgExtension={[".jpg", ".gif", ".png", ".gif"]}
                    maxFileSize={5242880}
                    singleImage
                    withPreview
                  />
                </div>
                <div className="center">
                  <button
                    type="submit"
                    className="btn btn-black"
                    onClick={handleSubmit}
                    disabled={isLoading}
                  >
                    {isLoading ? "Loading..." : "SIGN UP"}
                  </button>
                  <GoogleLogin
                    clientId="646647642939-dpvcpj052v57m7kt671jsb6bgnvr7br4.apps.googleusercontent.com"
                    buttonText="Sign up with Google"
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
                <b>Sign up with google</b>
              </p>
            </div>*/}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default withRouter(Signup);
