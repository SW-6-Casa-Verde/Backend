import nodemailer from "nodemailer";

// 이메일 전송 설정
const transporter = nodemailer.createTransport({
  service: "Gmail",
  auth: {
    user: "dldbwls3566@gmail.com",
    pass: process.env.EMAIL_PASSWORD,
  },
});

// 주문 완료 후 이메일 전송 함수
async function sendOrderConfirmationEmail(orderId, buyerEmail, name, pay_method, price) {
  const emailBody = `
        <html>
        <body style ="width : 500px">
        <h1>${name}님, 결제가 완료되었습니다. </h1>
        <hr/>
				<div style="font-size :16px">
					<div>구매자명 : ${name}</div>
					<div>주문번호 : ${orderId}</div>
					<div>결제금액 : ${price}</div>
					<div>결제수단 : ${pay_method}</div>
				<div>
        </body>
        </html>`;

  const mailOptions = {
    from: "dldbwls3566@gmail.com",
    to: buyerEmail,
    subject: "[CasaVerde] 결제 완료 ",
    html: emailBody,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log("이메일이 성공적으로 전송되었습니다.");
  } catch (error) {
    console.error("이메일 전송 중 오류가 발생했습니다:", error);
  }
}

export { sendOrderConfirmationEmail };
