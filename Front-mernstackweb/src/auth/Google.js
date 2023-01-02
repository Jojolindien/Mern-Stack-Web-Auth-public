import React, { useEffect } from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import { GoogleLogin } from "react-google-login";
import { gapi } from "gapi-script";

const Google = ({ informParent = (f) => f }) => {
  const responseGoogle = (response) => {
    console.log(process.env.REACT_APP_API + "/auth/google-login");
    axios({
      method: "POST",
      url: `${process.env.REACT_APP_API}/auth/google-login`,
      data: { idToken: response.tokenId },
    })
      .then((response) => {
        console.log("GOOGLE SIGNIN SUCCES", response);
        //inform parent component
        informParent(response);
      })
      .catch((error) => {
        console.log("GOOGLE SIGNIN ERROR : ", error.message);
      });
  };

  useEffect(() => {
    const initClient = () => {
      gapi.client.init({
        clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        scope: "",
      });
    };
    gapi.load("client:auth2", initClient);
  });

  return (
    <div className="pb-3">
      {console.log(process.env.REACT_APP_GOOGLE_CLIENT_ID)}
      <GoogleLogin
        clientId={`${process.env.REACT_APP_GOOGLE_CLIENT_ID}`}
        buttonText="Login with Google"
        onSuccess={responseGoogle}
        onFailure={responseGoogle}
        cookiePolicy={"single_host_origin"}
      />
    </div>
  );
};

export default Google;
