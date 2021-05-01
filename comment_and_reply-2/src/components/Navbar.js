import React, { useEffect, useState } from "react";
import "./styles.css";
import { Link, withRouter } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import placeholder from "../images/placeholder.jpg";
import { selectIsLoggedIn, set_isLoggedIn, selectUser } from "../slices/auth";

const Navbar = ({ history }) => {
  const dispatch = useDispatch();
  const isLoggedIn = useSelector(selectIsLoggedIn);
  const user = useSelector(selectUser);
  console.log(user);
  /* const fetchUser = async () => {
    const data = await dispatch(getSingleUser());
    console.log(data);
  };
  useEffect(() => {
    if (isLoggedIn) {
      fetchUser();
    }
  }, []); */
  return (
    <nav className="navbar home__nav col-md-12">
      <div className="container custom-nav">
        <a className="navbar-brand home__link" href="/">
          Hacky News
        </a>
        {!isLoggedIn && (
          <button
            type="button"
            class="navbar-toggle collapsed"
            data-toggle="collapse"
            data-target="#bs-example-navbar-collapse-1"
          >
            {" "}
            <span class="sr-only">Toggle navigation</span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
            <span class="icon-bar"></span>
          </button>
        )}

        {!isLoggedIn && (
          <div
            className="collapse navbar-collapse"
            id="bs-example-navbar-collapse-1"
          >
            <ul className="nav navbar-nav navbar-right top-nav">
              <li className=" login-box login-btn">
                <Link to="/login">LOGIN</Link>
              </li>
              <li className="box regiter-btn">
                <Link style={{ color: "white" }} to="/sign-up">
                  SIGN UP
                </Link>
              </li>
            </ul>
          </div>
        )}

        {isLoggedIn && (
          <>
            <div className="dropdown">
              <div className="box box-login login-btn hide-mobile">
                <Link to="/create-post">New Post</Link>
              </div>
              <div className="navbar-header hide-mobile">{user?.name}</div>

              <div
                className="dropdown-toggle nav-img"
                aria-labelledby="dropdownMenuLink"
                id="dropdownMenuLink"
                data-toggle="dropdown"
                aria-haspopup="true"
                aria-expanded="false"
              >
                <div className="header-dropdown">
                  <img
                    className="user-img"
                    src={user?.img ? user?.img : placeholder}
                  />
                </div>
              </div>

              <div className="dropdown-menu">
                <div className="navbar-header show-mobile">{user?.name}</div>
                <div className="box box-login login-btn show-mobile">
                  <Link to="/create-post">New Post</Link>
                </div>
                <div
                  style={{ cursor: "pointer" }}
                  className="box box-login login-btn"
                >
                  <a
                    onClick={() => {
                      localStorage.removeItem("token");
                      dispatch(set_isLoggedIn(false));
                      history.push("/login");
                    }}
                  >
                    Logout
                  </a>
                </div>
              </div>
            </div>
          </>
        )}
      </div>
    </nav>
  );
};

export default withRouter(Navbar);
