import React from 'react';
import {BrowserRouter as Router, Routes, Route} from "react-router-dom";
import {Toaster} from "react-hot-toast";

import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Home/Dashboard";
import InterviewPrep from "./pages/InterviewPrep/InterviewPrep";
const App=() =>{
  return(
    <div>
      <Router>
        <Routes>
          {/* Default Route */}
          <Route path="/" element={<LandingPage/>}/>

          <Route path="/Login" element={<Login/>}/>
          <Route path="/SignUp" element={<SignUp/>}/>
          <Route path="/Dashboard" element={<Dashboard/>}/>
          <Route path="/Interview-prep/:sessionId" element={<InterviewPrep/>}/>
        </Routes>
      

      <Toaster
      toastOptions={{
        className:"",
        style:{
          fontSize:"13px",
        },
      }}
    />
    </Router>
    </div>
  );
}

export default App;