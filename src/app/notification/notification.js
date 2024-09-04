// App.js or index.js
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Notification from './Notification'; // Adjust the path as necessary
import History from './History'; // Adjust the path as necessary
import './index.css'; // Adjust the path as necessary

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Notification />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

ReactDOM.render(<App />, document.getElementById('root'));
