import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import {WelcomeComponent} from "@/app/(pages)/welcome-page/page";
import LoginPage from "@/app/(pages)/login/page";

const App = () => {
  return (
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/welcome-page" element={<WelcomeComponent />} />
          <Route path="/*" element={<Navigate to="/welcome-home" />} />
        </Routes>
      </Router>
  );
};

export default App;