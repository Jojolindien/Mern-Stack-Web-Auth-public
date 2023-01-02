import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../core/Layout";

const Forgot = () => {
  const [inputState, setInputState] = useState({
    email: "",
    buttonText: "Reset your password",
  });

  const { email } = inputState;

  const handleChange = (inputId) => (event) => {
    // console.log(event.target.value, inputId);
    setInputState({ ...inputState, [inputId]: event.target.value });
  };

  const submitFromHandler = (event) => {
    event.preventDefault();
    console.log(`${process.env.REACT_APP_API}/auth/forgot-password`);
    setInputState({ ...inputState, buttonText: "Submitting ... " });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/auth/forgot-password`,
      data: { email },
    })
      .then((response) => {
        console.log("Sent forgot password with SUCCESS", response);
        toast.success(`${response.data.message}`, {
            position: "top-center",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            progress: undefined,
            theme: "light",
          });
          setInputState({ ...inputState, buttonText: "Requested ... " })
        //save the response (user, token) localstorage/cookie

      })
      .catch((error) => {
        console.log("SIGNIN ERROR", error.response.data);
        setInputState({
          ...inputState,
          buttonText: "Requested",
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

  const passwordForgotForm = () => {
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
        <h1 className="text-center p-5">Forgot Password</h1>
        {passwordForgotForm()}
      </div>
    </Layout>
  );
};

export default Forgot;
