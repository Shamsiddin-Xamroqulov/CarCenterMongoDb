import nodemailer from "nodemailer";
import serverConfig from "../config.js";
const { EMAIL, NODE_MAILER } = serverConfig;

const createNodemailer = async (email, otp) => {
  const createTransport = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: EMAIL,
      pass: NODE_MAILER,
    },
  });

  const html = `
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Email Verification</title>
  </head>
  <body style="margin:0;padding:0;background-color:#f3f4f6;font-family:Arial,sans-serif;">
    <table width="100%" cellpadding="0" cellspacing="0" style="background-color:#f3f4f6;padding:30px 0;">
      <tr>
        <td align="center">
          <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 5px 25px rgba(0,0,0,0.1);">
            
            <!-- Header -->
            <tr>
              <td style="background:linear-gradient(90deg,#06b6d4,#3b82f6);padding:30px 20px;text-align:center;color:#ffffff;font-size:24px;font-weight:bold;">
                Library – Email Verification
              </td>
            </tr>

            <!-- Body -->
            <tr>
              <td style="padding:35px 25px;color:#1f2937;font-size:16px;line-height:1.6;">
                <p>Hello,</p>
                <p>We received a request to verify your email address. Please use the code below to complete the verification process:</p>

                <!-- OTP -->
                <div style="margin:25px 0;text-align:center;">
                  <span style="display:inline-block;padding:18px 35px;font-size:32px;font-weight:bold;color:#0ea5e9;background:#e0f2fe;border-radius:10px;letter-spacing:4px;font-family:'Courier New', Courier, monospace;">
                    ${otp}
                  </span>
                </div>

                <p style="font-size:14px;color:#6b7280;">If you did not request this, you can safely ignore this email.</p>

                <!-- Button -->
                <table align="center" cellpadding="0" cellspacing="0" style="margin:30px auto;">
                  <tr>
                    <td align="center">
                      <a href="http://127.0.0.1:5500/otp.html" style="display:inline-block;padding:14px 32px;background:linear-gradient(90deg,#06b6d4,#3b82f6);color:#ffffff;font-weight:bold;font-size:16px;border-radius:10px;text-decoration:none;">
                        Verify Email
                      </a>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Footer -->
            <tr>
              <td style="padding:25px;text-align:center;font-size:12px;color:#9ca3af;background:#f9fafb;">
                © ${new Date().getFullYear()} Library. All rights reserved.
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>
`;
  await createTransport.sendMail({
    from: EMAIL,
    to: email,
    subject: "Library email verify",
    html,
  });
};

export default createNodemailer;
