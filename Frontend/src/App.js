import "./css/global.css";
import React from "react";
import { Switch, Route } from "react-router-dom";

import ScrollToTop from "./components/ScrollToTop";
import Login from "./pages/auth/Login";
import Signup from "./pages/auth/Signup";
import Home from "./pages/public/Home";
import ShowTimes from "./pages/public/ShowTimes";
import DetailMovie from "./components/DetailMovie";
import Dashboard from "./pages/admin/Dashboard"
import ImportMovie from "./components/ImportMovie";
import Booking from "./pages/booking/Booking";
import Payment from "./pages/booking/Payment";
import MyBooking from "./pages/booking/MyBooking";

import Test from "./components/Test"

function App() {
  return (
    <div className="App">
      <ScrollToTop />
      <Switch>
        <Route path="/signup" component={Signup} />
        <Route path="/login" component={Login} />
        <Route exact path="/" component={Home} />
        <Route path="/detailMovie/:id" component={DetailMovie} />
        <Route path="/booking/:id" component={Booking}/>
        <Route path="/myBooking" component={MyBooking}/>
        <Route path="/payment/:bookingId/:showTimeId" component={Payment}/>
        <Route path="/showTimes" component={ShowTimes} />
        <Route path="/dashboard" component={Dashboard} />
        <Route path="/importMovieFromApi" component={ImportMovie} />

        <Route path="/test" component={Test} />
      </Switch>
    </div>
  );
}

export default App;
