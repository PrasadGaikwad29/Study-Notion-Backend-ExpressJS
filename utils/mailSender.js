const nodeMailer = require("nodemailer");

const mailSender = async(email, title, body)=>{
    try {
        let transporter = nodeMailer.createTransport({
            host: process.env.MAIL_HOST,
            port: 587, // Use 465 for SSL, 587 for TLS
            secure: false, // Use true for SSL, false for TLS
            auth:{
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            }
        })

        let info = await transporter.sendMail({
            from: 'StudyMotion || Being Prasz -by Prasad',
            to: `${email}`,
            subject: `${title}`,
            html: `${body}`,

        })
        console.log(info);
        return info;                           
        
    } catch (error) {
       console.log(error.message);
       return { error: true, message: error.message };
        
    }
}
module.exports = mailSender;
