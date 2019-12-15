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
                const RC = require('ringcentral');
                var rcsdk = new RC({
                    server: 'https://platform.devtest.ringcentral.com',
                    appKey: 'V7rYmANzRBuRGOHstcNTuw',
                    appSecret: 'nnL15dl-QkOmpuKEctC1_AicAI8YdZQzycOBlUEyZXzQ'
                });
                var platform = rcsdk.platform();
                platform.login({
                    username: '+15872875381',
                    password: '75315948620sA',
                    extension: '101'
                })
                    .then(function () {
                        if (message.to === null || message === null) {
                            reject(false);
                        }
                        else {
                            platform.post('/account/~/extension/~/sms', {
                                from: { 'phoneNumber': '+15872875381' },
                                to: [{ 'phoneNumber': message.to }],
                                text: message.body,
                            })
                                .then(function () {
                                    resolve(true);
                                })
                                .catch(function () {
                                    reject(false);
                                });
                        }
                    });
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
        return admin.auth().getUserByEmail(data.email).then(user => {
            return admin.auth().setCustomUserClaims(user.uid, {
                admin: true,
                employee: true,
            })
        })
            .then(() => {
                return { message: 'Admin have been added successfully' }
            })
            .catch((error) => {
                console.log(error);
            })
    }
});

exports.addUserAsEmployee = functions.https.onCall((data, context) => {
    if (context && context.auth && context.auth.token && context.auth.token.admin !== true) {
        console.log("ATTEMPT_HACK_NEXT_CONSOLE_LOG_DETAILS_POTENTIAL_INTERNAL")
        console.log(context);
        console.log(context.auth)
        return undefined;
    }
    else {
        // get user and add a custom claim (Admin)
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