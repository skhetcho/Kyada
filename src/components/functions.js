export const sendSMS = (message) => {
    return new Promise((resolve, reject) => {
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
    });
}