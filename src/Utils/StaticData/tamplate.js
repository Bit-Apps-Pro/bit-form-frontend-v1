/* eslint-disable max-len */
// eslint-disable-next-line import/prefer-default-export
export const fogotPassTamplate = `<p style="margin: '0in 0in 12pt'; font-family: 'Courier New', 'monospace'; fontsize: '8pt';"><span style="font-size: 12pt;"><strong>Hellow&nbsp;</strong>{customer_name}</span></p>
<p style="margin: '0in 0in 12pt'; font-family: 'Courier New', 'monospace'; fontsize: '8pt';"><strong><span style="font-size: 12pt;">To reset your password for {site_url},please Click the link below:</span></strong><a style="background: linear-gradient(145deg, #0069ff, #097fe6) !important; text-decoration: none !important; font-weight: 500; margin-top: 35px; color: #fff; text-transform: uppercase; font-size: 14px; padding: 10px 24px; display: inline-block; border-radius: 50px;margin-left:40%" href="{reset_password_url}">Reset Password</a></p>`

export const activationTamplate = `<p>Hellow {customer_name}</p>
<p>Please click on the button to complete the verification processs for {email}</p>
<p><a style="background: linear-gradient(145deg, #0069ff, #097fe6) !important; text-decoration: none !important; font-weight: 500; margin-top: 10px; color: #fff; text-transform: uppercase; font-size: 14px; padding: 10px 24px; display: inline-block; border-radius: 50px; margin-left: 35%;" title="VERIFY EMAIL ADDRESS" href="{activation_url}" target="_blank" rel="noopener">VERIFY EMAIL ADDRESS</a></p>`

export const activationMessage = '<pre>Your account has been activated successfully.&nbsp;You can now login.</pre>'
// export const dblOptinTamplate = `<h2 style="text-align:center">Please Confirm Your Submission !</h2>
// <p <a style="background: linear-gradient(145deg, #0069ff, #097fe6) !important;text-decoration: none !important; font-weight: 500; margin-top: 10px; color: #fff; text-transform: uppercase; font-size: 14px; padding: 10px 24px; display: inline-block; border-radius: 50px; margin-left: 35%;" href="{entry_confirmation_url}" target="_blank" rel="noopener">Confirm</a></p>
// <p>&nbsp;</p>`

export const dblOptinTamplate = `<h2 style="text-align:center">Please Confirm Your Submission !</h2>
<p><a style="background: linear-gradient(145deg, #0069ff, #097fe6) !important; text-decoration: none !important; font-weight: 500; margin-top: 10px; color: #fff; text-transform: uppercase; font-size: 14px; padding: 10px 24px; display: inline-block; border-radius: 50px; margin-left: 35%;" title="CONFIRM" href="{entry_confirmation_url}" target="_blank" rel="noopener">CONFIRM</a></p>`
