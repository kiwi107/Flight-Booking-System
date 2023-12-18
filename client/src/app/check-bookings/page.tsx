"use client";
import React, { useState, useEffect } from "react";
import Navbar from "../components/navbar";
import { useRouter } from "next/navigation";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPenToSquare } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import Link from "next/link";





function checkBookings() {
    const router = useRouter();

    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        const loadBookings = () => {
            fetch("http://localhost:8000/private/booking", {
                method: "GET",
                credentials: "include",
                headers: {
                    "Content-Type": "application/json",
                    "x-access-token": localStorage.getItem("token") || "",
                },
            })
                .then((response) => {
                    if (response.status === 401) {
                        router.push("/login");
                    }
                    else if (response.status === 403) {
                        router.push("/login");
                        
                    }
                    else {
                        return response.json();
                    }
                })
                .then((data) => {

                    setBookings(data.bookings);
                })
                .catch((error: Error) => {
                    console.error("Error:", error);
                });
        }
        return () => loadBookings();
    }, []);


    function handleDelete(id:string) {
        fetch("http://localhost:8000/private/booking/"+id, {
            method: "DELETE",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token") || "",
            },
        })
            .then((response) => {
                if (response.status === 401) {
                    router.push("/login");
                }
                else if (response.status === 403) {
                    router.push("/login");
                }
                else {
                    //remove the deleted booking from the state
                    const newBookings = bookings.filter((booking) => booking['_id'] !== id);
                    setBookings(newBookings);
                }
            })
            .then((data) => {
                console.log(data);
                router.push("/check-bookings");
            })
            .catch((error: Error) => {
                console.error("Error:", error);
            });
    }


    return (
        <>
        
            <Navbar />
            <div className="container">
                <h1>Check Bookings</h1>


                {bookings.map((booking) => (
                    <div key={booking['_id']} className="card" >
                        <div className="card-body">
                            <div className="row">
                                <div className="col-8">
                                <p>From: {booking['fromAirport']},{booking['fromCity']}, {booking['fromCountry']} </p>

                                </div>
                                <div className="col-4">
                                    <div className="d-flex justify-content-end">
                                        <Link href={{
                                            pathname: '/edit-booking',
                                            query: { bookingId: booking['_id'] }
                                        }}><FontAwesomeIcon  icon={faPenToSquare} /></Link>
                                        <FontAwesomeIcon className="ms-2 me-3 mt-1" onClick={() => handleDelete(booking['_id'])} icon={faTrash} />

                                    </div>
                                </div>
                            </div>
                            <p>To: {booking['toAirport']}, {booking['toCity']}, {booking['toCountry']}</p>
                            <p>Class Type: {booking['classType']}</p>
                            <p>Trip Type: {booking['tripType']}</p>
                            <p>Departure Date: {booking['departureDate']}</p>
                            {booking['tripType'] === 'One Way' ? (
                                <p></p>
                            ) : (
                                <p>Return Date: {booking['returnDate']}</p>
                            )}



                        </div>
                    </div>
                ))}
            </div>


        </>
    )
}

export default checkBookings;