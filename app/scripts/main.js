import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';

// Polyfills
require('babel-polyfill');

document.addEventListener('DOMContentLoaded', () => {
    ReactDOM.render(<App />, document.getElementById('react'));
});
