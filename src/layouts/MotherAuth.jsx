import React, { useEffect, useState } from "react";
import Firebase from "../fbConfig/fbConfig.js";

export const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null);

    useEffect(() => {
        Firebase.auth().onAuthStateChanged(user => {
            if (user) {
                user.getIdTokenResult()
                    .then(idTokenResult => {
                        setCurrentUser(idTokenResult.claims.employee)
                    })
            }
            else {
                setCurrentUser(null)
            }
        });
    }, []);

    return (
        <AuthContext.Provider
            value={{
                currentUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};