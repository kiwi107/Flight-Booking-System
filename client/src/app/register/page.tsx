"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { useRouter } from "next/navigation";


function Register() {
    const router = useRouter();

    useEffect(() => {
        const form = document.querySelector('#registerForm') as HTMLFormElement;

        const handleSubmit = (event:Event) => {
            event.preventDefault();

            fetch("http://localhost:8000/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    username: document.querySelector<HTMLInputElement>("#username")?.value,
                    password: document.querySelector<HTMLInputElement>("#password")?.value,
                }),
            })
                .then((response) => {
                    if (response.status === 200) {
                        router.back();
                    }
                    else {
                        return response.json();
                    }
                })
                .catch((error) => {
                    console.error("Error:", error);
                });
            
             

        }
        form?.addEventListener("submit", handleSubmit);

        return () => {
            form?.removeEventListener("submit", handleSubmit);
        };
   
}, []);



return (
    <>
        <Navbar />
        <h1>Register</h1>

        <form id="registerForm">
            <input id="username" type="text" name="username" placeholder="username"
            />
            <input id="password" type="password" name="password" placeholder="password" />
            <input type="submit" value="register" />
        </form>
    </>
);
}

export default Register;
