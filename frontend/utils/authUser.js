import axios from "axios";
import baseUrl from "./baseUrl";
import catchErrors from "./catchErrors";
import cookie from "js-cookie";

export const registerUser = async (user, profilePicUrl, setError, setLoading) => {
  try {
    const res = await axios.post(`${baseUrl}/api/signup`, { user, profilePicUrl });

    setToken(res.data);
  } catch (error) {
    setError(catchErrors(error));
  }
  setLoading(false);
};

export const loginUser = async (user, setError, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.post(`${baseUrl}/api/auth`, { user });
    setToken(res.data);
  } catch (error) {
    setError(catchErrors(error));
  }
  setLoading(false);
};

export const redirectUser = (ctx, location) => {
  if (ctx.req) {
    ctx.res.writeHead(302, { Location: location });
    ctx.res.end();
  } else {
    window.location.href = location;
  }
};

const setToken = token => {
  cookie.set("token", token);
  localStorage.setItem("currentUser", JSON.stringify(token));
  window.location.href = "/";
};

export const createGig = async (state, setError, setLoading) => {
  setLoading(true);
  try {
    const res = await axios.post(`${baseUrl}/api/gigs`, { state });
    console.log(res.data);
  } catch (error) {
    setError(catchErrors(error));
  }
  setLoading(false);
};

export const logoutUser = email => {
  cookie.set("userEmail", email);
  cookie.remove("token");
  localStorage.removeItem("currentUser");
  window.location.href = "/login";
};
