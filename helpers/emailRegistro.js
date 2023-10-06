import nodemailer from "nodemailer";

const emailRegistro = async (datos) => {
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

    const { nombres, email, token, password } = datos;

    const info = await transporter.sendMail({
      from: `Cimiento clínico <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Comprueba tu cuenta de PACIENTE en Cimiento Clínico",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #077070; margin-bottom: 20px;">¡Hola ${nombres}!</h1>
          <h2 style="color: #51B6B6; margin-bottom: 20px;">Comprueba tu cuenta de PACIENTE en Cimiento Clínico</h2>
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
            Tu cuenta está lista. Solo debes presionar el siguiente botón para confirmar tu cuenta.
          </p>
          <p style="font-size: 16px; line-height: 1.5; margin-bottom: 20px;">
          Email: ${email}<br>
          Contraseña: ${password}
        </p>
        <p style="font-size: 22px; line-height: 1.5; margin-top: 20px;">
        Ingresa al sistema con la contraseña entregada, accede a tu perfil y actualiza tu contraseña.
      </p>
          <p style="text-align: center;">
            <a href="${process.env.FRONTEND}/confirmar-cuenta-paciente/${token}" style="display: inline-block; background-color: #077070; color: #fff; text-decoration: none; padding: 10px 20px; font-size: 16px; border-radius: 5px;">
              Comprobar tu cuenta
            </a>
          </p>
          <p style="font-size: 16px; line-height: 1.5; margin-top: 20px;">
            Si no creaste esta cuenta, puedes ignorar este mensaje.
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

export default emailRegistro;
