const twilio = require('twilio');

const accountSid = process.env.TWILIO_ACCOUNT_SID; 
const authToken = process.env.TWILIO_AUTH_TOKEN; 
const twilioPhoneNumber = process.env.TWILIO_PHONE_NUMBER; 

const client = new twilio(accountSid, authToken);

const sendSms = (to, otp) => {
    const messageBody = `
    Hello! 👋

    Your OTP code is: **${otp}**

    Please use this code to complete your Login. This code is valid for 10 minutes. 

    Thank you for choosing our service!

    Best Regards,
TnpEcom Team.🤝
    `;

    return client.messages.create({
        body: messageBody.trim(),
        from: twilioPhoneNumber,
        to: to,
    });
};


module.exports = {
    sendSms,
};
