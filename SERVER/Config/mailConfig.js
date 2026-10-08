const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 2525,
    secure: false,

    auth: {
        user: process.env.BREVO_USER,
        pass: process.env.BREVO_PASS,
    },

    family: 4,
    debug: true,

    tls: {
        rejectUnauthorized: false,
        minVersion: "TLSv1.2",
    },
});

transporter.verify((error) => {
    if (error) {
        console.log("SMTP Error:", error);
    } else {
        console.log("SMTP Connected");
    }
});

module.exports = transporter;