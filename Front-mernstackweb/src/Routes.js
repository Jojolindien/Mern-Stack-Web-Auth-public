import React from "react";
import { BrowserRouter, Switch, Route, Redirect } from "react-router-dom";
import App from "./App";
import Signup from "./auth/Signup";
import Signin from "./auth/Signin";
import AccountActivation from "./auth/AccountActivation";
import Private from "./core/Private";
import Admin from "./core/Admin";
import PrivateRoute from "./auth/PrivateRoute";
// import { isAuth } from "./auth/helpers";
import AdminRoute from "./auth/AdminRoute";
import Forgot from "./auth/forgot";
import Reset from "./auth/reset";

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route path="/" exact component={App} />
        <Route path="/signup" exact component={Signup} />
        <Route path="/signin" exact component={Signin} />
        <Route
          path="/auth/activation/:linkToken"
          exact
          component={AccountActivation}
        />
        <PrivateRoute path="/private" exact component={Private} />

        <AdminRoute path="/admin" exact component={Admin} />
        <Route path="/auth/password/forgot" exact component={Forgot} />
        <Route path="/auth/password/reset/:tokenLink" exact component={Reset} />

        <Redirect to="/" />
      </Switch>
      ;
    </BrowserRouter>
  );
};

export default Routes;
