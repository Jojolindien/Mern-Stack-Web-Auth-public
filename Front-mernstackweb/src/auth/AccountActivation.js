import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import jwt_decode from "jwt-decode";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Layout from "../core/Layout";

const AccountActivation = () => {
  const [inputState, setInputState] = useState({
    name: "Dude",
    token: "",
    show: true,
  });

  const { name, token } = inputState;

  const { linkToken } = useParams();

  useEffect(() => {
    console.log(linkToken);
    let { name } = jwt_decode(linkToken);
    if (linkToken) {
      setInputState({ ...inputState, name, token:linkToken });
    }
  }, [inputState, linkToken]);

  const clickSubmit = (event) => {
    event.preventDefault();
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/auth/account-activation`,
      data: { token },
    })
      .then((response) => {
        console.log("ACTIVATION SENT", response);
        setInputState({
          ...inputState,
          show: false,
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
        console.log("ACTIVATION ERROR", error.response.data.message);
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

  const activationLink = () => (
    <div>
      <h1 className="p-5 text-center">
        Hey {name} ! Ready to activate your account ?
      </h1>
      <button className="btn btn-outline-primary col-12" onClick={clickSubmit}>
        Activate account
      </button>
    </div>
  );

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
        <h1 className="text-center p-5">Activate Account</h1>
        {activationLink()}
      </div>
    </Layout>
  );
};

export default AccountActivation;
