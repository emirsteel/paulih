import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { BrowserRouter as Router } from 'react-router-dom'; // Import BrowserRouter
import { AuthProvider } from './context/AuthContext'; // Import AuthProvider
import { AuthUserProvider } from './context/AuthUserContext'; // Adjust the import path
import { LiveStreamProvider } from './context/LiveStreamContext';

const rootElement = document.getElementById('root');
if (rootElement) {
  const root = ReactDOM.createRoot(rootElement); // Create a root for React 18

  root.render(
    <React.StrictMode>
      <Router> {/* Wrap the app in BrowserRouter */}
        <AuthProvider>
          <AuthUserProvider>
          <LiveStreamProvider>
            <App />
            </LiveStreamProvider>
          </AuthUserProvider>
        </AuthProvider>
      </Router>
    </React.StrictMode>
  );
}
