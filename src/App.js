/*

Coded by Zappy

*/
import React from "react";
import { createBrowserHistory } from "history";
import { BrowserRouter as Router, Route, Redirect, Switch } from "react-router-dom";

import { AuthProvider } from "./layouts/MotherAuth";
import PrivateRoute from "./components/PrivateRoute/PrivateRoute"

import "react-loader-spinner/dist/loader/css/react-spinner-loader.css"
import "bootstrap/dist/css/bootstrap.css";
import "assets/scss/now-ui-dashboard.scss?v=1.3.0";
import "assets/css/demo.css";


import AdminLayout from "layouts/Admin.jsx";
import Icons from "views/Components/Icons.jsx";
import AuthLayout from "layouts/Auth.jsx";
import { tsPropertySignature } from "@babel/types";


const hist = createBrowserHistory();

const App = () => {
    return (
        <AuthProvider>
            <Router history={hist}>
                <Switch>
                    <PrivateRoute
                        path="/admin"
                        component={AdminLayout}
                    />
                    <Route
                        path="/login"
                        component={AuthLayout}
                    />
                    <Route
                        path="/icons"
                        component={Icons}
                    />
                    <Redirect from='/' to='/admin/snotify' />
                </Switch>
            </Router>
        </AuthProvider>
    );
};

export default App;
