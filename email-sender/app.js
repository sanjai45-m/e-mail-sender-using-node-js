const express = require('express');
const nodemailer = require('nodemailer');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();

// Use body-parser to parse form data
app.use(bodyParser.urlencoded({ extended: true }));

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Serve the HTML file on the root route
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Configure the email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'sanjaim202@gmail.com',  // Replace with your Gmail address
        pass: 'lwwu vcor uzdm luau'    // Replace with your Gmail app password
    }
});

// Handle form submissions
app.post('/send-email', (req, res) => {
    const { name, email, recipientEmail, message } = req.body;

    // Email to the website holder
    const mailOptionsToHolder = {
        from:recipientEmail,
        to: 'sanjaim202@gmail.com', // Replace with your email address
        subject: `New Contact Us Message from ${name}`,
        html: `
            <h1>Contact Us Message</h1>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <p>${message}</p>
        `
    };

    // Confirmation email to the user (recipient)
    const mailOptionsToRecipient = {
        from: 'sanjaim202@gmail.com',
        to: recipientEmail,
        subject: 'Thank you for contacting us!',
        html: `
            <h1>Thank You!</h1>
            <p>Dear ${name},</p>
            <p>Thank you for showing interest in our website. We have received your message and will get back to you shortly.</p>
            <p><strong>Your Message:</strong></p>
            <p>${message}</p>
            <p>Best regards,</p>
            <p>Your Company Name</p>
        `
    };

    // Send the email to the website holder
    transporter.sendMail(mailOptionsToHolder, (error, info) => {
        if (error) {
            console.error('Error sending email to holder:', error);
            res.send('<p style="color: red;">Failed to send email. Please try again later.</p>');
            return;
        }

        console.log('Email sent to holder:', info.response);

        // Send the confirmation email to the recipient
        transporter.sendMail(mailOptionsToRecipient, (error, info) => {
            if (error) {
                console.error('Error sending email to recipient:', error);
                res.send('<p style="color: red;">Failed to send confirmation email. Please try again later.</p>');
            } else {
                console.log('Confirmation email sent to recipient:', info.response);
                res.send('<p style="color: green;">Email sent successfully! A confirmation email has also been sent to your address.</p>');
            }
        });
    });
});

// Start the server and open the browser automatically
const PORT = 3000;
app.listen(PORT, async () => {
    console.log(`Server is running on http://localhost:${PORT}`);
    
    // Dynamically import and use the 'open' module
    const open = await import('open');
    open.default(`http://localhost:${PORT}`);
});
