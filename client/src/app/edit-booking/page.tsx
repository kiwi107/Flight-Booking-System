"use client";
import React, { useEffect, useState, useContext, FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSearchParams } from 'next/navigation'
import Navbar from "../components/navbar";

import { AirportsContext } from "../layout";
interface Booking {
    _id: string;
    fromAirport: string;
    fromCountry: string;
    fromCity: string;
    toAirport: string;
    toCountry: string;
    toCity: string;
    departureDate: string;
    returnDate: string;
    classType: string;
    tripType: string;

}


function EditBookingPage() {
    const airports = useContext(AirportsContext);

    const [booking, setBooking] = useState({} as Booking);
    const searchParams = useSearchParams();
    const router = useRouter();

    const returnText = React.useRef<HTMLLabelElement>(null);
    const fromAirport = React.useRef<HTMLInputElement>(null);
    const toAirport = React.useRef<HTMLInputElement>(null);
    const classType = React.useRef<HTMLSelectElement>(null);
    const tripType = React.useRef<HTMLSelectElement>(null);
    const departureDate = React.useRef<HTMLInputElement>(null);
    const returnDate = React.useRef<HTMLInputElement>(null);
    let toCountry = '';
    let toCity = '';
    let fromCountry = '';
    let fromCity = '';






    useEffect(() => {
        const loadBooking = () => {
            fetch("http://localhost:8000/private/booking/" + searchParams.get('bookingId'), {
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

                    setBooking(data.bookings);

                    const classTypes = ["Economy", "Business", "First"];
                    const tripTypes = ["Round Trip", "One Way"];
                    for (let i = 0; i < classTypes.length; i++) {
                        if (classType.current) {
                            if (classTypes[i] == data.bookings.classType) {
                                classType.current.innerHTML += `<option selected value="${classTypes[i]}">${classTypes[i]}</option>`;
                            } else {
                                classType.current.innerHTML += `<option value="${classTypes[i]}">${classTypes[i]}</option>`;
                            }
                        }
                    }
                    for (let i = 0; i < tripTypes.length; i++) {
                        if (tripType.current) {
                            if (tripTypes[i] == data.bookings.tripType) {
                                tripType.current.innerHTML += `<option selected value="${tripTypes[i]}">${tripTypes[i]}</option>`;
                            }
                            else {
                                tripType.current.innerHTML += `<option value="${tripTypes[i]}">${tripTypes[i]}</option>`;
                            }
                        }
                    }
                    if(data.bookings.tripType == 'One Way'){
                        returnDate.current?.style.setProperty('display', 'none');
                        returnText.current?.style.setProperty('display', 'none');
                    }



                })
                .catch((error: Error) => {
                    console.error("Error:", error);
                });


        }
        return () => loadBooking();
    }, []);

    const editBooking = (event: FormEvent) => {
        event.preventDefault();
        airports?.map((airport) => {
            if (airport['name'] == fromAirport.current?.value) {
                fromCountry = airport['country'];
                fromCity = airport['city'];
            }
            if (airport['name'] == toAirport.current?.value) {
                toCountry = airport['country'];
                toCity = airport['city'];
            }
        }
        );
        if (tripType.current?.value == 'One Way') {
            if (returnDate.current) {
                returnDate.current.value = '';
            }
        }

        fetch("http://localhost:8000/private/booking/" + booking._id, {
            method: "PUT",
            credentials: "include",
            headers: {
                "Content-Type": "application/json",
                "x-access-token": localStorage.getItem("token") || "",
            },

            body: JSON.stringify({
                fromAirport: fromAirport.current?.value,
                fromCountry: fromCountry,
                fromCity: fromCity,
                toAirport: toAirport.current?.value,
                toCountry: toCountry,
                toCity: toCity,
                classType: classType.current?.value,
                tripType: tripType.current?.value,
                departureDate: departureDate.current?.value,
                returnDate: returnDate.current?.value,
            }),
        })
            .then((response) => {
                if (response.status == 401) {
                    router.push("/login");
                }
                else if (response.status == 403) {
                    router.push("/login");
                }
                else {
                    router.push("/check-bookings");
                }
            })
            .catch((error) => {
                console.error("Error:", error);
            });
    };

    const handlereturn = () => {
        console.log(tripType.current?.value);

        if (tripType.current?.value == 'One Way') {
            console.log('inside one way')
            returnDate.current?.style.setProperty('display', 'none');
            returnText.current?.style.setProperty('display', 'none');
        }
        else if (tripType.current?.value == 'Round Trip') {
            console.log('inside round trip')
            returnDate.current?.style.setProperty('display', 'block');
            returnText.current?.style.setProperty('display', 'block');
        }
    }




    return (
        <>
            <Navbar />
            <div className="container">

                <h2>Booking details</h2>
                <div>
                    <form onSubmit={editBooking}>
                        <div className="row">
                            <div className="col-6">
                                <label>From Airport</label>
                                <input ref={fromAirport} className="form-control" list="datalistOptionsFrom" defaultValue={booking.fromAirport} placeholder="Type to search..." />
                                <datalist id="datalistOptionsFrom">
                                    {(typeof airports === 'undefined') ? (
                                        <option><p>loading...</p></option>) : (
                                        airports.map((airport) => (
                                            <>
                                                <option value={airport['name']}>
                                                    {airport['city']}, {airport['country']}
                                                </option>
                                                <input type="hidden" name={airport['name']} value={airport['country']} />
                                            </>
                                        )))}
                                </datalist>
                            </div>
                            <div className="col-6">
                                <label>To Airport</label>
                                <input ref={toAirport} className="form-control" list="datalistOptionsTo" defaultValue={booking.toAirport} placeholder="Type to search..." />
                                <datalist id="datalistOptionsTo">
                                    {(typeof airports === 'undefined') ? (
                                        <option><p>loading...</p></option>) : (
                                        airports.map((airport) => (
                                            <>
                                                <option value={airport['name']}>
                                                    {airport['city']}, {airport['country']}
                                                </option>
                                                <input type="hidden" name={airport['name']} value={airport['country']} />
                                            </>
                                        )))}
                                </datalist>
                            </div>
                        </div>
                        <br />
                        <hr />
                        <br />
                        <div className="row">
                            <div className="col-6">
                                <label>Trip Type</label>
                                <select onChange={handlereturn} ref={tripType} className="form-select" aria-label="Default select example">

                                </select>
                            </div>
                            <div className="col-6">
                                <label>Class Type</label>
                                <select ref={classType} className="form-select" aria-label="Default select example">

                                </select>
                            </div>
                        </div>
                        <br />
                        <hr />
                        <br />


                        <div className="row">
                            <div className="col-6">
                                <label>Departure Date</label>
                                <input ref={departureDate} type="date" className="form-control" defaultValue={booking.departureDate} />
                            </div>
                            <div className="col-6">
                              <label ref={returnText}>Return Date</label>
                                    <input ref={returnDate} type="date" className="form-control" defaultValue={booking.returnDate} /></div> 
                           
                        </div>
                        <input type="submit" className="btn btn-primary" value="Edit Booking" />

                    </form>

                </div>






            </div>

        </>
    );
}

export default EditBookingPage;
