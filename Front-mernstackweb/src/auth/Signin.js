import React, { useState } from "react";
import { Link, Redirect, useHistory } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Google from "./Google";
import Facebook from "./Facebook";
import Layout from "../core/Layout";
import { authenticate, isAuth } from "./helpers";

const Signin = () => {
  const history = useHistory();
  const [inputState, setInputState] = useState({
    email: "",
    password: "",
    buttonText: "Submit",
  });

  const { email, password } = inputState;

  const handleChange = (inputId) => (event) => {
    // console.log(event.target.value, inputId);
    setInputState({ ...inputState, [inputId]: event.target.value });
  };

  const informParent = (response) => {
    authenticate(response, () => {

      toast.success(`Welcome aboard ${response.data.user.name}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
      isAuth() && isAuth().role === "admin"
        ? history.push("/admin")
        : history.push("/private");
    });
  };

  const submitFromHandler = (event) => {
    event.preventDefault();
    // console.log(`${process.env.REACT_APP_API}/auth/signin`);
    setInputState({ ...inputState, buttonText: "Submitting ... " });
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/auth/signin`,
      data: { email, password },
    })
      .then((response) => {
        // console.log("SIGNIN SUCCESS", response);

        //save the response (user, token) localstorage/cookie
        authenticate(response, () => {
          //reset-clear the inputState
          setInputState({
            ...inputState,
            password: "",
            email: "",
            buttonText: "Submitted",
          });
          toast.success(`Welcome aboard ${response.data.user.name}`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          isAuth() && isAuth().role === "admin"
            ? history.push("/admin")
            : history.push("/private");
        });
      })
      .catch((error) => {
        console.log("SIGNIN ERROR", error.response.data);
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

  const signinForm = () => {
    return (
      <form>
        <div className="form-group">
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
      {/* {JSON.stringify(isAuth())} */}
      <div className="col-md-6 offset-md-3">
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
        {isAuth() && <Redirect to="/" />}
        <h1 className="text-center p-5">Signin</h1>
        <Google informParent={informParent} />
        <Facebook informParent={informParent}/>
        {signinForm()}
        <hr />
        <Link to="/auth/password/forgot">I've forgot my password</Link>
      </div>
    </Layout>
  );
};

export default Signin;
