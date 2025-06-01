import { env } from '~/config/environment'
const brevo = require('@getbrevo/brevo')

let apiInstance = new brevo.TransactionalEmailsApi()
let apiKey = apiInstance.authentications['apiKey']
// let apiKey = brevo.ApiClient.instance.authentications['apiKey']
apiKey.apiKey = env.BREVO_API_KEY

const sendEmail = async (recipientEmail, customSubject, htmlContent) => {
  // Khởi tại một đôi tượng sendSmtpEmail với những thông tin cần thiết
  let sendSmtpEmail = new brevo.SendSmtpEmail()

  // Tài khoan gửi email (admin email)
  sendSmtpEmail.sender = {
    email: env.ADMIN_EMAIL_ADDRESS,
    name: env.ADMIN_EMAIL_NAME
  }

  // Tài khoản nhận email (người dùng)
  // 'to' phải là 1 array để sau chúng ta có thể tùy biến gửi 1 email tới nhiều user tùy tính năng dự án
  sendSmtpEmail.to = [{ email: recipientEmail }]

  //Tiêu đề email
  sendSmtpEmail.subject = customSubject

  // Nội dung emal dạng html
  sendSmtpEmail.htmlContent = htmlContent

  // Gọi hành động gửi mail
  // sendTransacEmail sẽ trả về 1 promise
  return apiInstance.sendTransacEmail(sendSmtpEmail)
}

export const BrevoProvider = {
  sendEmail
}