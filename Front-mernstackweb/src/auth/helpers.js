import cookie from "js-cookie";

//Set in cookie
export const setCookie = (key, value) => {
  if (window !== "undefined") {
    cookie.set(key, value, {
      expires: 1,
    });
  }
};

// remove from cookie
export const removetCookie = (key) => {
  if (window !== "undefined") {
    cookie.remove(key, {
      expires: 1,
    });
  }
};

// get from cookie such as stored token
// will be useful when we need to make requerst to server with token
export const getCookie = (key) => {
  if (window !== "undefined") {
    return cookie.get(key);
  }
};

//set in locastorage
export const setLocalStorage = (key, value) => {
  if (window !== "undefined") {
    localStorage.setItem(key, JSON.stringify(value));
  }
};

//remove from localstorage
export const removeLocalStorage = (key) => {
  if (window !== "undefined") {
    localStorage.removeItem(key);
  }
};

//authenticate user by passing data to cookie and localstorage during
export const authenticate = (response, next) => {
  console.log("AUTHENTICATE HELPER", response);
  setCookie("token", response.data.token);
  setLocalStorage("user", response.data.user);
  next();
};

//access user info from localstorage
export const isAuth = () => {
  if (window !== "indefined") {
    const cookieChecked = getCookie("token");
    if (cookieChecked) {
      if (localStorage.getItem("user")) {
        return JSON.parse(localStorage.getItem("user"));
      } else {
        return false;
      }
    }
  }
};

//logout
export const signout = (next) => {
  removetCookie("token");
  removeLocalStorage("user");
  next();
};

export const updateUser = (res, next) => {
  console.log("Update user helper");
  if (window !== "undefined") {
    let auth = JSON.parse(localStorage.getItem("user"));
    auth = res.data;
    localStorage.setItem("user", JSON.stringify(auth));
  }
  next();
};
