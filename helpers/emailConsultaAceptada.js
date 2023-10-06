import nodemailer from "nodemailer";

const emailConsultaAceptada = async (datos) => {
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

    const {
      nombres,
      apellidos,
      tituloMotivoConsulta,
      fechaConsulta,
      tarifaConsulta,
      NombrePaciente,
      ApellidoPaciente,
      email,
      inicio,
      fin,
      id,
    } = datos;

    const fecha = new Date(fechaConsulta);
    const dia = fecha.getDate().toString().padStart(2, "0");
    const mes = (fecha.getMonth() + 1).toString().padStart(2, "0");
    const anio = fecha.getFullYear();

    const fechaFormateada = `${dia}/${mes}/${anio}`;

    const info = await transporter.sendMail({
      from: `Cimiento clínico <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Consulta Aceptada",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h1 style="color: #077070; margin-bottom: 20px;">¡Tu consulta ha sido aceptada!</h1>
          <p style="font-size: 16px; line-height: 1.5;">
            Estimado(a) ${nombres} ${apellidos},
          </p>
          <p style="font-size: 16px; line-height: 1.5;">
            Nos complace informarte que tu propuesta de consulta con el paciente ${NombrePaciente} ${ApellidoPaciente}  ha sido aceptada.
          </p>
          <p style="font-size: 16px; line-height: 1.5;">
            Detalles de la consulta:
          </p>
          <ul style="font-size: 16px; line-height: 1.5; padding-left: 20px;">
            <li><strong>Motivo de consulta:</strong> ${tituloMotivoConsulta}</li>
            <li><strong>Fecha y hora:</strong> ${fechaFormateada}, desde ${inicio} hasta ${fin}</li>
            <li><strong>Tarifa de la consulta:</strong> $${tarifaConsulta}</li>
          </ul>
          <p style="font-size: 16px; line-height: 1.5;">
            Para ingresar a la consulta, haz clic en el siguiente enlace:
          </p>
          <p style="text-align: center;">
            <a href="${process.env.FRONTEND}/profesional/consulta/${id}" style="display: inline-block; background-color: #077070; color: #fff; text-decoration: none; padding: 10px 20px; font-size: 16px; margin-top: 20px; border-radius: 5px;">
              Ir a la consulta
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

export default emailConsultaAceptada;