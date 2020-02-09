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
        return admin.auth().getUserByEmail(data.email)
            .then((user: any) => {
                if (user && user['customClaims'] && user['customClaims']['admin'] === true) {
                    return {
                        message: 'This admin email already exists',
                        code: 0
                    }
                }
                else if (user && user['customClaims'] && (user['customClaims']['employee'] === true)) {
                    return admin.auth().setCustomUserClaims(user.uid, {
                        admin: true,
                        employee: true,
                    })
                    .then(() => {
                        return {
                            message: 'Admin have been added successfully',
                        }
                    })
                    .catch(error => {
                        console.log("Internal error: " + error);
                    })
                }
                else {
                    return {
                        message: 'This user does not exist. Create a profile to the user first using the "Register a New User" form',
                        code: 1
                    }
                }
            })
            .catch((error) => {
                console.log(error);
                return {
                    message: 'This user does not exist. Create a profile to the user first using the "Register a New User" form',
                    code: 1
                }
            })
    }
    // }
});

exports.userData = functions.https.onCall((data, context) => {
    return admin.auth().getUserByEmail(data.user)
        .then((user: any) => {
            console.log(context)
            console.log(user['customClaims']);
            return { context }
        })
        .catch((error) => {
            console.log(error);
        })
});

exports.addUserAsEmployee = functions.https.onCall((data, context) => {
    //to be continued
    if (context && context.auth && context.auth.token && context.auth.token.admin !== true) {
        console.log("ATTEMPT_HACK_NEXT_CONSOLE_LOG_DETAILS_POTENTIAL_INTERNAL")
        console.log(context);
        console.log(context.auth)
        return undefined;
    }
    else {
        // get user and add a custom claim (employee)
        return admin.auth().getUserByEmail(data.email)
            .then((user: any) => {
                if (user && user['customClaims'] && (user['customClaims']['employee'] === true)) {

                    if (user['customClaims']['company']) {

                        let doesNotExist = true;

                        for (let i = 0; i < user['customClaims']['company'].length; i++) {
                            if (user['customClaims']['company'][i] === data.company) {
                                doesNotExist = false;
                            }
                        }
                        if (doesNotExist) {
                            let companiesList = user['customClaims']['company']
                            companiesList[user['customClaims']['company'].length] = data.company;
                            return admin.auth().setCustomUserClaims(user.uid, {
                                employee: true,
                                company: companiesList,
                            })
                                .then(() => {
                                    return { message: 'employee have been added successfully' }
                                })
                                .catch((error) => {
                                    console.log("employee adding function error: " + error);
                                })
                        }
                        else if (!doesNotExist) {
                            return {
                                message: 'This email is already associated to an employee in your company',
                                code: 0
                            }
                        }
                        else {
                            return {
                                message: 'Something went wrong. Please contact your administrator',
                                code: 1
                            }
                        }
                    }
                    else {
                        let companiesList = [];
                        companiesList[0] = data.company;
                        return admin.auth().setCustomUserClaims(user.uid, {
                            employee: true,
                            company: companiesList,
                        })
                    }
                }
                else {
                    return {
                        message: 'This user does not exist. Please contact your administrator',
                        code: 2
                    }
                }
            })
            .catch(() => {
                admin.auth().createUser({
                    email: data.email,
                    password: data.password,
                    displayName: data.name,
                    emailVerified: true,
                })
                    .then((userRecord) => {
                        let companiesList = [];
                        companiesList[0] = data.company;
                        return admin.auth().setCustomUserClaims(userRecord.uid, {
                            employee: true,
                            company: companiesList,
                        })
                            .catch((error) => {
                                console.log("account creation record retrieval error: " + error);
                            });
                    })
                    .catch((error) => {
                        console.log("account creation error: " + error);
                    });
                    return {
                        message: 'Your employee account has been added successfully!',
                    }
            })
    }
});