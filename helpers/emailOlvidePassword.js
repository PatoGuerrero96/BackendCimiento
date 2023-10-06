import nodemailer from "nodemailer";

const emailOlvidePassword = async (datos) => {
  try {
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: process.env.EMAIL_PORT,
      secure: false,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const { nombres, email, token } = datos;

    const info = await transporter.sendMail({
      from: `Cimiento clínico <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Recuperación de contraseña",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #077070; margin-bottom: 20px;">¡Hola ${nombres}!</h1>
          <h2 style="color: #51B6B6; margin-bottom: 20px;">Recupera tu ingreso a Cimiento Clínico</h2>
          <h3 style="color: #51B6B6; margin-bottom: 10px;">Instrucciones:</h3>
          <ol style="font-size: 16px; line-height: 1.5; margin-left: 20px;">
            <li>Ingresa en el botón que aparece abajo.</li>
            <li>Agrega una nueva contraseña.</li>
            <li>Ingresa al login de pacientes.</li>
            <li>Ingresa al sistema con tus nuevos datos.</li>
          </ol>
          <p style="text-align: center;">
            <a href="${process.env.FRONTEND}/olvide-password/${token}" style="display: inline-block; background-color: #077070; color: #fff; text-decoration: none; padding: 10px 20px; font-size: 16px; border-radius: 5px; margin-top: 20px;">
              Cambiar contraseña
            </a>
          </p>
        </div>
      `,
    });

    console.log("Mensaje enviado: %s", info.messageId);
  } catch (error) {
    console.error(error);
    // Manejar el error adecuadamente, puedes lanzar una excepción o realizar otra acción según tus necesidades.
  }
};

export default emailOlvidePassword;
