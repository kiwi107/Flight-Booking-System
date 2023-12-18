"use client";
import React, { useState, useEffect, use, FormEvent } from "react";
import Navbar from "../components/navbar";
import { useRouter } from "next/navigation";
import { AuthContext } from "../layout";





function Login() {
    const [error, setError] = useState(null);
    const { auth, setAuth } = React.useContext(AuthContext);


    const router = useRouter();
    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();

        fetch("http://localhost:8000/auth/login", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                username: document.querySelector<HTMLInputElement>("#username")?.value,
                password: document.querySelector<HTMLInputElement>("#password")?.value,
            }),
            credentials: "include", // Include cookies
        })
            .then((response) => response.json())
            .then(data => {
                if(data.auth){
                    localStorage.setItem("token", data.token);
                    setAuth(true);
                    router.back();
                }else{
                    setError(data.message);
                }
              
            })
            .catch((error) => {
                console.error("Error:", error);
            });

    };







    return (
        <>

            <Navbar />
            <h1>Login</h1>

            <form onSubmit={handleSubmit}>
                <input id="username" type="text" name="username" placeholder="username" />
                <input id="password" type="password" name="password" placeholder="password" />
                <input type="submit" value="login" />
                {error && <p>{error}</p>}
            </form>


        </>
    );
}

export default Login;
