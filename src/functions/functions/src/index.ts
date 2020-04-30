/*!

* Coded by Kyada for Teco Taxi

*/

//firebase imports
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

//initialize admin sdk
const serviceAccount = require("../src/kyada-core-756623444243.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kyada-core.firebaseio.com"
});

// initialize firestore db
const db = admin.firestore();
const increment = admin.firestore.FieldValue.increment(1)

// 3rd party modules
// const { GoogleSpreadsheet } = require('google-spreadsheet');

// 3rd module inits

// spreadsheet key is the long id in the sheets URL
// const doc = new GoogleSpreadsheet('1_OJFVP7fEKUYz9iYMbebOf2BmiGA-RHtujutzl2p5W8');



{/*
    COMMENTS:
    
    sendSMS: receive message information and initiate
    an SMS send request to the twilio SMS API
*/}
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
                else if (message.bodyType == 4 && message.messageBlock == '') {
                    reject(false);
                }
                else {
                    let body;
                    let data: any;
                    const d = new Date();
                    if (message.bodyType == 1) {
                        data = {
                            'bodyType1': increment
                        }
                        body = "Hi" + (message.name ? (" " + message.name + ", ") : "! ") + "It's Teco Taxi. Your cab" + (message.cabNum ? (" #" + message.cabNum) + " will be here in about 10 minutes. \n\nNote: This is a 'do not reply number'" : " will be here in about 10 minutes \n\nNote: This is a 'do not reply' number");
                    }
                    else if (message.bodyType == 2) {
                        data = {
                            'bodyType2': increment
                        }
                        body = "Hi" + (message.name ? (" " + message.name + ", ") : "! ") + "It's Teco Taxi. Your cab" + (message.cabNum ? (" #" + message.cabNum) + " will be here in about 5 minutes. \n\nNote: This is a 'do not reply number'" : " will be here in about 5 minutes. \n\nNote: This is a 'do not reply' number");
                    }
                    else if (message.bodyType == 3) {
                        data = {
                            'bodyType3': increment
                        }
                        body = "Hi" + (message.name ? (" " + message.name + ", ") : "! ") + "It's Teco Taxi. Your cab" + (message.cabNum ? (" #" + message.cabNum) + " is almost here! \n\nNote: This is a 'do not reply number'" : " is almost here! \n\nNote: This is a 'do not reply' number");
                    }
                    else if (message.bodyType == 4) {
                        data = {
                            'bodyType4': increment
                        }
                        body = "Hi" + (message.name ? (" " + message.name + ", ") : "! ") + "It's Teco Taxi." + (message.cabNum ? ("Your cab is #" + message.cabNum + ".") : "" ) + ("\n" + message.messageBlock + "\n\nNote: This is a 'do not reply number'");
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
                            //TODO:
                            // Change the static number "0" to be chosed dynamically
                            // this would allow scalability to choose the company per employee
                            // at the moment of login.
                            // if the length of the compnay is 1 then always choose index 0
                            // otherwise, harvest the index of the chosen company at the moment of login
                            // and pass that dynamically
                            //solve credentials error to allow data gathering

                            // @ts-ignore
                            const individualCollectionRef = db.collection(`${context.auth.token.company[0]}`).doc('messages').collection(`${context.auth.uid}`)
                            // @ts-ignore
                            const organizationCollectionRef = db.collection(`${context.auth.token.company[0]}`)

                            // const majorCountBatch = db.batch();
                            // const minorDocBatch = db.batch();

                            // in the following batch.set instructions some of them have merge: true
                            // because we are incrementing the counter thus we want to merge it with the
                            // previous data

                            // majorCountBatch.set(individualCollectionRef.doc('totalCounts'), data, { merge: true }); //increment the general total count of the specified body for an individual

                            // minorDocBatch.set(

                            //     // COMMENTS
                            //     // add message data firebase
                            //     // the hierarchy of the following code in firestore looks something like this
                            //     // 'company'/messages/user-uid/14-3-2020/9/doc-uid
                            //     // in the doc-uid the below data goes under
                            //     //
                            //     // 14-3-2020: is the sent message date
                            //     // 9: is which hour it has been send
                            //     // NOTE: those dates and times are based on UT/Greenwich
                            //     // 'company': is the name of the company in the db
                            //     individualCollectionRef
                            //         .doc(`${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`)
                            //         .collection(`${d.getHours()}`)
                            //         .doc(), {
                            //     timeStampExact: d,
                            //     bodyType: message.bodyType,
                            //     cabNum: message.cabNum,
                            //     clientName: message.name,
                            //     clientPhoneNumber: message.to
                            // })
                            individualCollectionRef.doc('totalCounts').set({
                                data
                            }, { merge: true })
                                .catch((error) => {
                                    console.log("individual general total count set failed: " + error)
                                })
                            individualCollectionRef
                                .doc(`${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`)
                                .collection(`${d.getHours()}`)
                                .doc()
                                .set({
                                    timeStampExact: d,
                                    bodyType: message.bodyType,
                                    cabNum: message.cabNum,
                                    clientName: message.name,
                                    clientPhoneNumber: message.to
                                })
                                .then(() => {
                                    individualCollectionRef
                                        .doc(`${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`)
                                        .collection("totalDailyCounts")
                                        .doc("bodyTypeCounts").set({
                                            data
                                        }, { merge: true })
                                        .catch((error) => {
                                            console.log("individual daily total count failed: " + error);
                                        })
                                })
                                .catch((error) => {
                                    console.log("individual new message detail set document failed: " + error)
                                })
                            organizationCollectionRef
                                .doc('messages')
                                .set({
                                    totalMessages: increment
                                }, { merge: true })
                                .catch((error) => {
                                    console.log("organization total general count failed: " + error);
                                })



                            // minorDocBatch.set(individualCollectionRef

                            //     // COMMENTS:
                            //     // the hierarchy of the following code looks something like the this
                            //     // 'company'/messages/user-uid/14-3-2020/totalDailyCounts/bodyTypeCounts/
                            //     // in here we have three counts, no additional unique id documents
                            //     // the three counts look something like:
                            //     // bodyType1: 3
                            //     // bodyType2: 0
                            //     // bodyType3: 1
                            //     // 14-3-2020: is the sent message date
                            //     // 9: is which hour it has been send
                            //     // NOTE: those dates and times are based on UT/Greenwich
                            //     // 'company': is the name of the company in the db

                            //     // for future implementations we can add other data types to be gathered
                            //     // under totalDailyCounts if we wished to. May the force be with you 

                            //     .doc(`${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`)
                            //     .collection("totalDailyCounts")
                            //     .doc("bodyTypeCounts"), data, { merge: true })

                            // here we can see a similar increment of the total number of messags per company
                            // majorCountBatch.set(organizationCollectionRef.doc('messages'), { totalMessages: increment }, { merge: true }); //increment the total count for the organization

                            // COMMENTS:
                            // batch would fail and not commit unless all the batch sets are successfuly
                            // preventing mishandled data and unset properties.
                            // this is important to ensure the data that has been captured makes sense
                            // accross all gathered data.
                            // NOTE: IF one of the sets fails the entire commit is fails but that doesn't guarantee
                            // that the sms hasn't sent. However, if the sms fails to send then definitely the batch
                            // setting would not execute
                            // minorDocBatch.commit()
                            //     .then(() => {
                            //         majorCountBatch.commit()
                            //             .catch((error) => {
                            //                 console.log("error with firestore sendSMS function - majorCountBatch.commit catch error: " + error)
                            //             })
                            //     })
                            //     .catch((error) => {
                            //         console.log("error with firestore sendSMS function - batch.commit catch error: " + error)
                            //     });
                        })
                        .then(() => {
                            console.log('completed')
                        })
                        .catch(function () {
                            reject(false);
                        });
                }
            }
        });
    }
});



{/*
    COMMENTS:
    
    addUserAsAdmin: receive pre-registered user email
    add new custom claim "admin: true" to grant admin
    privilages
*/}
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
                        company: user['customClaims']['company']
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
});



{/*
    userData: function log the user custom claim
    of a passed email address to this function

    ### remove this on production ###
*/}
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

{/*
    COMMENTS:
    
    addUserAsEmployee: receive registration data
    (email, password, etc...) and create user account
    add custom claims to the user profile which are
    "company: tecotaxi" hard coded from the call section
    "employee: true" for security reasons to prevent
    unauthorized user profile creation in case the
    database information has been leaked
*/}
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