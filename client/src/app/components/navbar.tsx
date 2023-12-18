import React, { useEffect, useState } from "react";
import Link from "next/link";
import { AuthContext } from "../layout";





function Navbar() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const { auth, setAuth } = React.useContext(AuthContext);
  

  useEffect(() => {
    if (localStorage.getItem("token")) {
      // setIsAuthenticated(true);
      setAuth(true);
    } else {
      // setIsAuthenticated(false);
      setAuth(false);
    }
  }, []);





  const logout = () => {
    fetch("http://localhost:8000/auth/logout", {
      method: "POST",
      credentials: "include", // Include cookies (JWT token)
    })
      .then((response) => response.json())
      .then((data) => {
        localStorage.removeItem("token");
        console.log("logged out");
        // setIsAuthenticated(false);
        setAuth(false);
      });
  }





  return (

    <header>
      <nav className="navbar navbar-expand-lg bg-body-tertiary">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">Fly ME</a>
          <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav me-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <Link className="nav-link active" aria-current="page" href="/">Book a Flight</Link>
              </li>
              <li className="nav-item">
                <a className="nav-link" href="test">Book a Hotel</a>
              </li>
              <li className="nav-item">
                <Link className="nav-link" href="check-bookings">Check Bookings</Link>
              </li>

            </ul>
            <div className="d-flex">

              <a className="btn btn-outline-success" href="register">Register</a>
              {auth ? (
                <button onClick={logout} className="btn btn-outline-success">Logout</button>
              ) : (
                <Link className="btn btn-outline-success" href="login">Login</Link>
              )}



            </div>
          </div>
        </div>
      </nav>
    </header>

  );
}

export default Navbar;
