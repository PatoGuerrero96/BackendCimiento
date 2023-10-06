import nodemailer from "nodemailer" ;

const emailnotificacion = async (datos)=>{
    const transporter = nodemailer.createTransport({
        host:process.env.EMAIL_HOST,
        port:process.env.EMAIL_PORT,
        secure:false,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        }
      });
      const formatearFecha = (fecha) => {

        const nuevaFecha = new Date(fecha)
        nuevaFecha.setMinutes(nuevaFecha.getMinutes() + nuevaFecha.getTimezoneOffset())
        return new Intl.DateTimeFormat('es-CL', {dateStyle: 'long'}).format(nuevaFecha) }

      //Envia el email de registro con los datos

      const {nombrePaciente,
        nombreMotivoConsulta,
        nombreProfesional,
        fecha,
        mensaje,
        precio,
        horarioinicio,
        horariofin,email} = datos;
      const info =  await transporter.sendMail({
        from:`Cimiento clínico<${process.env.EMAIL_USER}>`,
        to:email,
        subject:"Propuesta de consulta",
        text:`el profesional ${nombreProfesional} quiere tomar tu caso`,
        html:`
 
        <h1 style="color:#077070;">Hola ${nombrePaciente}! </h1>
        <h2>Tenemos buenas noticias, el profesional ${nombreProfesional} quiere tomar tu motivo de consulta:${nombreMotivoConsulta}.</h2>
        <h4 style="color:#51B6B6"> El profesional dejo este mensaje para ti:${mensaje} </h4>
        <h4 style="color:#51B6B6"> La propuesta de fecha es la siguiente: ${formatearFecha(fecha)} desde: ${horarioinicio} hasta: ${horariofin} </h4>
        <h4 style="color:#51B6B6"> El valor de la consulta es: $${precio} </h4>
        <button style="background-color:#077070;" > <a style="color:#ffff" href="${process.env.FRONTEND}/paciente">Ir a la consulta</a></button>

        `,
      });
      console.log("mensaje enviado: %s", info.messageId);
};

export default emailnotificacion;