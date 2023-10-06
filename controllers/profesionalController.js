import generarjwt from "../helpers/generarjwt.js";
import Profesional from "../models/Profesional.js";
import generarId from "../helpers/generarid.js";
import emailOlvidePro from "../helpers/emailOlvidePro.js"
import { uploadImage, deleteImage, uploadDocument } from "../utils/cloudinary.js";
import fs from "fs-extra"
import MotivoConsulta from "../models/MotivoConsulta.js";
import Enfermedad from "../models/Enfermedades.js";
import Paciente from "../models/Paciente.js";
import Alergia from "../models/Alergias.js";
import AntecedentesFam from "../models/Antecedentesfam.js";
import Farmaco from "../models/Farmaco.js";
import Hospitalizaciones from "../models/Hospitalizaciones.js";
import Urgencias from "../models/Urgencias.js"
import Quirurgico from "../models/Quirurgico.js";
import Consulta from "../models/Consultas.js";
import emailnotificacion from "../helpers/emailnotificacion.js";
import Tarifa from "../models/Tarifa.js";
import Tarifaglobal from "../models/TarifaGlobal.js";
import HorarioPaciente from "../models/HorarioPaciente.js";
import Educacion from "../models/Educacion.js";
import Experiencia from "../models/Experiencia.js";
import Especialidad from "../models/Especialidad.js";
import sjcl from "sjcl";
import SeccionesTarifa from "../models/SeccionesTarifa.js";
import SeguimientoMotivo from "../models/SeguimientoMotivo.js";
import Examen from "../models/examen.js";
import Farmacoprevios from "../models/Farmacosprevios.js";
import Medidageneral from "../models/MedidasGenerales.js";
import Receta from "../models/Receta.js";
import Examensolicitado from "../models/Examensolicitado.js";
import emailSolicitudExamen from "../helpers/emailSolicitudExamen.js";
import emailRecetaPaciente from "../helpers/emailRecetaPaciente.js";
import Controles from "../models/Controles.js";
import nodemailer from "nodemailer" ;
import RecetaMagistral from "../models/recetamagistral.js";
import Signosalarma from "../models/Signosalarma.js";
const clave = "1234567890123456";

function desencriptarDatoSJCL(datoEncriptado) {
  const decryptedData = sjcl.decrypt(clave, datoEncriptado);
  return decryptedData;
}
const perfil=(req, res )=>{

    const {profesional}=req;
    res.json( profesional)
    };

const confirmar = async(req,res)=>{
const {token} = req.params
const usuarioConfirmar = await Profesional.findOne({token:token})
if(!usuarioConfirmar){
 const error = new Error("Token invalido")
 return res.status(400).json({msg: error.message});   
}
try {
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado=true;   
    await usuarioConfirmar.save();
    res.json( {msg:'Cuenta Profesional confirmada'} )
} catch (error) {
    console.log(error)
}

    };

const autenticar = async (req, res) => {

    const {email, password }  =req.body;
    //comprobar si el usuario existe
    const usuario= await Profesional.findOne({email: email});
    if(!usuario){
        const error = new Error("El usuario no existe en nuestro sistema");
        return res.status(404).json( {msg: error.message} );
    }
// Comprobar si el usuario esta confirmado
if(!usuario.confirmado){
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json(  {msg: error.message});
}

// Revisar el password
if (await usuario.comprobarPassword(password)){
    //Autenticar Usuario
    res.json( 
    {   _id: usuario._id,
        nombres:usuario.nombres,
        email:usuario.email,
        tokenPro: generarjwt(usuario.id) }
       
       );
 
}else{
    const error = new Error("Datos incorrectos");
    return res.status(403).json(  {msg: error.message});
}

}   

// Funcion olvide contraseña

const olvidePassword = async (req, res)=>{
    const {email}= req.body;

    const existePro =  await Profesional.findOne({email:email});
    if(!existePro){
        const error = new Error(" El Administrador no existe");
        return res.status(400).json({msg: error.message});
    }
    try {
        existePro.token = generarId();
        await existePro.save();
        // Enviar email con instrucciones para cambiar contraseña

        emailOlvidePro({
            email,
            nombres: existePro.nombres,
            token: existePro.token,
        })
        res.json({msg:"Revise su correo electrónico para recuperar su contraseña"})
    } catch (error) {
        console.log(error)
    }


};
const comprobarToken = async(req, res)=>{
const {token} = req.params;

const tokenValido = await Profesional.findOne({token:token});

if(tokenValido){
    //eltoken es valido y el usuario existe
    res.json({msg:"Token Válido para recuperar contraseña"})
}else{
    const error = new Error("Token no valido");
    return res.status(400).json({msg: error.message});
}

};
const nuevoPassword = async(req, res)=>{
const {token}= req.params;
const  {password}= req.body;

const profesional = await Profesional.findOne({token:token});
if(!profesional){
    const error = new Error("Hubo un error");
    return res.status(400).json({msg:error.message});
}
try {
    profesional.token=null;
    profesional.password=password;
    await profesional.save()
    res.json({msg: "Password modificado correctamente"});
} catch (error) {
    console.log(error)
}
};



const actualizarPerfil = async (req, res) =>{
    const profesional = await Profesional.findById(req.params.id);
    if(!profesional){
        const error = new error("Hubo un error");
        return res.status(400).json({msg: error.message})
    }
    
    try{
        profesional.telefono = req.body.telefono;
        profesional.presentacion = req.body.presentacion
        profesional.celulartrabajo = req.body.celulartrabajo
        profesional.emailtrabajo = req.body.emailtrabajo
        profesional.numeroregistrosalud = req.body.numeroregistrosalud
        const profesionalActualizado = await profesional.save();
        res.json(profesionalActualizado)
    
    } catch(error){
        console.log(error)
    }
    
    }
    
    const actualizarPassword = async (req,res)=>{
        //leer los datos
        const {id} = req.profesional;
        const {pwd_actual, pwd_nuevo } = req.body;
    
        //comprobar que el paciente existe
        const profesional = await Profesional.findById(id);
        if(!profesional){
            const error = new Error("Hubo un error");
            return res.status(400).json({msg: error.message});
    
        }
        //Comprobar password
        if(await profesional.comprobarPassword(pwd_actual)){
            //Almacenar nueva password
            profesional.password =  pwd_nuevo;
            await profesional.save();
            res.json({msg: "Contraseña Almacenada correctamente"});
        }
        else{
            const error = new Error("El password actual es incorrecto");
            return res.status(400).json({msg: error.message})
    
        }
        
    }
    const subirFotoPerfil = async (req,res)=>{
        const profesional = await Profesional.findById(req.params.id);
        if(!profesional){
            const error = new Error("Hubo un error");
            return res.status(400).json({msg: error.message});
    
        }
           if(!profesional.image.public_id === null || undefined){
            await deleteImage(profesional.image.public_id)
           }
         
           if(profesional.image.public_id){
            await deleteImage(profesional.image.public_id)
           }
           
       
    
        try {
            if(req.files?.image){
                const result = await uploadImage(req.files.image.tempFilePath)
                profesional.image={
                    public_id : result.public_id,
                    secure_url: result.secure_url,
                }
                console.log(result)
                 await fs.unlink(req.files.image.tempFilePath)
                }else{
                    const error = new Error("Seleccione una imagen para subir");
                        return res.status(400).json({msg: error.message})
                }
            const profesionalActualizado = await profesional.save();
        res.json(profesionalActualizado)
        } catch (error) {
            console.log(error)
        }
    
    }

    const Obtenermotivosdeconsulta = async (req, res) => {
      try {
        const motivos = await MotivoConsulta.aggregate([
          {
            $lookup: {
              from: "horariopacientes",
              localField: "paciente",
              foreignField: "paciente",
              as: "horarios",
            },
          },
          {
            $lookup: {
              from: "pacientes",
              localField: "paciente",
              foreignField: "_id",
              as: "paciente",
            },
          },
          {
            $sort: { fecha: -1 },
          },
        ]);
    
        res.json(motivos);
      } catch (err) {
        console.error(err.message);
        res.status(500).send("Error al obtener");
      }
    };

    const Obtenerunmotivodeconsulta = async (req, res) => {
        try {
            const { id } = req.params;
            // Buscar el motivo de consulta por ID
            const motivo = await MotivoConsulta.findById(id);
            if (!motivo) {
              return res.status(404).json({ msg: 'Motivo de consulta no encontrado' });
            }
        
            // Obtener el paciente relacionado al motivo de consulta
            const paciente = await Paciente.findById(motivo.paciente);
        
            if (!paciente) {
              return res.status(404).json({ msg: 'Paciente no encontrado' });
            }
        
            // Obtener las enfermedades del paciente
            const enfermedades = await Enfermedad.find({ paciente: paciente._id });
        
            if (!enfermedades) {
              return res.status(404).json({ msg: 'No se encontraron enfermedades para este paciente' });
            }
              // Obtener las alergias del paciente
    const alergias = await Alergia.find({ paciente: paciente._id });

          if (!alergias) {
              return res.status(404).json({ msg: 'No se encontraron alergias para este paciente' });
             }
             const antecedentesfam = await AntecedentesFam.find({ paciente: paciente._id });

          if (!antecedentesfam) {
              return res.status(404).json({ msg: 'No se encontraron alergias para este paciente' });
             }
             const farmaco = await Farmaco.find({ paciente: paciente._id });

             if (!farmaco) {
                 return res.status(404).json({ msg: 'No se encontraron alergias para este paciente' });
                }
                const quirurgico = await Quirurgico.find({ paciente: paciente._id });

            if (!quirurgico) {
                return res.status(404).json({ msg: 'No se encontraron alergias para este paciente' });
                }
            const hospitalizaciones = await Hospitalizaciones.find({ paciente: paciente._id });

            if (!hospitalizaciones) {
                return res.status(404).json({ msg: 'No se encontraron alergias para este paciente' });
                }
            const urgencia = await Urgencias.find({ paciente: paciente._id });

            if (!urgencia) {
            return res.status(404).json({ msg: 'No se encontraron alergias para este paciente' });
            }  
            
            const horariopaciente = await HorarioPaciente.find({ paciente: paciente._id });

            if (!horariopaciente) {
            return res.status(404).json({ msg: 'No se encontraron alergias para este paciente' });
            }   

    // Agregar el paciente, sus enfermedades y alergias al motivo de consulta
            motivo.paciente = paciente;
            motivo.enfermedades = enfermedades;
            motivo.alergias = alergias;
            motivo.antecedentesfam = antecedentesfam;
            motivo.farmaco = farmaco;
            motivo.quirurgico = quirurgico;
            motivo.hospitalizaciones = hospitalizaciones;
            motivo.urgencia = urgencia;
            motivo.horariopaciente = horariopaciente;
        
            // Devolver el motivo de consulta con el paciente y sus enfermedades
            return res.json(motivo);
          } catch (error) {
            console.error(error.message);
            res.status(500).send('Error en el servidor');
          }
      };
const generarNotificacion = async (req, res) => {
  try {
    const {
      idMotivoConsulta,
      idPaciente,
      mensaje,
      horarioinicio,
      horariofin,
      fecha,
      precio,
    } = req.body;
    const { id } = req.profesional;
    const paciente = await Paciente.findById(idPaciente);
    const nombrePaciente = desencriptarDatoSJCL(paciente.nombres); // Desencriptar el nombre del paciente
    const email = paciente.email;
    const motivoConsulta = await MotivoConsulta.findById(idMotivoConsulta);
    const nombreMotivoConsulta = motivoConsulta.titulo;
    const profesional = await Profesional.findById(id);
    const nombreProfesional = profesional.nombres;

    const consulta = new Consulta({
      paciente: idPaciente,
      motivoconsulta: idMotivoConsulta,
      profesional,
      mensaje,
      horarioinicio,
      horariofin,
      fecha,
      precio,
    });
    await consulta.save();
    emailnotificacion({
      nombrePaciente,
      nombreMotivoConsulta,
      nombreProfesional,
      fecha,
      mensaje,
      precio,
      horarioinicio,
      horariofin,
      email,
    });

    res.status(200).json({ message: "Notificación generada" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error al generar la notificación" });
  }
};


     const verConsultas = async (req, res)  => {
        try {
            const consultas = await Consulta.find(); 
            res.status(200).json(consultas);
          } catch (error) {
            console.log(error);
            res.status(500).json({ message: "Error al obtener las consultas." });
          }
     }
     const obtenerTarifa= async (req, res)=>{
        try { 
            const tarifas =  await Tarifa.find().where('profesional').equals(req.profesional);
        res.json(tarifas); } 
        catch (error) {
        console.log(error);
           }        
        };
      const obtenerTarifaGlobal= async (req, res)=>{
            try { 
                const tarifas =  await Tarifaglobal.find();
            res.json(tarifas); } 
            catch (error) {
            console.log(error);
               }        
            };
      const verListaConsultas = async (req, res)  => {
        try {
            const consultas = await Consulta.find()
            .populate('profesional')
            .populate('motivoconsulta').populate('tarifaGlobal').populate('tarifa')
                    res.status(200).json(consultas);
                  } catch (error) {
                    console.log(error);
                    res.status(500).json({ message: "Error al obtener las consultas." });
                  }
             } 
      const Consultascalendario = async (req, res)  => {
      try {
          const consultas = await Consulta.find()
          .populate('profesional')
          .populate('motivoconsulta').populate('tarifaGlobal').populate('tarifa').populate('paciente');

              // Desencriptar los datos del paciente en cada consulta
              const consultasDesencriptadas = consultas.map((consulta) => {
                const paciente = consulta.paciente;
                const rutDesencriptado = desencriptarDatoSJCL(paciente.rut);
                const desencriptadoNombres = desencriptarDatoSJCL(paciente.nombres);
                const desencriptadoApellidos = desencriptarDatoSJCL(paciente.apellidos);
            
                const perfilPaciente = {
                  ...paciente.toObject(),
                  rut: rutDesencriptado,
                  nombres: desencriptadoNombres,
                  apellidos: desencriptadoApellidos,
                };
                return {
                  ...consulta.toObject(),
                  paciente: perfilPaciente,
                };
                
              });
              res.status(200).json(consultasDesencriptadas);
                } catch (error) {
                  console.log(error);
                   res.status(500).json({ message: "Error al obtener las consultas." });
                }
            }            
    const consultarConsultasAceptadas = async (req, res)  => {
        const profesional = await Profesional.findById(req.params.id);
        const consultasproAceptadas = await Consulta.find({ 
           profesional: profesional._id,
           leido: false, 
           estado: 'pagado'
        });
        const consultasPendientes = await Consulta.find({ 
            profesional: profesional._id,
            leido: false, 
            estado: 'pendiente'
         });
         const consultasRechazadas = await Consulta.find({ 
            profesional: profesional._id,
            leido: false, 
            estado: 'rechazada'
         });
         const consultasFinalizadas = await Consulta.find({ 
          profesional: profesional._id,
          leido: false, 
          estado: 'finalizado'
       });
        

          try {
            // Actualizar el campo `leido` de las consultas encontradas
            await Consulta.updateMany({ _id: { $in: consultasproAceptadas.map(c => c._id) } }, { leido: true });
          } catch (err) {
            console.error(err);
            return res.status(500).send('Error al actualizar el estado de leido de las consultas');
          }
          try {

            await Consulta.updateMany({ _id: { $in: consultasPendientes.map(c => c._id) } }, { leido: true });
          } catch (err) {
            console.error(err);
            return res.status(500).send('Error al actualizar el estado de leido de las consultas');
          }
          try {
            await Consulta.updateMany({ _id: { $in: consultasRechazadas.map(c => c._id) } }, { leido: true });
          } catch (err) {
            console.error(err);
            return res.status(500).send('Error al actualizar el estado de leido de las consultas');
          }
          try {
            await Consulta.updateMany({ _id: { $in: consultasFinalizadas.map(c => c._id) } }, { leido: true });
          } catch (err) {
            console.error(err);
            return res.status(500).send('Error al actualizar el estado de leido de las consultas');
          }
        
              
    }
    const VerMasEnConsultaPro = async (req, res) => {
        try {
          const { id } = req.params;
      
          // Buscar la consulta por ID
          const consulta = await Consulta.findById(id);
          if (!consulta) {
            return res.status(404).json({ msg: 'Consulta no encontrada' });
          }
      
          // Obtener el profesional relacionado a la consulta
          const profesional = await Profesional.findById(consulta.profesional);
          if (!profesional) {
            return res.status(404).json({ msg: 'Profesional no encontrado' });
          }
      
          const paciente = await Paciente.findById(consulta.paciente);
          if (!paciente) {
            return res.status(404).json({ msg: 'Paciente no encontrado' });
          }else{
            
          }
      
          const motivoconsulta = await MotivoConsulta.findById(consulta.motivoconsulta);
          if (!motivoconsulta) {
            return res.status(404).json({ msg: 'Motivo de consulta no encontrado' });
          }
      
          const tarifaGlobal = await Tarifaglobal.findById(consulta.tarifaGlobal);
          const tarifa = await Tarifa.findById(consulta.tarifa);
      
    
          const rutDesencriptado = desencriptarDatoSJCL(paciente.rut);
          const desencriptadoNombres = desencriptarDatoSJCL(paciente.nombres);
          const desencriptadoApellidos = desencriptarDatoSJCL(paciente.apellidos);

          const pacienteDesencriptado = {
            ...paciente.toObject(),
            rut: rutDesencriptado,
            nombres:desencriptadoNombres,
            apellidos:desencriptadoApellidos
          };
          
          const consultaConPacienteDesencriptado = {
            ...consulta.toObject(),
            paciente: pacienteDesencriptado
          };
          
          consultaConPacienteDesencriptado.profesional = profesional;
          consultaConPacienteDesencriptado.motivoconsulta = motivoconsulta;
          consultaConPacienteDesencriptado.tarifaGlobal = tarifaGlobal;
          consultaConPacienteDesencriptado.tarifa = tarifa;
          
          return res.json(consultaConPacienteDesencriptado);
        } catch (error) {
          console.error(error.message);
          res.status(500).send('Error en el servidor');
        }
      };
      const agregarTarifaProfesional = async (req, res) => {
        const { nombre,valor,tiempo, seccionTarifaId } = req.body;
        const profesionalId = req.profesional._id;
      
        let seccionTarifa = null;
        if (seccionTarifaId) {
          seccionTarifa = await SeccionesTarifa.findById(seccionTarifaId); // buscar la sección de tarifa por su ID
        }
      
        const tarifa = new Tarifa({
          nombre,
          valor,
          tiempo,
          seccionTarifa,
          profesional: profesionalId
        });
      
        try {
          const tarifaAlmacenada = await tarifa.save();
          res.json(tarifaAlmacenada);
        } catch (error) {
          console.log(error);
        }
      };
  const obtenerTarifaProfesional= async (req, res)=>{
          const tarifa =  await Tarifa.find().where('profesional').equals(req.profesional).sort({createdAt: -1});
      
          res.json(tarifa);  
      };
      const eliminarTarifaProfesional = async (req, res) => {
        const { id } =req.params;
        const tarifa= await Tarifa.findById(id);
        if(!tarifa){
            return res.status(404).json({msg:"No encontrado"})
        }
        
        if(tarifa.profesional._id.toString() !== req.profesional._id.toString()){
            return res.json({msg: "Accion no válida"});
        }        
        try {
            await tarifa.deleteOne();
            res.json({msg:"Tarifa eliminada"});
        } catch (error) {
            console.log(error)
        }
      }
      const actualizarTarifa= async (req, res)=>{
        const { id } =req.params;
        const tarifa = await Tarifa.findById(id);
        if(!tarifa){
            return res.status(404).json({msg:"No encontrado"})
        }
        if(tarifa.profesional._id.toString() !== req.profesional._id.toString()){
            return res.json({msg: "Accion no válida"});
        }       
 
       tarifa.nombre = req.body.nombre || tarifa.nombre;
       tarifa.valor = req.body.valor || tarifa.valor;
       tarifa.tiempo = req.body.tiempo || tarifa.tiempo;
       tarifa.seccionTarifa = req.body.seccionTarifaId || tarifa.seccionTarifa;

       
        try {
            const tarifaActualizado = await tarifa.save();
            res.json(tarifaActualizado);
        } catch (error) {
            console.log(error)        
        }         
        };

        const agregarEducacionProfesional= async(req,res)=>{
          const educacion= new Educacion(req.body);
          
          educacion.profesional = req.profesional._id;
          
          try {
              const educacionAlmacenado  = await educacion.save();
              res.json(educacionAlmacenado);
          } catch (error) {
              console.log(error);
          }
          };
      const obtenerEducacionProfesional= async (req, res)=>{
              const educacion =  await Educacion.find().where('profesional').equals(req.profesional).sort({createdAt: -1});
          
              res.json(educacion);  
          };
      const eliminarEducacionProfesional= async (req, res)=>{
              const { id } =req.params;
              const educacion= await Educacion.findById(id);
              if(!educacion){
                  return res.status(404).json({msg:"No encontrado"})
              }
              
              if(educacion.profesional._id.toString() !== req.profesional._id.toString()){
                  return res.json({msg: "Accion no válida"});
              }        
              try {
                  await educacion.deleteOne();
                  res.json({msg:"Motivo de consulta eliminado"});
              } catch (error) {
                  console.log(error)
              }
          
          };
        
          const actualizarEducacion= async (req, res)=>{
            const { id } =req.params;
            const educacion = await Educacion.findById(id);
            if(!educacion){
                return res.status(404).json({msg:"No encontrado"})
            }
            if(educacion.profesional._id.toString() !== req.profesional._id.toString()){
                return res.json({msg: "Accion no válida"});
            }       
            //Actualizar motivo de consulta
           educacion.nombre = req.body.nombre || educacion.nombre;
           educacion.fechainicio = req.body.fechainicio || educacion.fechainicio;
           educacion.fechafin = req.body.fechafin || educacion.fechafin;
            try {
                const educacionActualizado = await educacion.save();
                res.json(educacionActualizado);
            } catch (error) {
                console.log(error)        
            }         
            };



          const agregarExperienciaProfesional= async(req,res)=>{
              const experiencia= new Experiencia(req.body);
              
              experiencia.profesional = req.profesional._id;
              
              try {
                  const experienciaAlmacenado  = await experiencia.save();
                  res.json(experienciaAlmacenado);
              } catch (error) {
                  console.log(error);
              }
              };
          const obtenerExperienciaProfesional= async (req, res)=>{
                  const experiencia =  await Experiencia.find().where('profesional').equals(req.profesional).sort({createdAt: -1});
              
                  res.json(experiencia);  
              };
          const eliminarExperienciaProfesional= async (req, res)=>{
                  const { id } =req.params;
                  const experiencia= await Experiencia.findById(id);
                  if(!experiencia){
                      return res.status(404).json({msg:"No encontrado"})
                  }
                  
                  if(experiencia.profesional._id.toString() !== req.profesional._id.toString()){
                      return res.json({msg: "Accion no válida"});
                  }        
                  try {
                      await experiencia.deleteOne();
                      res.json({msg:"Motivo de consulta eliminado"});
                  } catch (error) {
                      console.log(error)
                  }
              
              };       
          const actualizarExperiencia= async (req, res)=>{
                const { id } =req.params;
                const experiencia = await Experiencia.findById(id);
                if(!experiencia){
                    return res.status(404).json({msg:"No encontrado"})
                }
                if(experiencia.profesional._id.toString() !== req.profesional._id.toString()){
                    return res.json({msg: "Accion no válida"});
                }       
                //Actualizar motivo de consulta
               experiencia.nombre = req.body.nombre || experiencia.nombre;
               experiencia.fechainicio = req.body.fechainicio || experiencia.fechainicio;
              experiencia.fechafin = req.body.fechafin || experiencia.fechafin;
                try {
                    const experienciaActualizado = await experiencia.save();
                    res.json(experienciaActualizado);
                } catch (error) {
                    console.log(error)        
                }         
              };



              const agregarEspecialidadProfesional= async(req,res)=>{
                const especialidad= new Especialidad(req.body);
                
                especialidad.profesional = req.profesional._id;
                
                try {
                    const especialidadAlmacenado  = await especialidad.save();
                    res.json(especialidadAlmacenado);
                } catch (error) {
                    console.log(error);
                }
                };
            const obtenerEspecialidadProfesional= async (req, res)=>{
                    const especialidad =  await Especialidad.find().where('profesional').equals(req.profesional).sort({createdAt: -1});
                
                    res.json(especialidad);  
                };
            const eliminarEspecialidadProfesional= async (req, res)=>{
                    const { id } =req.params;
                    const especialidad= await Especialidad.findById(id);
                    if(!especialidad){
                        return res.status(404).json({msg:"No encontrado"})
                    }
                    
                    if(especialidad.profesional._id.toString() !== req.profesional._id.toString()){
                        return res.json({msg: "Accion no válida"});
                    }        
                    try {
                        await especialidad.deleteOne();
                        res.json({msg:"Motivo de consulta eliminado"});
                    } catch (error) {
                        console.log(error)
                    }
                
                };       
            const actualizarEspecialidad= async (req, res)=>{
                  const { id } =req.params;
                  const especialidad = await Especialidad.findById(id);
                  if(!especialidad){
                      return res.status(404).json({msg:"No encontrado"})
                  }
                  if(especialidad.profesional._id.toString() !== req.profesional._id.toString()){
                      return res.json({msg: "Accion no válida"});
                  }       
                  //Actualizar motivo de consulta
                 especialidad.nombre = req.body.nombre || especialidad.nombre;
                  try {
                      const especialidadActualizado = await especialidad.save();
                      res.json(especialidadActualizado);
                  } catch (error) {
                      console.log(error)        
                  }         
                };


                const agregarSeccionTarifa= async(req,res)=>{
                    const seccionestarifa= new SeccionesTarifa(req.body);
                    seccionestarifa.profesional = req.profesional._id;
                                        
                    try {
                        const seccionesAlmacenado  = await seccionestarifa.save();
                        res.json(seccionesAlmacenado);
                    } catch (error) {
                        console.log(error);
                    }
                    };
                const obtenerSeccionTarifa= async (req, res)=>{
                        const seccionestarifa =  await SeccionesTarifa.find().where('profesional').equals(req.profesional).sort({createdAt: -1});
                    
                        res.json(seccionestarifa);  
                    };
               const eliminarSeccionTarifa = async (req, res) => {
                        const { id } = req.params;
                      
                        try {
                          // Eliminar sección de la tabla de secciones tarifa
                          const seccion = await SeccionesTarifa.findById(id);
                          if (!seccion) {
                            return res.status(404).json({ msg: "No encontrado" });
                          }
                      
                          if (seccion.profesional.toString() !== req.profesional._id.toString()) {
                            return res.json({ msg: "Acción no válida" });
                          }
                      
                          // Obtener todas las tarifas que tienen la sección a eliminar
                          const tarifas = await Tarifa.find({ seccionTarifa: seccion._id });
                      
                          // Actualizar la referencia a la sección por null en las tarifas correspondientes
                          await Tarifa.updateMany(
                            { seccionTarifa: seccion._id },
                            { $set: { seccionTarifa: null } }
                          );
                      
                          // Eliminar la sección de la tabla de secciones tarifa
                          await seccion.deleteOne();
                      
                          res.json({ msg: "Sección eliminada" });
                        } catch (error) {
                          console.log(error);
                          res.status(500).json({ msg: "Error en el servidor" });
                        }
                    };
                      
                const actualizarSeccionTarifa= async (req, res)=>{
                      const { id } =req.params;
                      const especialidad = await SeccionesTarifa.findById(id);
                      if(!especialidad){
                          return res.status(404).json({msg:"No encontrado"})
                      }
                      if(especialidad.profesional._id.toString() !== req.profesional._id.toString()){
                          return res.json({msg: "Accion no válida"});
                      }       
                      
                     especialidad.nombre = req.body.nombre || especialidad.nombre;
                     especialidad.color = req.body.color || especialidad.color;
                      try {
                          const especialidadActualizado = await especialidad.save();
                          res.json(especialidadActualizado);
                      } catch (error) {
                          console.log(error)        
                      }         
                    };

                const obtenertarifaGlobales= async (req, res)=>{
                        const tarifasglobales =  await  Tarifaglobal.find().sort({createdAt: -1});
                    
                        res.json(tarifasglobales);  
                    };
                const actualizarvisibilidadCelular= async (req, res)=>{
                      try {
                          const id = req.params.id;
                          const profesional= await Profesional.findById(id);
                          if (!profesional) {
                            return res.status(404).send('Profesional no encontrado');
                          }
                          profesional.celularvisible = !profesional.celularvisible;
                          const profesionalActualizado = await profesional.save();
                          res.status(200).send(profesionalActualizado);
                        } catch (error) {
                          console.error(error);
                          res.status(500).send('Hubo un error al actualizar la visibilidad del perfil');
                        }
                    };
                const actualizarvisibilidadCorreo= async (req, res)=>{
                        try {
                            const id = req.params.id;
                            const profesional= await Profesional.findById(id);
                            if (!profesional) {
                              return res.status(404).send('Profesional no encontrado');
                            }
                            profesional.correovisible = !profesional.correovisible;
                            const profesionalActualizado = await profesional.save();
                            res.status(200).send(profesionalActualizado);
                          } catch (error) {
                            console.error(error);
                            res.status(500).send('Hubo un error al actualizar la visibilidad del perfil');
                          }
                      };

                      const ObtenerInformacionPaciente = async (req, res) => {
                        try {
                            const { id } = req.params;
                            // Buscar la consulta por su ID
                            const consultas = await Consulta.findById(id);
                            if (!consultas) {
                              return res.status(404).json({ msg: 'consulta no encontrada' });
                            }
                            const profesional = await Profesional.findById(consultas.profesional);
                        
                            if (!profesional) {
                              return res.status(404).json({ msg: 'Profesional no encontrado' });
                            }
                            const motivoconsulta = await MotivoConsulta.findById(consultas.motivoconsulta)
                        
                            if (!motivoconsulta) {
                              return res.status(404).json({ msg: 'motivoconsulta no encontrado' });
                            }

                            // Obtener el seguimiento de los motivos 
                            const seguimientomotivo = await SeguimientoMotivo.find({ motivoconsulta: motivoconsulta._id });
                        
                            if (!seguimientomotivo) {
                              return res.status(404).json({ msg: 'No se encontraron seguimientos para este motivo' });
                            }

                            // Obtener el paciente relacionado con la consulta
                            const paciente = await Paciente.findById(consultas.paciente);
                        
                            if (!paciente) {
                              return res.status(404).json({ msg: 'Paciente no encontrado' });
                            }
                        
                            // Obtener las enfermedades del paciente
                            const enfermedades = await Enfermedad.find({ paciente: paciente._id });
                        
                            if (!enfermedades) {
                              return res.status(404).json({ msg: 'No se encontraron enfermedades para este paciente' });
                            }
                             // Obtener los farmacos del paciente
                             const farmacos = await Farmaco.find({ paciente: paciente._id });
                        
                             if (!farmacos) {
                               return res.status(404).json({ msg: 'No se encontraron farmacos para este paciente' });
                             }
                             // Obtener los examenes del paciente
                             const examenes = await Examen.find({ paciente: paciente._id }).populate('enfermedad');
                        
                             if (!examenes) {
                               return res.status(404).json({ msg: 'No se encontraron enfermedades para este paciente' });
                             }
                              // Obtener las alergias del paciente
                          const alergias = await Alergia.find({ paciente: paciente._id });
                
                          if (!alergias) {
                              return res.status(404).json({ msg: 'No se encontraron alergias para este paciente' });
                             }
                             const antecedentesfam = await AntecedentesFam.find({ paciente: paciente._id });
                
                          if (!antecedentesfam) {
                              return res.status(404).json({ msg: 'No se encontraron alergias para este paciente' });
                             }
                             const farmaco = await Farmaco.find({ paciente: paciente._id });
                
                             if (!farmaco) {
                                 return res.status(404).json({ msg: 'No se encontraron alergias para este paciente' });
                                }
                                const farmacoprevio = await Farmacoprevios.find({ paciente: paciente._id });
                
                             if (!farmacoprevio) {
                                 return res.status(404).json({ msg: 'No se encontraron alergias para este paciente' });
                                }
                                const quirurgico = await Quirurgico.find({ paciente: paciente._id });
                
                            if (!quirurgico) {
                                return res.status(404).json({ msg: 'No se encontraron alergias para este paciente' });
                                }
                            const hospitalizaciones = await Hospitalizaciones.find({ paciente: paciente._id });
                
                            if (!hospitalizaciones) {
                                return res.status(404).json({ msg: 'No se encontraron alergias para este paciente' });
                                }
                            const urgencia = await Urgencias.find({ paciente: paciente._id });
                
                            if (!urgencia) {
                            return res.status(404).json({ msg: 'No se encontraron alergias para este paciente' });
                            }  
                            
                            const horariopaciente = await HorarioPaciente.find({ paciente: paciente._id });
                
                            if (!horariopaciente) {
                            return res.status(404).json({ msg: 'No se encontraron alergias para este paciente' });
                            } 

                            const rutDesencriptado = desencriptarDatoSJCL(paciente.rut);
                            const desencriptadoNombres = desencriptarDatoSJCL(paciente.nombres);
                            const desencriptadoApellidos = desencriptarDatoSJCL(paciente.apellidos);
                
                    // Agregar el paciente, sus enfermedades y alergias a la consulta
                            consultas.paciente = paciente;
                            consultas.paciente.rut = rutDesencriptado;
                            consultas.paciente.nombres = desencriptadoNombres;
                            consultas.paciente.apellidos = desencriptadoApellidos;
                            consultas.profesional = profesional;
                            consultas.enfermedades = enfermedades;
                            consultas.farmacos = farmacos;
                            consultas.examenes = examenes;
                            consultas.alergias = alergias;
                            consultas.antecedentesfam = antecedentesfam;
                            consultas.farmaco = farmaco;
                            consultas.farmacoprevio=farmacoprevio
                            consultas.quirurgico = quirurgico;
                            consultas.hospitalizaciones = hospitalizaciones;
                            consultas.urgencia = urgencia;
                           consultas.horariopaciente = horariopaciente;
                           consultas.motivoconsulta=motivoconsulta
                           consultas.seguimientomotivo=seguimientomotivo
                        
                            // Devolver la consulta con el paciente y sus enfermedades
                            return res.json(consultas);
                          } catch (error) {
                            console.error(error.message);
                            res.status(500).send('Error en el servidor');
                          }
                      };
                    //Seccion de diagnosticos o antecentes morbidos
                      const ActualizarEnfermedadesPaciente = async (req, res) => {
                        const enfermedad = await Enfermedad.findById(req.params.id);
                        if (!enfermedad) {
                          const error = new error("Hubo un error");
                          return res.status(400).json({ msg: error.message });
                        }
                        try {
                          const datosOriginales = {
                            nombre: enfermedad.nombre,
                            fechadiagnostico: enfermedad.fechadiagnostico,
                            tratamiento: enfermedad.tratamiento,
                            ultimocontrol: enfermedad.ultimocontrol,
                            obsdiagnostico: enfermedad.obsdiagnostico
                          };
                      
                          enfermedad.nombre = req.body.nombre;
                          enfermedad.fechadiagnostico = req.body.fechadiagnostico;
                          enfermedad.tratamiento = req.body.tratamiento;
                          enfermedad.ultimocontrol = req.body.ultimocontrol;
                          enfermedad.obsdiagnostico = req.body.obsdiagnostico;
                      
                          const enfermedadActualizada = await enfermedad.save();
                      
                          // Verificar si alguno de los datos se modificó
                          const datosModificados =
                            enfermedad.nombre !== datosOriginales.nombre ||
                            enfermedad.fechadiagnostico !== datosOriginales.fechadiagnostico ||
                            enfermedad.tratamiento !== datosOriginales.tratamiento ||
                            enfermedad.ultimocontrol !== datosOriginales.ultimocontrol ||
                            enfermedad.obsdiagnostico !== datosOriginales.obsdiagnostico;
                      
                          // Cambiar el valor de guardadoporpaciente a false si hay cambios
                          if (datosModificados) {
                            enfermedad.guardadoporpaciente = false;
                            // Verificar si se modificó la fecha de diagnóstico
                            if (enfermedad.fechadiagnostico !== datosOriginales.fechadiagnostico) {
                              enfermedad.pacientefechadiagnostico = false;
                            }
                            await enfermedad.save();
                          }
                      
                          res.json(enfermedadActualizada);
                        } catch (error) {
                          console.log(error);
                        }
                      };
                      const GuardarEnfermedadPaciente = async (req, res) => {
                        const { pacienteId, nombre, fechadiagnostico, tratamiento, ultimocontrol, obsdiagnostico } = req.body;

                        try {
                          // Verificar si el paciente existe
                          const paciente = await Paciente.findById(pacienteId);
                          if (!paciente) {
                            return res.status(404).json({ error: 'El paciente no fue encontrado' });
                          }
                      
                          // Crear una nueva enfermedad con los datos proporcionados
                          const nuevaEnfermedad = new Enfermedad({
                            nombre,
                            fechadiagnostico,
                            tratamiento,
                            ultimocontrol,
                            obsdiagnostico,
                            paciente: pacienteId,
                            guardadoporpaciente:false,
                            pacientefechadiagnostico:false,
                          });
                      
                          // Guardar la nueva enfermedad
                          await nuevaEnfermedad.save();
                      
                          res.status(201).json({ mensaje: 'Enfermedad guardada correctamente' });
                        } catch (error) {
                          console.log(error);
                          res.status(500).json({ error: 'Ocurrió un error al guardar la enfermedad' });
                        }
                      };
                      const GuardarSolicitudExamenPaciente = async (req, res) => {
                        const { pacienteId, nombreExamen,enfermedadIdSeleccionada } = req.body;

                        try {
                          // Verificar si el paciente existe
                          const paciente = await Paciente.findById(pacienteId);
                          if (!paciente) {
                            return res.status(404).json({ error: 'El paciente no fue encontrado' });
                          }
                      
                          // Crear unanueva solicitud para que el paciente suba su examen
                          const nuevasolicitud = new Examen({
                            nombre:nombreExamen,
                            paciente: pacienteId,
                            estado:false,
                            enfermedad:enfermedadIdSeleccionada
                          });
                      
                          // guardar la solicitud
                          await nuevasolicitud.save();
                      
                          res.status(201).json({ mensaje: 'Solicitud de examen guardada' });
                        } catch (error) {
                          console.log(error);
                          res.status(500).json({ error: 'Ocurrió un error al guardar la solicitud' });
                        }
                      };
                      const ActualizarIdentificacionPaciente= async (req, res)=>{
                        const { id } =req.params;
                        const paciente = await Paciente.findById(id);
                        if(!paciente){
                            return res.status(404).json({msg:"No encontrado"})
                        }                       
                       paciente.localidad = req.body.localidad ;
                       paciente.escolaridad = req.body.escolaridad;
                       paciente.ocupacion = req.body.ocupacion;
                       paciente.previsionsalud = req.body.previsionsalud;
                       paciente.lugardeatencion= req.body.lugardeatencion;
                       paciente.obsactividadfisica =req.body.obsactividadfisica;
                       paciente.historiaclinica.actividadfisica = req.body.historiaclinica.actividadfisica;
                       paciente.obsalcohol =req.body.obsalcohol;
                       paciente.historiaclinica.alcohol = req.body.historiaclinica.alcohol;
                       paciente.obsdrogas =req.body.obsdrogas;
                       paciente.historiaclinica.drogas = req.body.historiaclinica.drogas;
                       paciente.obsfumador =req.body.obsfumador;
                       paciente.historiaclinica.fumador = req.body.historiaclinica.fumador;
                       paciente.obssaludmental =req.body.obssaludmental;
                       paciente.historiaclinica.saludmental = req.body.historiaclinica.saludmental;
                        try {
                            const pacienteActualizado = await paciente.save();
                            res.json(pacienteActualizado);
                        } catch (error) {
                            console.log(error)        
                        }         
                      };  
                      
                      
                      const obtenerEnfermedades= async (req, res)=>{
                        try {
                            const enfermedades = await Enfermedad.find().sort({ createdAt: 'desc' })
                            res.json( enfermedades)
                        } catch (error) {
                            console.log(error)
                            
                        }
                      };

                      //Seccion de farmacos o tratamientos utilizados
                      const GuardarFarmacoPaciente = async (req, res) => {
                        const {pacienteId, enfermedad, nombre, dosis, horario, duracion, formato,tipo,tipodeuso } = req.body;
                        try {
                             // Verificar si el paciente existe
                             const paciente = await Paciente.findById(pacienteId);
                             if (!paciente) {
                               return res.status(404).json({ error: 'El paciente no fue encontrado' });
                             }
                         
                        // Crear una nuevo farmaco con los datos proporcionados
                          const nuevaFarmaco = new Farmaco({
                            nombre,
                            dosis,
                            horario,
                            formato,
                            duracion,
                            enfermedad: enfermedad === "" ? null : enfermedad,
                            tipo,
                            tipodeuso,
                            paciente: pacienteId,
                            guardadoporpaciente:false,
                          });
                      
                          // Guardar el farmaco
                          await nuevaFarmaco.save();
                      
                          res.status(201).json({ mensaje: 'Farmaco guardada correctamente' });
                        } catch (error) {
                          console.log(error);
                          res.status(500).json({ error: 'Ocurrió un error al guardar el farmaco' });
                        }
                      };
                      const ActualizarFarmacoPaciente = async (req, res) => {
                        const farmaco = await Farmaco.findById(req.params.id);
                        if (!farmaco) {
                          const error = new Error("Hubo un error");
                          return res.status(400).json({ msg: error.message });
                        }
                        try {
                          const datosOriginales = {
                            nombre: farmaco.nombre,
                            horario: farmaco.horario,
                            dosis: farmaco.dosis,
                            duracion: farmaco.duracion,
                            formato: farmaco.formato,
                            tipodeuso:farmaco.tipodeuso,
                            tipo: farmaco.tipo,
                            magistral: farmaco.magistral,
                            enfermedad: farmaco.enfermedad  // Agregamos la propiedad enfermedad al objeto datosOriginales
                          };
                      
                          farmaco.nombre = req.body.nombre;
                          farmaco.horario = req.body.horario;
                          farmaco.dosis = req.body.dosis;
                          farmaco.duracion = req.body.duracion;
                          farmaco.formato = req.body.formato;
                          farmaco.tipodeuso =req.body.tipodeuso;
                          farmaco.tipo =req.body.tipo;
                          farmaco.magistral =req.body.magistral;
                          farmaco.enfermedad = req.body.enfermedad === "Sin enfermedad" ? null : req.body.enfermedad || null;
                      
                          const farmacoActualizada = await farmaco.save();
                      
                          // Verificar si alguno de los datos se modificó
                          const datosModificados =
                            farmaco.nombre !== datosOriginales.nombre ||
                            farmaco.horario !== datosOriginales.horario ||
                            farmaco.dosis !== datosOriginales.dosis ||
                            farmaco.duracion !== datosOriginales.duracion ||
                            farmaco.formato !== datosOriginales.formato ||
                            farmaco.tipodeuso !== datosOriginales.tipodeuso ||
                            farmaco.tipo !== datosOriginales.tipo ||
                            farmaco.enfermedad !== datosOriginales.enfermedad;
                      
                          // Cambiar el valor de guardadoporpaciente a false si hay cambios
                          if (datosModificados) {
                            farmaco.guardadoporpaciente = false;
                            await farmaco.save();
                          }
                      
                          res.json(farmacoActualizada);
                        } catch (error) {
                          console.log(error);
                        }
                      };
                         
                      //Seccion de farmacos previos o tratamientos cancelados
                      const ActualizarFarmacoPrevioPaciente = async (req, res) => {
                        const farmaco = await Farmacoprevios.findById(req.params.id);
                        if (!farmaco) {
                          const error = new Error("Hubo un error");
                          return res.status(400).json({ msg: error.message });
                        }
                        try {
                          const datosOriginales = {
                            nombre: farmaco.nombre,
                            motivosuspencion: farmaco.motivosuspencion,

                          };
                      
                          farmaco.nombre = req.body.nombre;
                          farmaco.motivosuspencion = req.body.motivosuspencion;
                      
                          const farmacoActualizada = await farmaco.save();
                      
                          // Verificar si alguno de los datos se modificó
                          const datosModificados =
                            farmaco.nombre !== datosOriginales.nombre ||
                            farmaco.motivosuspencion !== datosOriginales.motivosuspencion 
                      
                          // Cambiar el valor de guardadoporpaciente a false si hay cambios
                          if (datosModificados) {
                            farmaco.guardadoporpaciente = false;
                            await farmaco.save();
                          }
                      
                          res.json(farmacoActualizada);
                        } catch (error) {
                          console.log(error);
                        }
                      };
                      const GuardarFarmacoPrevioPaciente = async (req, res) => {
                        const {pacienteId, nombre, motivosuspencion } = req.body;

                        try {
                             // Verificar si el paciente existe
                             const paciente = await Paciente.findById(pacienteId);
                             if (!paciente) {
                               return res.status(404).json({ error: 'El paciente no fue encontrado' });
                             }
                         
                        // Crear una nuevo farmaco con los datos proporcionados
                          const nuevaFarmaco = new Farmacoprevios({
                            nombre,
                            motivosuspencion,
                            paciente: pacienteId,
                            guardadoporpaciente:false,
                          });
                      
                          // Guardar el farmaco
                          await nuevaFarmaco.save();
                      
                          res.status(201).json({ mensaje: 'Farmaco guardada correctamente' });
                        } catch (error) {
                          console.log(error);
                          res.status(500).json({ error: 'Ocurrió un error al guardar el farmaco' });
                        }
                      };
                       //Seccion de Antecedentes quirurgicos
                       const ActualizarQuirurgicosPaciente = async (req, res) => {
                        const quirurgico = await Quirurgico.findById(req.params.id);
                        if (!quirurgico) {
                          const error = new Error("Hubo un error");
                          return res.status(400).json({ msg: error.message });
                        }
                        try {
                          const datosOriginales = {
                            nombre: quirurgico.nombre,
                            anio:quirurgico.anio,
                            enfermedad: quirurgico.enfermedad  // Agregamos la propiedad enfermedad al objeto datosOriginales
                          };
                      
                          quirurgico.nombre = req.body.nombre;
                          quirurgico.anio= req.body.anio;
                          quirurgico.enfermedad = req.body.enfermedad === "Sin enfermedad" ? null : req.body.enfermedad || null; // Asignamos el ID de la enfermedad
                      
                          const quirurgicoActualizada = await quirurgico.save();
                      
                          // Verificar si alguno de los datos se modificó
                          const datosModificados =
                            quirurgico.nombre !== datosOriginales.nombre ||
                            quirurgico.anio !== datosOriginales.anio ||
                            quirurgico.enfermedad !== datosOriginales.enfermedad;
                      
                          // Cambiar el valor de guardadoporpaciente a false si hay cambios
                          if (datosModificados) {
                            quirurgico.guardadoporpaciente = false;
                            await quirurgico.save();
                          }
                      
                          res.json(quirurgicoActualizada);
                        } catch (error) {
                          console.log(error);
                        }
                      };
                      const GuardarQuirurgicosPaciente = async (req, res) => {
                        const {pacienteId, enfermedad, nombre, anio } = req.body;

                        try {
                             // Verificar si el paciente existe
                             const paciente = await Paciente.findById(pacienteId);
                             if (!paciente) {
                               return res.status(404).json({ error: 'El paciente no fue encontrado' });
                             }
                         
                        // Crear una nuevo farmaco con los datos proporcionados
                          const nuevaQuirurgicos = new Quirurgico({
                            nombre,
                            anio,
                            enfermedad: enfermedad === "" ? null : enfermedad,
                            paciente: pacienteId,
                            guardadoporpaciente:false,
                          });
                      
                          // Guardar el farmaco
                          await nuevaQuirurgicos.save();
                      
                          res.status(201).json({ mensaje: 'Antecedente quirurgico guardada correctamente' });
                        } catch (error) {
                          console.log(error);
                          res.status(500).json({ error: 'Ocurrió un error al guardar el antecedente quirurgico' });
                        }
                      };

                      const ActualizarAlergiasPaciente = async (req, res) => {
                        const alergia= await Alergia.findById(req.params.id);
                        if (!alergia) {
                          const error = new Error("Hubo un error");
                          return res.status(400).json({ msg: error.message });
                        }
                        try {
                          const datosOriginales = {
                            nombre: alergia.nombre,
                            obsalergia: alergia.obsalergia,
                          };                    
                          alergia.nombre = req.body.nombre;
                          alergia.obsalergia = req.body.obsalergia;
                          const alergiaActualizada = await alergia.save();
                          // Verificar si alguno de los datos se modificó
                          const datosModificados =
                           alergia.nombre !== datosOriginales.nombre ||
                           alergia.obsalergia !== datosOriginales.obsalergia;   
                          // Cambiar el valor de guardadoporpaciente a false si hay cambios
                          if (datosModificados) {
                            alergia.guardadoporpaciente = false;
                            await alergia.save();
                          }
                      
                          res.json(alergiaActualizada);
                        } catch (error) {
                          console.log(error);
                        }
                      };
                      const GuardarAlergiaPaciente = async (req, res) => {
                        const {pacienteId, nombre, obsalergia } = req.body;
                        try {
                             // Verificar si el paciente existe
                             const paciente = await Paciente.findById(pacienteId);
                             if (!paciente) {
                               return res.status(404).json({ error: 'El paciente no fue encontrado' });
                             }                       
                        // Crear una nueva alergia con los datos proporcionados
                          const nuevaAlergia = new Alergia({
                            nombre,
                            obsalergia,
                            paciente: pacienteId,
                            guardadoporpaciente:false,
                          });
                          // Guardar la alergia
                          await nuevaAlergia.save();
                          res.status(201).json({ mensaje: 'Alergia guardada correctamente' });
                        } catch (error) {
                          console.log(error);
                          res.status(500).json({ error: 'Ocurrió un error al guardar el farmaco' });
                        }
                      };
                      const ActualizarAntecedentesfamPaciente = async (req, res) => {
                        const antecedentesfam= await AntecedentesFam.findById(req.params.id);
                        if (!antecedentesfam) {
                          const error = new Error("Hubo un error");
                          return res.status(400).json({ msg: error.message });
                        }
                        try {
                          const datosOriginales = {
                            nombrediagnostico: antecedentesfam.nombrediagnostico,
                            familiar: antecedentesfam.familiar,
                          };                    
                          antecedentesfam.nombrediagnostico = req.body.nombrediagnostico;
                         antecedentesfam.familiar = req.body.familiar;
                          const antecedentefamActualizada = await antecedentesfam.save();
                          // Verificar si alguno de los datos se modificó
                          const datosModificados =
                           antecedentesfam.nombrediagnostico !== datosOriginales.nombrediagnostico ||
                           antecedentesfam.familiar !== datosOriginales.familiar;   
                          // Cambiar el valor de guardadoporpaciente a false si hay cambios
                          if (datosModificados) {
                            antecedentesfam.guardadoporpaciente = false;
                            await antecedentesfam.save();
                          }
                      
                          res.json(antecedentefamActualizada);
                        } catch (error) {
                          console.log(error);
                        }
                      };
                      const GuardarAntecedentesfamPaciente = async (req, res) => {
                        const {pacienteId, nombrediagnostico, familiar } = req.body;
                        try {
                             // Verificar si el paciente existe
                             const paciente = await Paciente.findById(pacienteId);
                             if (!paciente) {
                               return res.status(404).json({ error: 'El paciente no fue encontrado' });
                             }                       
                        // Crear un nuevo antecedente familiar con los datos proporcionados
                          const nuevoantecedentefam = new AntecedentesFam({
                            nombrediagnostico,
                            familiar,
                            paciente: pacienteId,
                            guardadoporpaciente:false,
                          });
                          // Guardar antecedentes familiar
                          await nuevoantecedentefam.save();
                          res.status(201).json({ mensaje: 'Antecedente familiar guardado correctamente' });
                        } catch (error) {
                          console.log(error);
                          res.status(500).json({ error: 'Ocurrió un error al guardar el antecedente familiar' });
                        }
                      };
                      const ActualizarHospitalizacionesPaciente = async (req, res) => {
                        const hospitalizaciones= await Hospitalizaciones.findById(req.params.id);
                        if (!hospitalizaciones) {
                          const error = new Error("Hubo un error");
                          return res.status(400).json({ msg: error.message });
                        }
                        try {
                          const datosOriginales = {
                            nombre: hospitalizaciones.nombre,
                            fechaingreso: hospitalizaciones.fechaingreso,
                            fechasalida: hospitalizaciones.fechasalida,
                            enfermedad: hospitalizaciones.enfermedad
                          };                    
                          hospitalizaciones.nombre = req.body.nombre;
                         hospitalizaciones.fechaingreso = req.body.fechaingreso;
                         hospitalizaciones.fechasalida = req.body.fechasalida;
                         hospitalizaciones.enfermedad = req.body.enfermedad === "Sin enfermedad" ? null : req.body.enfermedad || null;
                         
                          const hospitalizacionActualizada = await hospitalizaciones.save();
                          // Verificar si alguno de los datos se modificó
                          const datosModificados =
                           hospitalizaciones.nombre !== datosOriginales.nombre ||
                           hospitalizaciones.fechaingreso !== datosOriginales.fechaingreso; 
                           hospitalizaciones.fechasalida !== datosOriginales.fechasalida; 
                           hospitalizaciones.enfermedad !== datosOriginales.enfermedad;  
                          // Cambiar el valor de guardadoporpaciente a false si hay cambios
                          if (datosModificados) {
                            hospitalizaciones.guardadoporpaciente = false;
                            await hospitalizaciones.save();
                          }
                      
                          res.json(hospitalizacionActualizada);
                        } catch (error) {
                          console.log(error);
                        }
                      };
                      const GuardarHospitalizacionesPaciente = async (req, res) => {
                        const {pacienteId, nombre, fechaingreso ,enfermedad,fechasalida } = req.body;
                        try {
                             // Verificar si el paciente existe
                             const paciente = await Paciente.findById(pacienteId);
                             if (!paciente) {
                               return res.status(404).json({ error: 'El paciente no fue encontrado' });
                             }                       
                        // Crear una nueva hospitalizacion
                          const hospitalizaciones = new Hospitalizaciones({
                            nombre,
                            fechaingreso,
                            fechasalida,
                            enfermedad: enfermedad === "" ? null : enfermedad,
                            paciente: pacienteId,
                            guardadoporpaciente:false,
                          });
                          // Guardar hospitalizaciones
                          await hospitalizaciones.save();
                          res.status(201).json({ mensaje: 'Hospitalizaciones guardado correctamente' });
                        } catch (error) {
                          console.log(error);
                          res.status(500).json({ error: 'Ocurrió un error al guardar la hospitalización' });
                        }
                      };
                      const Actualizarpreguntaspro= async (req, res)=>{
                        const { id } =req.params;
                        const consulta = await Consulta.findById(id);
                        if(!consulta){
                            return res.status(404).json({msg:"No encontrado"})
                        }
                        if(consulta.profesional._id.toString() !== req.profesional._id.toString()){
                          return res.json({msg: "Accion no válida"});
                      }                 
                       consulta.preguntasprofesional = req.body.preguntasprofesional;

                        try {
                            const consultasActualizadas = await consulta.save();
                            res.json(consultasActualizadas);
                        } catch (error) {
                            console.log(error)        
                        }         
                      };

                      const ActualizarGinePaciente= async (req, res)=>{
                        const { id } =req.params;
                        const paciente = await Paciente.findById(id);
                        if(!paciente){
                            return res.status(404).json({msg:"No encontrado"})
                        }                       
                        paciente.gestaciones = req.body.gestaciones;
                        paciente.perdidas = req.body.perdidas;
                        paciente.partos = req.body.partos;
                        paciente.cesareas = req.body.cesareas;
                        paciente.menarquia = req.body.menarquia;
                        paciente.ultimaregla = req.body.ultimaregla;
                        paciente.ultimopap = req.body.ultimopap;                 
                        try {
                            const pacienteActualizado = await paciente.save();
                            res.json(pacienteActualizado);
                        } catch (error) {
                            console.log(error)        
                        }         
                      };
                      const ActualizarConsultaFicha= async (req, res)=>{
                        const { id } =req.params;
                        const consulta = await  Consulta.findById(id);
                        if(!consulta){
                            return res.status(404).json({msg:"No encontrado"})}                       
                       consulta.registro = req.body.registro;
                        try {
                            const consultaActualizada = await consulta.save();
                            res.json(consultaActualizada);
                        } catch (error) {
                            console.log(error)        
                        }         
                      };
                      const ActualizarLinkFicha= async (req, res)=>{
                        const { id } =req.params;
                        const consulta = await  Consulta.findById(id);
                        if(!consulta){
                            return res.status(404).json({msg:"No encontrado"})}                       
                       consulta.link = req.body.link;
                        try {
                            const consultaActualizada = await consulta.save();
                            res.json(consultaActualizada);
                        } catch (error) {
                            console.log(error)        
                        }         
                      };
                      const ActualizarMotivoConsulta= async (req, res)=>{
                        const { id } =req.params;
                        const motivo = await  MotivoConsulta.findById(id);
                        if(!motivo){
                            return res.status(404).json({msg:"No encontrado"})}                       
                       motivo.medidasgenerales = req.body.medidasgenerales;
                       motivo.impresiondiagnostica = req.body.impresiondiagnostica;
                       motivo.interconsulta = req.body.interconsulta;
                       motivo.propuestainterconsulta = req.body.propuestainterconsulta;
                       motivo.notificacioninterconsulta = req.body.notificacioninterconsulta;
                       motivo.motivointerconsulta = req.body.motivointerconsulta;
                        try {
                            const motivoActualizada = await motivo.save();
                            res.json(motivoActualizada);
                        } catch (error) {
                            console.log(error)        
                        }         
                      };

                      const obtenerMedidasGenerales= async (req, res)=>{
                        const medidasgenerales = await Medidageneral.find().populate('profesional').sort({createdAt: -1});          
                        res.json(medidasgenerales);  
                    };
                    const GuardarMedidaGeneral = async (req, res) => {
                      const {profesionalId, tags, titulo, descripcion,fuente } = req.body;
                      try {
                           // Verificar si el profesional existe
                           const profesional = await Profesional.findById(profesionalId);
                           if (!profesional) {
                             return res.status(404).json({ error: 'El paciente no fue encontrado' });
                           }    
                      // Crear una nuevo farmaco con los datos proporcionados
                        const medidas = new Medidageneral({
                          titulo,
                          descripcion,
                          fuente,
                          tags,
                          profesional: profesionalId,
                        });                    
                        // Guardar la medida general
                        await medidas.save();                  
                        res.status(201).json({ mensaje: 'Medida general guardada' });
                      } catch (error) {
                        console.log(error);
                        res.status(500).json({ error: 'Ocurrió un error al guardar medida general' });
                      }
                    };
                    const obtenertusMedidasGenerales = async (req, res) => {
                      const { id } = req.params;
                      try {
                        const medidasgenerales = await Medidageneral.find({ profesional: id }).sort({ createdAt: -1 });
                        res.json(medidasgenerales);
                      } catch (error) {
                        console.log(error);
                        res.status(500).json({ error: 'Error al obtener las medidas generales' });
                      }
                    };

                    const GuardarEnfermedadPacienteFicha = async (req, res) => {
                      const { pacienteId, nombre, fechadiagnostico, tratamiento, ultimocontrol, obsdiagnostico, motivoId } = req.body;

                      try {
                        // Verificar si el paciente existe
                        const paciente = await Paciente.findById(pacienteId);
                        if (!paciente) {
                          return res.status(404).json({ error: 'El paciente no fue encontrado' });
                        }
                    
                        // Crear una nueva enfermedad con los datos proporcionados
                        const nuevaEnfermedad = new Enfermedad({
                          nombre,
                          fechadiagnostico,
                          tratamiento,
                          ultimocontrol,
                          obsdiagnostico,
                          paciente: pacienteId,
                          motivoconsulta: motivoId,
                          guardadoporpaciente:false,
                          
                        });
                        // Guardar la nueva enfermedad
                        await nuevaEnfermedad.save();                  
                        res.status(201).json({ mensaje: 'Enfermedad guardada correctamente' });
                      } catch (error) {
                        console.log(error);
                        res.status(500).json({ error: 'Ocurrió un error al guardar la enfermedad' });
                      }
                    };
                    const GuardarFarmacoPacienteFicha = async (req, res) => {
                      const { pacienteId, nombre, motivoId ,enfermedad,  dosis, horario, duracion, formato,tipodeuso } = req.body;
                      try {
                        // Verificar si el paciente existe
                        const paciente = await Paciente.findById(pacienteId);
                        if (!paciente) {
                          return res.status(404).json({ error: 'El paciente no fue encontrado' });
                        }  
                        // Crear un nuevo farmaco con los datos proporcionados
                        const nuevoFarmaco= new Farmaco({
                          nombre,
                          paciente: pacienteId,
                          motivoconsulta: motivoId,
                          dosis,
                          horario,
                          formato,
                          duracion,
                          enfermedad: enfermedad === "" ? null : enfermedad,
                          tipodeuso,
                          guardadoporpaciente:false,                
                        });
                        // Guardar un nuevo farmaco
                        await nuevoFarmaco.save();                  
                        res.status(201).json({ mensaje: 'Farmaco guardada correctamente' });
                      } catch (error) {
                        console.log(error);
                        res.status(500).json({ error: 'Ocurrió un error al guardar el farmaco' });
                      }
                    };
                    const GuardarReceta = async (req, res) =>{
                      const { pacienteId, profesionalId,motivoId,opciones,tipoReceta,consultaId } = req.body;
                      try {
                        const paciente = await Paciente.findById(pacienteId);
                        if (!paciente) {
                          return res.status(404).json({ error: 'El paciente no fue encontrado' });
                        }
                        const receta = new Receta({
                          opciones: opciones.split(',').map((opcion) => opcion.trim()),
                          tipoReceta:tipoReceta,
                          paciente: pacienteId,
                          motivoconsulta: motivoId,
                          profesional: profesionalId,
                          consulta: consultaId
                        });
                        if (req.files?.documento) {
                          const result = await uploadDocument(req.files.documento.tempFilePath)
                          receta.documento = {
                            public_id: result.public_id,
                            secure_url: result.secure_url
                          }
                          await fs.unlink(req.files.documento.tempFilePath)
                        }
                        const recetaguardado = await receta.save();
                        res.json(recetaguardado);
                      } catch (error) {
                        if (req.files?.documento) {
                          await fs.unlink(req.files.documento.tempFilePath)
                          }
                        console.log(error);
                        res.status(400).json({ error: 'Error al guardar la receta' });
                      }
                    };

                    const GuardarExamenSolicitado = async (req, res) => {
                      const { pacienteId, profesionalId, opciones, consultaId, motivoConsultaId } = req.body;
                      try {
                        // Verificar si el paciente existe
                        const paciente = await Paciente.findById(pacienteId);
                        if (!paciente) {
                          return res.status(404).json({ error: 'El paciente no fue encontrado' });
                        }
                        // Crear una nueva solicitud con los datos proporcionados
                        const nuevoExamen = new Examensolicitado({
                          opciones: opciones.split(',').map((opcion) => opcion.trim()),
                          paciente: pacienteId,
                          consulta: consultaId,
                          profesional: profesionalId,
                          motivoconsulta: motivoConsultaId
                        });
                        if (req.files?.documento) {
                          const result = await uploadDocument(req.files.documento.tempFilePath)
                          nuevoExamen.documento = {
                            public_id: result.public_id,
                            secure_url: result.secure_url
                          }
                          await fs.unlink(req.files.documento.tempFilePath)
                        }
                        // Guardar un nuevo examen
                        const examenguardado = await nuevoExamen.save();
                        res.json(examenguardado);
  
  
                      } catch (error) {
                        if (req.files?.documento) {
                            await fs.unlink(req.files.documento.tempFilePath)
                          }
                        console.log(error);
                        res.status(400).json({ error: 'Error al guardar examen' });
                      }
                    };

                    const ObtenerExamenesSolicitados= async (req, res)=>{
                      try {
                        const { id } =req.params;
                        const examenes = await Examensolicitado.find({ consulta: id })
                        .populate('paciente')
                        .populate('profesional')
                        .populate('motivoconsulta')
                        .populate('consulta');
                  
                      res.json(examenes);
                      } catch (error) {
                          console.log(error)
                          
                      }
                    };
                    const ObtenerRecetasMotivo= async (req, res)=>{
                      try {
                        const { id } =req.params;
                        const examenes = await Receta.find({ motivoconsulta: id })
                        .populate('paciente')
                        .populate('profesional')
                        .populate('motivoconsulta');
                  
                      res.json(examenes);
                      } catch (error) {
                          console.log(error)
                          
                      }
                    };
                    const eliminarMedida= async (req, res)=>{
                      const { id } =req.params;
                      const medida = await Medidageneral.findById(id);
                      if(!medida){
                          return res.status(404).json({msg:"No encontrado"})
                      }
                      
                      if(medida.profesional._id.toString() !== req.profesional._id.toString()){
                          return res.json({msg: "Accion no válida"});
                      }
                  
                      try {
                          await medida.deleteOne();
                          res.json({msg:"Medida general eliminada"});
                      } catch (error) {
                          console.log(error)
                      }
                  
                  }; 
                  const actualizarMedida= async (req, res)=>{
        
                    const { id } =req.params;
                    const medida = await Medidageneral.findById(id);
                    if(!medida){
                        return res.status(404).json({msg:"No encontrado"})
                    }
                    
                    if(medida.profesional._id.toString() !== req.profesional._id.toString()){
                        return res.json({msg: "Accion no válida"});
                    }

                   medida.titulo = req.body.titulo || medida.titulo;
                   medida.descripcion = req.body.descripcion || medida.descripcion;
                   medida.fuente = req.body.fuente || medida.fuente;
                   medida.anonimo = req.body.anonimo || medida.anonimo;
                   medida.tags = req.body.tags || medida.tags;              
                    try {
                        const medidaActualizado = await medida.save();
                        res.json(medidaActualizado);
                    } catch (error) {
                        console.log(error)
                        
                    }
                    
                    
                    };
                    const NotificacionParainterconsulta = async (req, res) => {
                      const { id } = req.params;
                      const motivo = await MotivoConsulta.findById(id);
                      if (!motivo) {
                        return res.status(404).json({ msg: "No encontrado" });
                      }
                      motivo.notificacioninterconsulta = true;
                      try {
                        const motivoActualizada = await motivo.save();
                        res.json(motivoActualizada); // Enviar la respuesta como JSON
                      } catch (error) {
                        console.log(error);
                        res.status(500).json({ msg: "Error en el servidor" }); // Manejar errores y enviar una respuesta JSON en caso de error
                      }
                    };

                    const GuardarControlesPaciente = async (req, res) => {
                      const {pacienteId, fecha, motivoconsultaId, descripcion,profesionalId } = req.body;

                      try {
                           // Verificar si el paciente existe
                           const paciente = await Paciente.findById(pacienteId);
                           if (!paciente) {
                             return res.status(404).json({ error: 'El paciente no fue encontrado' });
                           }
                       
                      // Crear una nuevo control con los datos proporcionados
                        const control = new Controles({
                          fecha,
                          descripcion,
                          paciente: pacienteId,
                          motivoconsulta: motivoconsultaId,
                          profesional:profesionalId
                        });
                    
                        // Guardar control
                        await control.save();
                    
                        res.status(201).json({ mensaje: 'Control guardado correctamente' });
                      } catch (error) {
                        console.log(error);
                        res.status(500).json({ error: 'Ocurrió un error al guardar el Control' });
                      }
                    };
                    const ObtenerControlesMotivo= async (req, res)=>{
                      try {
                        const { id } =req.params;
                        const controles = await Controles.find({ motivoconsulta: id })
                        .populate('paciente')
                        .populate('motivoconsulta')
                  
                      res.json(controles);
                      } catch (error) {
                          console.log(error)
                          
                      }
                    };
                    const NoInterconsulta= async (req, res)=>{
                      const { id } =req.params;
                      const motivo = await  MotivoConsulta.findById(id);
                      if(!motivo){
                          return res.status(404).json({msg:"No encontrado"})}                       
                     motivo.interconsulta = 'No';
                     motivo.propuestainterconsulta = null;
                     motivo.notificacioninterconsulta = false;
                     motivo.motivointerconsulta = null
                      try {
                          const motivoActualizada = await motivo.save();
                          res.json(motivoActualizada);
                      } catch (error) {
                          console.log(error)        
                      }         
                    };

                    const FinalizarConsulta = async (req, res) => {
                      const { id } = req.params;
                    
                      try {
                        const consulta = await Consulta.findById(id).populate('paciente').populate('profesional').populate('motivoconsulta');
                        const recetas = await Receta.find({ consulta: id, estado: 'pendiente' });
                        const examenes = await Examensolicitado.find({ consulta: id, estado: 'pendiente' });
                    
                        const nombrePaciente = desencriptarDatoSJCL(consulta.paciente.nombres);
                        const emailPaciente = consulta.paciente.email;
                    
                        try {
                          await enviarCorreoRecetas({ consulta, recetas, examenes, nombrePaciente, emailPaciente });
                        } catch (error) {
                          console.log(error);
                          // Manejar el error de envío de correo
                        }
                    
                        // Cambiar el estado de las recetas a "finalizado"
                        await Receta.updateMany({ _id: { $in: recetas.map(receta => receta._id) } }, { estado: 'finalizado' });
                    
                        // Cambiar el estado de los exámenes a "finalizado"
                        await Examensolicitado.updateMany({ _id: { $in: examenes.map(examen => examen._id) } }, { estado: 'finalizado' });
                    
                        // Cambiar el estado de la consulta a "finalizado"
                        consulta.estado = 'finalizado';
                        await consulta.save();
                    
                        // Cambiar la visibilidad del motivo de consulta a false
                        consulta.motivoconsulta.visible = false;
                        await consulta.motivoconsulta.save();
                    
                        res.json({ consulta, recetas, examenes });
                      } catch (error) {
                        console.log(error);
                        res.status(500).json({ error: 'Error al obtener las recetas y los exámenes' });
                      }
                    };
                                   
                    const enviarCorreoRecetas = async ({ consulta, recetas, examenes, nombrePaciente, emailPaciente }) => {
                      const transporter = nodemailer.createTransport({
                        host: process.env.EMAIL_HOST,
                        port: process.env.EMAIL_PORT,
                        secure: false,
                        auth: {
                          user: process.env.EMAIL_USER,
                          pass: process.env.EMAIL_PASS,
                        },
                      });
                    
                      let recetasHtml = '';
                      if (recetas.length > 0) {
                        recetasHtml = recetas.map((receta, index) => `<p><strong>Receta ${index + 1}:</strong> <a href="${receta.documento.secure_url}">Descargar documento</a></p>`).join('');
                      }
                    
                      let examenesHtml = '';
                      if (examenes.length > 0) {
                        examenesHtml = examenes.map((examen, index) => `<p><strong>Examen ${index + 1}:</strong> <a href="${examen.documento.secure_url}">Descargar documento</a></p>`).join('');
                      }
                    
                      let propuestaInterconsultaHtml = '';
                      if (consulta.motivoconsulta.interconsulta === 'Si') {
                        propuestaInterconsultaHtml = `<p>Propuesta de interconsulta: ${consulta.motivoconsulta.propuestainterconsulta}</p>`;
                      }
                    
                      const htmlContent = `
                      <p style="font-size: 16px; line-height: 1.5; margin-bottom: 10px;">Hola ${nombrePaciente}, el profesional ${consulta.profesional.nombres} ${consulta.profesional.apellidos} finalizó tu consulta para el motivo de consulta "${consulta.motivoconsulta.titulo}".</p>
                      <div style="background-color: #f5f7fa; padding: 10px; margin-bottom: 20px; text-align: center;">
                        <h3 style="font-size: 16px; color: #333333; margin-bottom: 10px; text-decoration: underline;">Resumen de tu consulta</h3>
                        <p style="font-size: 12px; line-height: 1.5; margin-bottom: 10px;"><strong style="font-size: 14px;">Impresión diagnóstica:</strong> ${consulta.motivoconsulta.impresiondiagnostica}</p>
                        <p style="font-size: 12px; line-height: 1.5; margin-bottom: 10px;"><strong style="font-size: 14px;">Medidas generales:</strong> ${consulta.motivoconsulta.medidasgenerales}</p>
                        <p style="font-size: 12px; line-height: 1.5; margin-bottom: 10px;"><strong style="font-size: 14px;">Interconsulta:</strong> ${consulta.motivoconsulta.interconsulta}</p>
                        ${propuestaInterconsultaHtml ? `<p style="font-size: 12px; line-height: 1.5; margin-bottom 10px;"><strong style="font-size: 14px;">Propuesta de interconsulta:</strong> ${consulta.motivoconsulta.propuestainterconsulta}</p>` : ''}
                      </div>
                      ${recetasHtml ? `<h3 style="font-size: 14px; color: #333333; margin-bottom: 10px;">Recetas</h3>${recetasHtml}` : ''}
                      ${examenesHtml ? `<h3 style="font-size: 14px; color: #333333; margin-bottom: 10px;">Examenes</h3>${examenesHtml}` : ''}
                    `;
                    
                    
                    
                      const info = await transporter.sendMail({
                        from: `Cimiento clínico <${process.env.EMAIL_USER}>`,
                        to: emailPaciente,
                        subject: `Consulta finalizada`,
                        html: htmlContent,
                      });
                    
                      console.log('Mensaje enviado: %s', info.messageId);
                    };
                    const eliminarFarmacosFicha= async (req, res)=>{
                      const { id } =req.params;
                      const farmaco= await Farmaco.findById(id);
                      if(!farmaco){
                          return res.status(404).json({msg:"No encontrado"})
                      }       
                      try {
                          await farmaco.deleteOne();
                          res.json({msg:"Motivo de consulta eliminado"});
                      } catch (error) {
                          console.log(error)
                      }
                  
                  };
                  const eliminarExamensolicitado = async (req, res) => {
                    const { id } = req.params;
                    const examen = await Examensolicitado.findById(id);     
                    if (!examen) {
                      return res.status(404).json({ msg: 'No encontrado' });
                    }          
                    try {
                      // Eliminar la imagen de Cloudinary
                      await deleteImage(examen.documento.public_id);       
                      // Eliminar la imagen de la base de datos
                      await examen.deleteOne();         
                      res.json({ msg: 'Motivo de consulta eliminado' });
                    } catch (error) {
                      console.log(error);
                      res.status(500).json({ msg: 'Hubo un error al eliminar la imagen' });
                    }
                  };



                  const obtenerrecetasmagistrales= async (req, res)=>{
                    const recetamagistral = await RecetaMagistral.find().populate('profesional').sort({createdAt: -1});          
                    res.json(recetamagistral);  
                };
                const GuardarRecetasMagistral= async (req, res) => {
                  const {nombre, contenido,profesionalId, anonimo,fuente } = req.body;

                  try {
                       // Verificar si el paciente existe
                       const profesional = await Profesional.findById(profesionalId);
                       if (!profesional) {
                         return res.status(404).json({ error: 'El paciente no fue encontrado' });
                       }
                   
                  // Crear una nuevo control con los datos proporcionados
                    const recetamagistral = new RecetaMagistral({
                      nombre,
                      contenido,
                      anonimo,
                      fuente,
                      profesional: profesionalId,

                    });
                
                    // Guardar datos para recetas
                    await recetamagistral.save();
                
                    res.status(201).json({ mensaje: 'receta magistral guardada correctamente' });
                  } catch (error) {
                    console.log(error);
                    res.status(500).json({ error: 'Ocurrió un error al la receta amgistral' });
                  }
                };
                const obtenertusRecetasmagistrales = async (req, res) => {
                  const { id } = req.params;
                  try {
                    const recetamagistral = await RecetaMagistral.find({ profesional: id }).sort({ createdAt: -1 });
                    res.json(recetamagistral);
                  } catch (error) {
                    console.log(error);
                    res.status(500).json({ error: 'Error al obtener las recetas magistral' });
                  }
                };
                const eliminarRecetaMagistral= async (req, res)=>{
                  const { id } =req.params;
                  const receta = await RecetaMagistral.findById(id);
                  if(!receta){
                      return res.status(404).json({msg:"No encontrado"})
                  }
                  
                  if(receta.profesional._id.toString() !== req.profesional._id.toString()){
                      return res.json({msg: "Accion no válida"});
                  }
              
                  try {
                      await receta.deleteOne();
                      res.json({msg:"Receta magistral eliminada"});
                  } catch (error) {
                      console.log(error)
                  }
              
              }; 
              const actualizarRecetaMagistral = async (req, res)=>{
        
                const { id } =req.params;
                const receta = await RecetaMagistral.findById(id);
                if(!receta){
                    return res.status(404).json({msg:"No encontrado"})
                }
                
                if(receta.profesional._id.toString() !== req.profesional._id.toString()){
                    return res.json({msg: "Accion no válida"});
                }

               receta.nombre= req.body.nombre || receta.nombre;
               receta.contenido = req.body.contenido || receta.contenido;
               receta.anonimo = req.body.anonimo || receta.anonimo;
               receta.fuente = req.body.fuente || receta.fuente;
                try {
                    const recetaActualizado = await receta.save();
                    res.json(recetaActualizado);
                } catch (error) {
                    console.log(error)
                    
                }
                
                };


                const obtenertusSignosalarma = async (req, res) => {
                  try {
                     const signos = await Signosalarma.find().populate('profesional').sort({createdAt: -1});          
                    res.json(signos);  
                  } catch (error) {
                    console.log(error);
                    res.status(500).json({ error: 'Error al obtener signos de alarma' });
                  }
                };
                const GuardarSignosalarma= async (req, res) => {
                  const {nombre, contenido,profesionalId, anonimo,fuente } = req.body;

                  try {
                       // Verificar si el paciente existe
                       const profesional = await Profesional.findById(profesionalId);
                       if (!profesional) {
                         return res.status(404).json({ error: 'El paciente no fue encontrado' });
                       }
                  // Crear una nuevo control con los datos proporcionados
                    const signos = new Signosalarma({
                      nombre,
                      contenido,
                      anonimo,
                      fuente,
                      profesional: profesionalId,

                    });
                
                    // Guardar datos para recetas
                    await signos.save();
                
                    res.status(201).json({ mensaje: 'receta magistral guardada correctamente' });
                  } catch (error) {
                    console.log(error);
                    res.status(500).json({ error: 'Ocurrió un error al la receta amgistral' });
                  }
                };
                const obtenertusSignos = async (req, res) => {
                  const { id } = req.params;
                  try {
                    const signos = await Signosalarma.find({ profesional: id }).sort({ createdAt: -1 });
                    res.json(signos);
                  } catch (error) {
                    console.log(error);
                    res.status(500).json({ error: 'Error al obtener las recetas magistral' });
                  }
                };
                const eliminarSignos= async (req, res)=>{
                  const { id } =req.params;
                  const signos = await Signosalarma.findById(id);
                  if(!signos){
                      return res.status(404).json({msg:"No encontrado"})
                  }
                  
                  if(signos.profesional._id.toString() !== req.profesional._id.toString()){
                      return res.json({msg: "Accion no válida"});
                  }
              
                  try {
                      await signos.deleteOne();
                      res.json({msg:"Signos de alarma eliminada"});
                  } catch (error) {
                      console.log(error)
                  }
              
                }; 
                const actualizarSignos = async (req, res)=>{
        
                  const { id } =req.params;
                  const signos = await Signosalarma.findById(id);
                  if(!signos){
                      return res.status(404).json({msg:"No encontrado"})
                  }
                  
                  if(signos.profesional._id.toString() !== req.profesional._id.toString()){
                      return res.json({msg: "Accion no válida"});
                  }
  
                 signos.nombre= req.body.nombre || signos.nombre;
                 signos.contenido = req.body.contenido || signos.contenido;
                 signos.anonimo = req.body.anonimo || signos.anonimo;
                 signos.fuente = req.body.fuente || signos.fuente;
                  try {
                      const signosActualizado = await signos.save();
                      res.json(signosActualizado);
                  } catch (error) {
                      console.log(error)
                      
                  }
                  
                };
                const ActualizarSignosmotivo= async (req, res)=>{
                  const { id } =req.params;
                  const motivo = await  MotivoConsulta.findById(id);
                  if(!motivo){
                      return res.status(404).json({msg:"No encontrado"})}                       
                 motivo.signosdealarma = req.body.signosdealarma;
                  try {
                      const motivoActualizada = await motivo.save();
                      res.json(motivoActualizada);
                  } catch (error) {
                      console.log(error)        
                  }         
                };


                    
                    
                       
                    
export{
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    subirFotoPerfil,
    actualizarPerfil,
    actualizarPassword,
    Obtenermotivosdeconsulta,
    Obtenerunmotivodeconsulta,
    generarNotificacion,
    verConsultas,
    obtenerTarifa,
    obtenerTarifaGlobal,
    verListaConsultas,
    consultarConsultasAceptadas,
    VerMasEnConsultaPro,
    agregarTarifaProfesional,
    obtenerTarifaProfesional,
    eliminarTarifaProfesional,
    actualizarTarifa,
    agregarEducacionProfesional,
    obtenerEducacionProfesional,
    eliminarEducacionProfesional,
    actualizarEducacion,
    actualizarExperiencia,
    eliminarExperienciaProfesional,
    obtenerExperienciaProfesional,
    agregarExperienciaProfesional,
    actualizarEspecialidad,
    eliminarEspecialidadProfesional,
    obtenerEspecialidadProfesional,
    agregarEspecialidadProfesional,
    agregarSeccionTarifa,
    obtenerSeccionTarifa,
    eliminarSeccionTarifa,
    actualizarSeccionTarifa,
    obtenertarifaGlobales,
    Consultascalendario,
    actualizarvisibilidadCelular,
    actualizarvisibilidadCorreo,
    ObtenerInformacionPaciente,
    ActualizarEnfermedadesPaciente,
    GuardarEnfermedadPaciente,
    GuardarSolicitudExamenPaciente,
    ActualizarIdentificacionPaciente,
    ActualizarFarmacoPaciente,
    obtenerEnfermedades,
    GuardarFarmacoPaciente,
    ActualizarFarmacoPrevioPaciente,
    GuardarFarmacoPrevioPaciente,
    ActualizarQuirurgicosPaciente,
    GuardarQuirurgicosPaciente,
    ActualizarAlergiasPaciente,
    GuardarAlergiaPaciente,
    ActualizarAntecedentesfamPaciente,
    GuardarAntecedentesfamPaciente,
    ActualizarHospitalizacionesPaciente,
    GuardarHospitalizacionesPaciente,
    Actualizarpreguntaspro,
    ActualizarGinePaciente,
    ActualizarConsultaFicha,
    ActualizarMotivoConsulta,
    obtenerMedidasGenerales,
    GuardarMedidaGeneral,
    GuardarEnfermedadPacienteFicha,
    GuardarFarmacoPacienteFicha,
    GuardarReceta,
    GuardarExamenSolicitado,
    ObtenerExamenesSolicitados,
    ObtenerRecetasMotivo,
    obtenertusMedidasGenerales,
    eliminarMedida,
    actualizarMedida,
    NotificacionParainterconsulta,
    GuardarControlesPaciente,
    ObtenerControlesMotivo,
    NoInterconsulta,
    FinalizarConsulta,
    ActualizarLinkFicha,
    eliminarFarmacosFicha,
    eliminarExamensolicitado,
    obtenerrecetasmagistrales,
    GuardarRecetasMagistral,
    obtenertusRecetasmagistrales,
    eliminarRecetaMagistral,
    actualizarRecetaMagistral,
    obtenertusSignosalarma,
    GuardarSignosalarma,
    obtenertusSignos,
    eliminarSignos,
    actualizarSignos,
    ActualizarSignosmotivo,
}