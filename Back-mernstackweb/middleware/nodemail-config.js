const nodemailer = require("nodemailer");

const user = process.env.GMAIL_ADRESS;
const password = process.env.GMAIL_PASSWORD;

const transport = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user,
    pass: password,
  },
  tls : { rejectUnauthorized: false }
});

module.exports.sendConfirmationEmail = (name, email, token) => {
  console.log("Check");
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "BankCommenter - Account activation",
      html: `<h1>Email Confirmation</h1>
        <h2>Hello ${name}</h2>
        <p>Thank you for subscribing. Please confirm your email by clicking on the following link</p>
        <a href=${process.env.CLIENT_URL}/auth/activation/${token}> Click to activate my account</a>
        </div>`,
    })
    .catch((err) => console.log(err));
};

module.exports.sendResetPasswordEmail = (name, email, token) => {
  console.log("reset");
  transport
    .sendMail({
      from: user,
      to: email,
      subject: "BankCommenter - Reset Password",
      html: `<h1>Reset Password</h1>
        <h2>Hello ${name}</h2>
        <p>Thanks to reset your password by clicking on the following link</p>
        <a href=${process.env.CLIENT_URL}/auth/password/reset/${token}> Click to reset my password</a>
        </div>`,
    })
    .catch((err) => console.log(err));
};
