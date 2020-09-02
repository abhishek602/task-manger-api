const sgMail = require('@sendgrid/mail');



sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const sendWelcomeEmail = (email, name) => {
    
    sgMail.send({
      to: email,
      from: "abhi636kumar@gmail.com",
      subject: "Thanks for joining us",
        text: `Welcome to the app, ${name}. Let me know how you get along with the app.`,
    //   html: if u want
    });

}

const sendCancelationEmail = (email, name) => {
    
    sgMail.send({
      to: email,
      from: "abhi636kumar@gmail.com",
      subject: "OOps something went wrong!",
      text: `Hey!! ${name} Goodbye, See you Later.`,
    });

};


module.exports = {
  sendWelcomeEmail,
  sendCancelationEmail,
};



// const sendGridAPIKey =
//   "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";