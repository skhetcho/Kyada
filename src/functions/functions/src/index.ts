/*!

* Coded by Kyada for Teco Taxi

*/

import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

// firebase SendSMS function to be handled on firebase servers

exports.sendSMS = functions.https.onCall((message, context) => {
    'use strict';
    if (context && context.auth && context.auth.token && context.auth.token.employee !== true) {
        console.log("ATTEMPT_HACK_NEXT_CONSOLE_LOG_DETAILS_POTENTIAL_EXTERNAL");
        console.log(context);
        console.log(context.auth)
        return undefined;
    }
    else {
        return new Promise((resolve, reject) => {
            if (context && context.auth && context.auth.uid) {
                const accountSid = 'AC79a0bfe9a658c909192e77ee8c601f4c';
                const authToken = '85738128870ce24bee20b7fd7f10f00b';
                const client = require('twilio')(accountSid, authToken);

                if (message.to === null || message.bodyType === null) {
                    reject(false);
                }
                else {
                    let body;
                    if (message.bodyType == 1) {
                        body = "Hi" + (message.name ? (" " + message.name + ", ") : "! ") + "It's Teco Taxi. Your cab" + (message.cabNum ? ("# " + message.cabNum) + " will be here in about 10 minutes" : " will be here in about 10 minutes");
                    }
                    else if (message.bodyType == 2) {
                        body = "Hi" + (message.name ? (" " + message.name + ", ") : "! ") + "It's Teco Taxi. Your cab" + (message.cabNum ? ("# " + message.cabNum) + " will be here in about 10 minutes" : " will be here in about 5 minutes");
                    }
                    else if (message.bodyType == 3) {
                        body = "Hi" + (message.name ? (" " + message.name + ", ") : "! ") + "It's Teco Taxi. Your cab" + (message.cabNum ? ("# " + message.cabNum) + " is almost here!" : " is almost here!");
                    }
                    else {
                        reject(false);
                    }
                    client.messages
                        .create({
                            body: body,
                            from: '+12076058641',
                            to: message.to
                        })
                        .then(function () {
                            resolve(true);
                        })
                        .catch(function () {
                            reject(false);
                        });
                }
            }
        });
    }
});

exports.addUserAsAdmin = functions.https.onCall((data, context) => {
    if (context && context.auth && context.auth.token && context.auth.token.admin !== true) {
        console.log("ATTEMPT_HACK_NEXT_CONSOLE_LOG_DETAILS_POTENTIAL_INTERNAL")
        console.log(context);
        console.log(context.auth)
        return undefined;
    }
    else {
        // get user and add a custom claim (Admin)
        return admin.auth().getUserByEmail(data.email)
            .then((user: any) => {
                console.log(user);
                if (user && user['customClaims'] && user['customClaims']['admin'] === true) {
                    return new functions.https.HttpsError('cancelled', 'This admin already exists', 1);
                }
                else if (user && user['customClaims'] && (user['customClaims']['employee'] === true)) {
                    console.log("lolololo")
                    admin.auth().setCustomUserClaims(user.uid, {
                        admin: true,
                        employee: true,
                    })
                        .then(() => {
                            return { message: 'Admin have been added successfully' }
                        })
                        .catch(error => {
                            console.log("Internal error: " + error);
                        })
                    return true;
                }
                else {
                    return new functions.https.HttpsError('cancelled', 'user does not exist', 2);
                }
            })
            .catch((error) => {
                console.log(error);
            })
    }
});

exports.userData = functions.https.onCall((data, context) => {
    return admin.auth().getUserByEmail(data.user)
            .then((user: any) => {
                console.log(user)
            })
            .catch((error) => {
                console.log(error);
            })
});

exports.addUserAsEmployee = functions.https.onCall((data, context) => {
    if (context && context.auth && context.auth.token && context.auth.token.admin !== true) {
        console.log("ATTEMPT_HACK_NEXT_CONSOLE_LOG_DETAILS_POTENTIAL_INTERNAL")
        console.log(context);
        console.log(context.auth)
        return undefined;
    }
    else {
        // get user and add a custom claim (employee)
        return admin.auth().getUserByEmail(data.email).then(user => {
            return admin.auth().setCustomUserClaims(user.uid, {
                employee: true,
            })
        })
            .then(() => {
                return { message: 'Employee have been added successfully' }
            })
            .catch((error) => {
                console.log(error);
            })
    }
});