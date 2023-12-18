"use client";
import React, { useRef, useEffect, useState, useContext } from "react";
import "./components/navbar";
import Navbar from "./components/navbar";
import { AirportsContext } from "./layout";




function Index() {
  const [message, setMessage] = useState<null | string>(null);
  const [error, setError] = useState<null | string>(null);
  const airports = useContext(AirportsContext);





  const returnText = useRef<HTMLHeadingElement>(null);
  const fromAirport = useRef<HTMLInputElement>(null);
  const toAirport = useRef<HTMLInputElement>(null);
  const classType = useRef<HTMLSelectElement>(null);
  const tripType = useRef<HTMLSelectElement>(null);
  const departureDate = useRef<HTMLInputElement>(null);
  const returnDate = useRef<HTMLInputElement>(null);
  const flagFromDiv = useRef<HTMLDivElement>(null);
  const flagToDiv = useRef<HTMLDivElement>(null);
  let fromCountry = '';
  let toCountry = '';
  let fromCity = '';
  let toCity = '';




  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (tripType.current?.value == 'One Way') {
      if (returnDate.current) {
          returnDate.current.value = '';
      }
  }

    fetch("http://localhost:8000/private/booking", {
      method: "POST",
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
          setError("please login first to book a flight");
        }
        else if (response.status == 403) {
          setError("your session has expired please login again");
        }
        else {
          setMessage("flight booked successfully");
          //resetting the form
          fromAirport.current!.value = '';
          toAirport.current!.value = '';
          classType.current!.value = '';
          tripType.current!.value = '';
          departureDate.current!.value = '';
          returnDate.current!.value = '';
          flagFromDiv.current!.innerHTML = '';
          flagToDiv.current!.innerHTML = '';

        }
      })
      .catch((error) => {
        console.error("Error:", error);
      });
  };



  const handlereturn = () => {
    if (tripType.current?.value == 'One Way') {
      returnDate.current?.style.setProperty('display', 'none');
      returnText.current?.style.setProperty('display', 'none');
    }
    else {
      returnDate.current?.style.setProperty('display', 'block');
      returnText.current?.style.setProperty('display', 'block');
    }
  }





  // fetching flags from the restcountries api
  const countries: { name: { common: string }, flags: { png: string } }[] = [];


    fetch('https://restcountries.com/v3.1/all?fields=name,flags')
      .then(response => response.json())
      .then(data =>
        countries.push(...data)
      )
      .catch(err => console.log(err));


  const handleFlagFrom = () => {
    airports.map((airport) => {
      if (airport['name'] == fromAirport.current?.value) {
        fromCountry = airport['country'];
        fromCity = airport['city'];
      }
    })
    const selectedCountryFrom = countries.find(country => country.name.common === fromCountry);
    const flagFrom = selectedCountryFrom?.flags.png ?? null;
    if (flagFrom) {
      if (flagFromDiv.current) {
        flagFromDiv.current.innerHTML = `<img src="${flagFrom}" alt="flag" width="50px">`;
      }

    }
  }
  const handleFlagTo = () => {
    airports.map((airport) => {
      if (airport['name'] === toAirport.current?.value) {
        toCountry = airport['country'];
        toCity = airport['city'];
      }
    })
    const selectedCountryTo = countries.find(country => country.name.common === toCountry);
    const flagTo = selectedCountryTo?.flags.png ?? null;
    if (flagTo) {
      if (flagToDiv.current) {
        flagToDiv.current.innerHTML = `<img src="${flagTo}" alt="flag" width="50px">`;
      }

    }
  }

  return (
    <>
      <AirportsContext.Provider value={airports}>

        <Navbar />
        <div className="container">
          {message && <p className="alert alert-success">{message}</p>}
          {error && <p className="alert alert-danger">{error}</p>}


          <h5>Book a Flight</h5>
          <hr />
          <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-6">
                <h6>From:</h6>
              </div>
              <div className="col-6">
                <h6>To:</h6>
              </div>
            </div>
            <div className="row">
              <div className="col-1 text-right">
                <div ref={flagFromDiv}></div>
              </div>
              <div className="col-4 text-left">
                <input onChange={handleFlagFrom} className="form-control" list="datalistOptionsFrom" ref={fromAirport} placeholder="Type to search..." />
                <datalist id="datalistOptionsFrom">
                  {airports.map((airport) => (
                    <>
                      <option value={airport['name']}>
                        {airport['city']}, {airport['country']}
                      </option>
                      <input type="hidden" name={airport['name']} value={airport['country']} />
                    </>

                  ))}
                </datalist>
              </div>
              <div className="col-1 text-center">
                <i className="fa fa-solid fa-plane"></i>
              </div>
              <div className="col-1">
                <div ref={flagToDiv}></div>
              </div>
              <div className="col-4">
                <input onChange={handleFlagTo} className="form-control" list="datalistOptionsTo" ref={toAirport} placeholder="Type to search..." />
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
                <h6>Trip Type:</h6>
              </div>
              <div className="col-6">
                <h6>Class Type:</h6>
              </div>
            </div>

            <div className="row">
              <div className="col-1">

              </div>

              <div className="col-4" >
                <select onChange={handlereturn} ref={tripType} className="form-select" aria-label="Default select example">
                  <option value="Round Trip">Round Trip</option>

                  <option value="One Way">One Way</option>
                </select>
              </div>
              <div className="col-1">

              </div>
              <div className="col-1">

              </div>
              <div className="col-4">
                <select ref={classType} className="form-select" aria-label="Default select example">

                  <option value="Economy">Economy</option>
                  <option value="Business">Business</option>
                  <option value="First">First</option>
                </select>
              </div>
            </div>
            <br />

            <hr />
            <br />

            <div className="row">
              <div className="col-6">
                <h6>Departure date:</h6>
              </div>
              <div className="col-6">
                <h6 ref={returnText}>Return date:</h6>

              </div>
            </div>


            <div className="row">
              <div className="col-1">

              </div>

              <div className="col-4">

                <input ref={departureDate} type="date" className="form-control" />
              </div>
              <div className="col-1">

              </div>
              <div className="col-1">

              </div>
              <div className="col-4">
                <input ref={returnDate} type="date" className="form-control" />
              </div>
            </div>
            <br />
            <div className="row">
              <div className="col">
                <div className="me-auto">
                  <input type="submit" className="btn btn-primary" value="book a flight" />
                </div>

              </div>
            </div>
          </form>
        </div>
      </AirportsContext.Provider>
    </>
  );
}

export default Index;
