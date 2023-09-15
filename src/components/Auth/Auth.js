import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Navbar from "../Navbar/Navbar";

export default function Auth() {
  const url = "http://localhost:8080/auth/";
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [user, setUser] = useState({
    username: "",
    password: "",
  });

  const { username, password } = user;
  const onInputChange = (e) => {
    setUser({ ...user, [e.target.name]: e.target.value });
  };

  const handleButton = async (path) => {
    try {
      if (user.password != "" && user.username != "") {
        const result = await axios.post(url + path, user);
        if (result.data.accessToken) {
          localStorage.setItem("token", result.data.accessToken);
          navigate("/");
        }
      } else {
        setError("Please fill in all fields!");
      }
    } catch (err) {
      if (err.response.status == 401) {
        setError("Username or password is incorrect!");
      } else {
        setError(err.response.data.message);
      }
    }
  };

  return (
    <div>
      <Navbar />
      <div className="container mt-5">
        <div className="row">
          <div className="col-md-6 offset-md-3 border rounded p-4 mt-2 shadow">
            {error ? (
              <div className="alert alert-danger" role="alert">
                {error}
              </div>
            ) : (
              ""
            )}

            <form>
              <div className="mb-3">
                <label htmlFor="username" className="form-label">
                  Username
                </label>
                <input
                  required
                  type="text"
                  className="form-control"
                  placeholder="Enter your username"
                  name="username"
                  id="username"
                  onChange={(e) => onInputChange(e)}
                ></input>
              </div>

              <div className="mb-3">
                <label htmlFor="password" className="form-label">
                  Password
                </label>
                <input
                  required
                  type="password"
                  className="form-control"
                  placeholder="Enter your password"
                  name="password"
                  id="password"
                  onChange={(e) => onInputChange(e)}
                ></input>
              </div>
              <div className="mb-3">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => handleButton("register")}
                >
                  Register
                </button>
              </div>
              <small id="emailHelp" className="form-text text-muted">
                Are you already registered! Login
              </small>
              <div className="mt-3">
                <button
                  type="button"
                  className="btn btn-outline-primary"
                  onClick={() => handleButton("login")}
                >
                  Login
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
