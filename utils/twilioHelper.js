const { accountSid, authToken } = require('./config');

const client = require('twilio')(accountSid, authToken);
const phoneno = '+12402066365';

const makeCall = async (mobileno) => {
    try {
        const call = await client.calls.create({
            url: 'http://demo.twilio.com/docs/voice.xml',
            to: `'+91${mobileno}'`,
            from: `${phoneno}`,
        });
        console.log('Call SID:', call.sid);
        return call;
    } catch (error) {
        if (error.code === 21219) {
            console.error(
                `Error: Phone number: '+91${mobileno}' is not verified.`
            );
        } else if (error.code === 20003) {
            console.error(
                `Error: Unauthenticated.`
            );
        } else {
            console.error('Error making call:', error);
        }
    }
};
module.exports = {
    makeCall,
};
