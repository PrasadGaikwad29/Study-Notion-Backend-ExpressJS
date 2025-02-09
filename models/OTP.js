const mongoose = require("mongoose");
const mailSender = require("../utils/mailSender");
const emailTemplate = require("../mail/templates/emailVerificationTemplate");

const OTPSchema = new mongoose.Schema({
	email: {
		type: String,
		required: true,
	},
	otp: {
		type: String,
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
		expires: 60 * 5, // The document will be automatically deleted after 5 minutes of its creation time
	},
});

// Define a function to send emails
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(
            email,
            "Verification Email",
            emailTemplate(otp)
        );
        // Check if mailResponse contains an error
        if (mailResponse.error) {
            console.log("Failed to send email:", mailResponse.message);
        } else if (mailResponse && mailResponse.response) {
            console.log("Email sent successfully: ", mailResponse.response);
        } else {
            console.log("Email sent, but no response received from mail server", mailResponse);
        }
    } catch (error) {
        console.log("Error occurred while sending email: ", error.message);
        if (error.response) {
            console.error("Error response from mail server: ", error.response);
        }
        throw error;
    }
}

// Define a post-save hook to send email after the document has been saved
OTPSchema.pre("save", async function (next) {
	console.log("New document saved to database");

	// Only send an email when a new document is created
	if (this.isNew) {
		try {
			await sendVerificationEmail(this.email, this.otp);
		} catch (error) {
			console.log("Failed to send verification email:", error);
		}
	}
	next();
});

const OTP = mongoose.model("OTP", OTPSchema);

module.exports = OTP;
    