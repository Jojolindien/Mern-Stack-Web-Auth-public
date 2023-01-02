import React from "react";
import axios from "axios";
import "react-toastify/dist/ReactToastify.css";
import FacebookLogin from "react-facebook-login";
// import { gapi } from "gapi-script";

const Facebook = ({ informParent = (f) => f }) => {
  const responseFacebook = (response) => {
    console.log(response);
    console.log(process.env.REACT_APP_API + "/auth/facebook-login");
    // axios({
    //   method: "POST",
    //   url: `${process.env.REACT_APP_API}/auth/facebook-login`,
    //   data: { userID: response.tokenId },
    // })
    //   .then((response) => {
    //     console.log("GOOGLE SIGNIN SUCCES", response);
    //     //inform parent component
    //     informParent(response);
    //   })
    //   .catch((error) => {
    //     console.log("GOOGLE SIGNIN ERROR : ", error.message);
    //   });
  };

  //   useEffect(() => {
  //     const initClient = () => {
  //       gapi.client.init({
  //         clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
  //         scope: "",
  //       });
  //     };
  //     gapi.load("client:auth2", initClient);
  //   });

  return (
    <div className="pb-3">
      {console.log(process.env.REACT_APP_FACEBOOK_APP_ID)}
      <FacebookLogin
        appId={`${process.env.REACT_APP_FACEBOOK_APP_ID}`}
        autoLoad={false}
        fields="name,email,picture"
        callback={responseFacebook}
        cssClass="my-facebook-button-class"
        icon="fa-facebook"
      />
    </div>
  );
};

export default Facebook;
