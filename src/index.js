import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './containers/App';
import Store from "./store/Store";
import {Provider} from 'react-redux';

const AppComponent = App.getComponent()
ReactDOM.render(
    <Provider store={Store.store}>
        <AppComponent />
    </Provider>, document.getElementById('root'));
