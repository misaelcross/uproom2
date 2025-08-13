import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';

// SimpleBar imports
import 'simplebar-react/dist/simplebar.min.css';

// ResizeObserver polyfill for browsers that don't support it
import ResizeObserver from 'resize-observer-polyfill';
window.ResizeObserver = ResizeObserver;

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);