/*!

* Coded by Kyada for Teco Taxi

*/

//firebase imports
import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

//import google spreadsheet module and promisify
// const GoogleSpreadsheet = require('google-spreadsheet');
// const { promisify } = require('util');

//initialize admin sdk
const serviceAccount = require("../src/kyada-core-756623444243.json");
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://kyada-core.firebaseio.com"
});

// initialize firestore db
const db = admin.firestore();
const increment = admin.firestore.FieldValue.increment(1)

{/*
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
                else {
                    let body;
                    let data: any;
                    const d = new Date();
                    if (message.bodyType == 1) {
                        data = {
                            'bodyType1': increment
                        }
                        body = "Hi" + (message.name ? (" " + message.name + ", ") : "! ") + "It's Teco Taxi. Your cab" + (message.cabNum ? (" #" + message.cabNum) + " will be here in about 10 minutes. \n\nNote: This is a 'do not reply number'" : " will be here in about 10 minutes \n\nNote: This is a 'do not reply number'");
                    }
                    else if (message.bodyType == 2) {
                        data = {
                            'bodyType2': increment
                        }
                        body = "Hi" + (message.name ? (" " + message.name + ", ") : "! ") + "It's Teco Taxi. Your cab" + (message.cabNum ? (" #" + message.cabNum) + " will be here in about 5 minutes. \n\nNote: This is a 'do not reply number'" : " will be here in about 5 minutes. \n\nNote: This is a 'do not reply number'");
                    }
                    else if (message.bodyType == 3) {
                        data = {
                            'bodyType3': increment
                        }
                        body = "Hi" + (message.name ? (" " + message.name + ", ") : "! ") + "It's Teco Taxi. Your cab" + (message.cabNum ? (" #" + message.cabNum) + " is almost here! \n\nNote: This is a 'do not reply number'" : " is almost here! \n\nNote: This is a 'do not reply number'");
                    }
                    else {
                        reject(false);
                    }
                    // increment total count of messages per organization of the individual
                    // add new message data under the individual's collection
                    // each message should be a separate document
                    // the message document should include:
                    // receiver number
                    // selected message id (the one from above ^: either 1, 2, 3) ie: message.bodyType
                    // ^^^^^ this would allow us to observe when the dispatcher decides mostly to send the message
                    // the date of the message (per day only)

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

                            const batch = db.batch();

                            batch.set(individualCollectionRef.doc('totalCounts'), data, { merge: true }); //increment the total count of the specified body for an individual

                            batch.set(
                                individualCollectionRef
                                    .doc(`${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`)
                                    .collection(`${d.getHours()}`)
                                    .doc(), {
                                timeStampExact: d,
                                bodyType: message.bodyType,
                                cabNum: message.cabNum,
                                clientName: message.name,
                                clientPhoneNumber: message.to
                            })//add message data ub 

                            batch.set(individualCollectionRef
                                .doc(`${d.getDate()}-${d.getMonth() + 1}-${d.getFullYear()}`)
                                .collection("totalDailyCounts")
                                .doc("bodyTypeCounts"), data, { merge: true })
                            batch.set(organizationCollectionRef.doc('messages'), { totalMessages: increment }, { merge: true }); //increment the total count for the organization
                            batch.commit()
                                .catch((error) => {
                                    console.log("error with firestore sendSMS function - batch.commit catch error: " + error)
                                });
                        })
                        .then(async function () {
                            console.log("start here:")
                            // const doc = new GoogleSpreadsheet('1_OJFVP7fEKUYz9iYMbebOf2BmiGA-RHtujutzl2p5W8'); //this is messageFlow spreadsheet
                            // await promisify(doc.useServiceAccountAuth)(
                            //     {
                            //         "type": "service_account",
                            //         "project_id": "message-listsheet",
                            //         "private_key_id": "3d684dee86e369f0a34cd0ecdb62334b2e35e0bd",
                            //         "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQDObHWN0f+03JFS\n88zMNItIUlYqNB0/pnUuex9N/shGQo9ZwDdQFZ9e7Wa2owl7JpqMrMjhMSc3YMHf\niB2pCAxBhVMWxwgRcC/D16WxTSv1GIHW0MhA2xL3DkWbkKUhjpjHFzz0UnpDU/Qk\nvWt0H7VEfPLuCSUb4Yhw6WRhYqaEIsBCReyFJr8c5lG0Sdm8JJ1wfTH/wRwhj4jJ\nIeKK+4eeaO1rcUSSQ+twhWZ6QTadhSEPAZKYmO3oaC3yEAfzg15W0Qgl4ylWhbq6\n5z782tLhadCbpxHzt2LPg24fdijQ/th8GCu2cfkG2B6ex7XkvPRDRxxYV59OJE46\nUwnixkcBAgMBAAECggEAE4Af1inQVWvVgg0hu+l7fksM9HK05VDv1q1vRnp7Eqwc\nsmFcDaw6ld3+gI1utVwZveVgGr9T0Zb0lGMy+MdtBPmNNmR6CM+yK3b2olpvJyR4\nC5ebULPWxaZrAVMM+S++k2bzbVn8o9n4AUqFrqmE1yH9/xUNFOZdnIZn4w1N5sMy\ntKUvX9VqX2ou4eVFmrxto2B2BdFNA798dTDNxTjn3HlJrOKTxJMCyyH/nf/fwmSU\nxnA0GA+PWXtcCWGMQlSOEe61svrbfPE1yWX5YRZDpW4weiu5vhSP6LvEp39Cr2fW\nChz2VQATLrjs9WB4ZJglmcakMMgE7gVZsF+l+uJHEwKBgQD8jKU8KtMeVC2Ngl+k\nTygXvl7Bl1iVpo1mfHJYYRegM9PbLFKmOoNRRK6XwsNRTHVLUnFKLhfMFDuHdnBT\nhGkUIOJTRgHXqG8600GfN8EYcdRAz7T3ZN/7V8365qAqAyGw2hG2Hsgpvyz3CdYD\n35AY+eOMtIykwuBqmsE1+6ePnwKBgQDRPno9e+BhFCzF7ashZEYvKO6MC5DeUWr5\nLWTpr6lZma/MIbzHqH7x8yFdFQ7+SZWQrruw+/Uwen45hk1faUXzsBuc/pDa0rOK\nnB5jCEJvD9xT7cLRTVMiovBgnFwzVNyCYDtMjgvsgiqXpXrYtqpIC5Uc1jy2/dGM\nwo7NMGolXwKBgATyrHoVTLWXaJ0RJNaPRnXQoQKh+HZWIQcVARiCLnhRC6GLqMLg\n+pmpAtKuWi1JljK3lsihRo4VB2WMCH9aZMSkMEr5YCfdgPBiGzMHYJ0d/c6XQzBl\npY3DFqIHyrOIBCz22Mn8qGdI+5SLeMnyo1wZ6T9keizwNH1iMs7f81R5AoGAJMl5\nMEoRHsAvRvUL+yjn9e6aUeDOrWdfCUPj0/ngKjKM57SevfNvrhXyrazAIBDLzM4L\njYgeiVFf07k67SVS+Q7jK+zNhss4aYwdA4g2NdRyBgdtEuMnVJWU8UdMJnIq+nj0\ns/bdPc18s4CSYntq4JO4uYMo1Xs2Vir2dDio0L0CgYAebzw0yLq2wHeGegOc55bI\nPlSB51pAX7vQaMYZsQcTodBd/mWMqiaeiC5SODwdIUnvqz9NsVUZelOxPXNWUqaV\nHgbOvZrYM22v5y5wmVwFElOpB0Bz8pCpyeJ+2SzjXs44bOEDxzEXz7I5dmbe1LZs\nmtJRY91WtQOp6jo+YhweGg==\n-----END PRIVATE KEY-----\n",
                            //         "client_email": "sheets@message-listsheet.iam.gserviceaccount.com",
                            //         "client_id": "102918684930848164201",
                            //         "auth_uri": "https://accounts.google.com/o/oauth2/auth",
                            //         "token_uri": "https://oauth2.googleapis.com/token",
                            //         "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
                            //         "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/sheets%40message-listsheet.iam.gserviceaccount.com"
                            //     }
                            // );
                            // const info = await promisify(doc.getInfo)();
                            // const sheet = info.worksheets[0];
                            // console.log(`Title sheet: ${sheet.title}`);
                            // const row = {
                            //     // @ts-ignore
                            //     sender: admin.auth().getUser(context.auth.uid),
                            //     timeStamp: d,
                            //     bodyType: message.bodyType,
                            //     cabNumber: message.cabNum,
                            //     clientName: message.name,
                            //     clientPhoneNumber: message.to
                            // }
                            // await promisify(sheet.addRow)(row)
                        }
                        )
                        .catch(function () {
                            reject(false);
                        });
                }
            }
        });
    }
});

{/*
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
    // }
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