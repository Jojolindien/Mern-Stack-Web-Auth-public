import React, { Fragment } from "react";
import { NavLink } from "react-router-dom";
import { isAuth, signout } from "../auth/helpers";
import { useHistory } from "react-router-dom";

const Layout = (props) => {
  const history = useHistory();
  const nav = () => {
    return (
      <ul className="nav nav-tabs">
        <li className="nav-item">
          <NavLink to="/" exact className="nav-link">
            Home
          </NavLink>
        </li>
        {!isAuth() && (
          <React.Fragment>
            <li className="nav-item">
              <NavLink to="/signin" exact className="nav-link">
                Signin
              </NavLink>
            </li>
            <li className="nav-item">
              <NavLink to="/signup" exact className="nav-link">
                Signup
              </NavLink>
            </li>
          </React.Fragment>
        )}
        {isAuth() && isAuth().role === "admin" && (
          <li className="nav-item">
            <NavLink to="/admin" exact className="nav-link">
              Profile
            </NavLink>
          </li>
        )}
        {isAuth() && isAuth().role === "subscriber" && (
          <li className="nav-item">
            <NavLink to="/private" exact className="nav-link">
              Profile
            </NavLink>
          </li>
        )}
        {isAuth() && (
          <li className="nav-item">
            <p
              className="nav-link"
              style={{ cursor: "pointer" }}
              onClick={() => {
                signout(() => {
                  history.push("/");
                });
              }}
            >
              Signout
            </p>
          </li>
        )}
        <li className="nav-item">
          <a
            className="nav-link disabled"
            href="/"
            tabIndex="-1"
            aria-disabled="true"
          >
            Disabled
          </a>
        </li>
      </ul>
    );
  };
  return (
    <Fragment>
      {nav()}
      <div className="container">{props.children}</div>
    </Fragment>
  );
};

export default Layout;
