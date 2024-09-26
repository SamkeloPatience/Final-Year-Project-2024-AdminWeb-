/*"use client"
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Notification from './page'; 
import History from '../history/page'; 


class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError() {
    return { hasError: true };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Error caught by boundary:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return <h1>Something went wrong.</h1>;
    }

    return this.props.children; 
  }
}

function MoveNotification() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Notification />} />
        <Route path="/history" element={<History />} />
      </Routes>
    </Router>
  );
}

ReactDOM.render(<MoveNotification />, document.getElementById('root'));*/
