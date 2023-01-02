import React, { useState, useEffect, useCallback } from "react";
// import { Link, Redirect } from "react-router-dom";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../core/Layout";
import { getCookie, isAuth, signout, updateUser } from "../auth/helpers";
// import { Redirect } from "react-router-dom";

const Admin = ({ history }) => {
  const [inputState, setInputState] = useState({
    name: "",
    email: "",
    password: "",
    buttonText: "Submit",
  });

  const token = getCookie("token");

  const loadProfile = useCallback(() => {
    axios({
      method: "GET",
      url: `${process.env.REACT_APP_API}/user/${isAuth()._id}`,
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("Profile user update - ", response);
        const { role, name, email } = response.data;
        setInputState({ ...inputState, role, name, email });
      })
      .catch((err) => {
        console.log("User profil error - ", err.response);
        if (err.response.status === 500) {
          signout(() => {
            history.push("/");
          });
        }
      });
  }, [inputState, history,token]);

  useEffect(() => {
    loadProfile();
  }, [loadProfile]);

  const { name, password } = inputState;

  const handleChange = (inputId) => (event) => {
    // console.log(event.target.value, inputId);
    setInputState({ ...inputState, [inputId]: event.target.value });
  };

  const updateFormHandler = (event) => {
    event.preventDefault();
    console.log(`${process.env.REACT_APP_API}/admin/update`);
    setInputState({ ...inputState, buttonText: "Submitting ... " });
    axios({
      method: "PUT",
      url: `${process.env.REACT_APP_API}/user/update`,
      data: { name, password },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => {
        console.log("UPDATE SUCCES", response);
        updateUser(response, () => {
          setInputState({
            ...inputState,
            buttonText: "Submitted",
          });
          toast.success("Updated", {
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
        setInputState({
          ...inputState,
          buttonText: "Submitted",
        });
      })
      .catch((error) => {
        console.log("UPDATE ERROR", error.response);
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

  const updateForm = () => {
    return (
      <form>
        <div className="form-group">
          <label htmlFor="name">Name</label>
          <input
            type="text"
            className="form-control"
            id="name"
            // aria-describedby="emailHelp"
            placeholder="Enter a name account"
            value={inputState.name}
            onChange={handleChange("name")}
          />
          <label htmlFor="email">Role</label>
          <input
            type="text"
            className="form-control"
            id="role"
            // aria-describedby="emailHelp"
            placeholder="Enter a name account"
            value={inputState.role}
            onChange={handleChange("role")}
            disabled
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
            disabled
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
          onClick={updateFormHandler}
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
        <h1 className="text-center p-5">Update admin profile</h1>
        {updateForm()}
      </div>
    </Layout>
  );
};

export default Admin;
