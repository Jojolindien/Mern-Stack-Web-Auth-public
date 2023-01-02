import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import jwt from "jwt-decode";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../core/Layout";

const Reset = () => {
  const [inputState, setInputState] = useState({
    email: "",
    token: "",
    newPassword: "",
    buttonText: "Reset password",
  });

  //email et id sont dans le tokenLink
  const { tokenLink } = useParams();

  useEffect(() => {
    const { email } = jwt(tokenLink);
    if (tokenLink) {
      setInputState({ ...inputState, email, token: tokenLink });
    }
    console.log(tokenLink);
    console.log(email);
  }, [inputState, tokenLink]);

  const { newPassword, token } = inputState;

  const handleChange = (event) => {
    // console.log(event.target.value, inputId);
    setInputState({ ...inputState, newPassword: event.target.value });
  };

  const submitFromHandler = (event) => {
    event.preventDefault();
    console.log(`${process.env.REACT_APP_API}/auth/reset-password`);
    setInputState({ ...inputState, buttonText: "Submitting ... " });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/auth/reset-password`,
      data: { newPassword, resetPasswordLink: token },
    })
      .then((response) => {
        console.log("Reset password with SUCCESS", response);
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
        setInputState({ ...inputState, buttonText: "Done" });
        //save the response (user, token) localstorage/cookie
      })
      .catch((error) => {
        console.log("SIGNIN ERROR", error.response.data);
        setInputState({
          ...inputState,
          buttonText: "Reset Password",
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

  const ResetPasswordForm = () => {
    return (
      <form>
        <div className="form-group">
          <label htmlFor="password">New password</label>
          <input
            type="password"
            className="form-control"
            id="password"
            // aria-describedby="emailHelp"
            placeholder="Enter new password"
            value={newPassword}
            onChange={handleChange}
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
        <h1 className="text-center p-5">Reset your Password</h1>
        {ResetPasswordForm()}
      </div>
    </Layout>
  );
};

export default Reset;
