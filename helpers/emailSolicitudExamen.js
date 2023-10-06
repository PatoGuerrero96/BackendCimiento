import nodemailer from "nodemailer" ;


const emailSolicitudExamen = async (datos) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: process.env.EMAIL_PORT,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const { nombrePaciente, nombreProfesional, email, motivo, opciones, documentoUrl } = datos;
  const info = await transporter.sendMail({
    from: `Cimiento clínico <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Solicitud de exámenes",
    text: `El profesional ${nombreProfesional} solicitó estos exámenes`,
    html: `
      <html>
        <head>
          <style>
            body {
              font-family: Arial, sans-serif;
            }
  
            h1 {
              color: #077070;
              font-size: 24px;
              margin-bottom: 16px;
            }
  
            h2 {
              font-size: 18px;
              margin-bottom: 16px;
            }
  
            p {
              margin-bottom: 8px;
            }
  
          </style>
        </head>
        <body>
          <h1>Hola ${nombrePaciente}!</h1>
          <h2>El profesional ${nombreProfesional} luego de revisar tu motivo de consulta "${motivo}" solicita que te realices los siguientes exámenes:</h2>
          <ul>
            ${opciones.map((opcion) => `<li>${opcion}</li>`).join("")}
          </ul>
          <a style="background-color:#077070;color:#fff;padding:10px 20px;border:none;border-radius:5px;text-decoration:none;font-size:16px;" class="button" href="${documentoUrl}" download>DESCARGAR PDF</a>
          <p>Si ya leíste este correo, puedes ignorar este mensaje.</p>
        </body>
      </html>
    `,
  });
  console.log("Mensaje enviado: %s", info.messageId);
};

export default emailSolicitudExamen;