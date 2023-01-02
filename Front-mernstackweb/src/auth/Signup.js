import React, { useState } from "react";
// import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../core/Layout";
import { isAuth } from "./helpers";
import { Redirect } from "react-router-dom";

const Signup = () => {
  const [inputState, setInputState] = useState({
    name: "",
    email: "",
    password: "",
    buttonText: "Submit",
  });

  const { name, email, password } = inputState;

  const handleChange = (inputId) => (event) => {
    console.log(event.target.value, inputId);
    setInputState({ ...inputState, [inputId]: event.target.value });
  };

  const submitFromHandler = (event) => {
    event.preventDefault();
    console.log(`${process.env.REACT_APP_API}/auth/signup`);
    setInputState({ ...inputState, buttonText: "Submitting ... " });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/auth/signup`,
      data: { name, email, password },
    })
      .then((response) => {
        console.log("SIGNUP SUCCES", response);
        setInputState({
          ...inputState,
          name: "",
          password: "",
          email: "",
          buttonText: "Submitted",
        });
        toast.success(response.data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      })
      .catch((error) => {
        console.log("SIGNUP ERROR", error.response.data);
        setInputState({
          ...inputState,
          buttonText: "Submitted",
        });
        toast.error(error.response.data.message, {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      });
  };

  const signupForm = () => {
    return (
      <form>
        <div className="form-group">
          <label htmlFor="email">Name</label>
          <input
            type="name"
            className="form-control"
            id="name"
            // aria-describedby="emailHelp"
            placeholder="Enter a name account"
            value={inputState.name}
            onChange={handleChange("name")}
          />
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            className="form-control"
            id="email"
            // aria-describedby="emailHelp"
            placeholder="Enter email"
            value={inputState.email}
            onChange={handleChange("email")}
          />
          <small id="emailHelp" className="form-text text-muted">
            We'll never share your email with anyone else.
          </small>
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            placeholder="Password"
            value={inputState.password}
            onChange={handleChange("password")}
          />
        </div>
        {/* <div className="form-check">
          <input
            type="checkbox"
            className="form-check-input"
            id="exampleCheck1"
          />
          <label className="form-check-label" htmlFor="exampleCheck1">
            Check me out
          </label>
        </div> */}
        <button
          type="submit"
          className="btn btn-primary mt-3"
          onClick={submitFromHandler}
        >
          {inputState.buttonText}
        </button>
      </form>
    );
  };

  return (
    <Layout>
      <div className="col-md-6 offset-md-3">
        {isAuth() && <Redirect to="/" />}
        <ToastContainer
          position="top-center"
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={false}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          theme="light"
        />
        <h1 className="text-center p-5">Signup</h1>
        {signupForm()}
      </div>
    </Layout>
  );
};

export default Signup;
