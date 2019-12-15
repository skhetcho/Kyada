import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import * as Sentry from '@sentry/browser';

Sentry.init({
    dsn: "https://625c6c6caff14ef49619c43ae1d060c1@sentry.io/1856827",
    debug: true,
});

ReactDOM.render(<App />, document.getElementById('root'));