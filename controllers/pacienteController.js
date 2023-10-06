import generarjwt from "../helpers/generarjwt.js";
import Paciente from "../models/Paciente.js";
import Enfermedad from "../models/Enfermedades.js";
import Alergia from "../models/Alergias.js";
import cron from 'node-cron';
import generarId from "../helpers/generarid.js";
import emailRegistro from "../helpers/emailRegistro.js"
import emailOlvidePassword from "../helpers/emailOlvidePassword.js";
import { uploadImage, deleteImage, uploadDocument ,uploadImageMotivo} from "../utils/cloudinary.js";
import fs from "fs-extra"
import Examen from "../models/examen.js";
import MotivoConsulta from "../models/MotivoConsulta.js";
import Consulta from "../models/Consultas.js";
import Profesional from "../models/Profesional.js";
import Tarifaglobal from "../models/TarifaGlobal.js";
import Tarifa from "../models/Tarifa.js";
import HorarioPaciente from "../models/HorarioPaciente.js";
import moment from 'moment-timezone';
import ImagenesMotivo from "../models/ImagenesMotivo.js";
import Educacion from "../models/Educacion.js";
import Experiencia from "../models/Experiencia.js";
import Especialidad from "../models/Especialidad.js";
import sjcl from "sjcl";
import SeguimientoMotivo from "../models/SeguimientoMotivo.js";
import Quirurgico from "../models/Quirurgico.js";
import Controles from "../models/Controles.js";
import emailConsultaAceptada from "../helpers/emailConsultaAceptada.js";
import Farmaco from "../models/Farmaco.js";
import Farmacoprevios from "../models/Farmacosprevios.js";
import AntecedentesFam from "../models/Antecedentesfam.js";
import Examensolicitado from "../models/Examensolicitado.js";
import Receta from "../models/Receta.js";
moment.tz.setDefault('America/Santiago');
const clave = "1234567890123456";
//Registra un paciente
const registrar = async (req,res) => {
    const { email, nombres } = req.body;
    const { rut } = req.body;
    const existeUsuario = await Paciente.findOne({ email:email})
    const existeUsuariorut = await Paciente.findOne({ rut:rut})
    //Valida si ya existe un usuario con correo o rut
    if (existeUsuario || existeUsuariorut){
        const error =  new Error("Este usuario ya esta registrado, intente recuperar su cuenta");
        return res.status(400).json({msg: error.message})
    }
    try {
        //guardar un nuevo paciente 
        const paciente =  new Paciente(req.body);
        const pacienteguardado = await paciente.save();

        //Enviar email
        emailRegistro({
            email,
            nombres,
            token: pacienteguardado.token,
        }
        )
        res.json({pacienteguardado})
    } catch (error) {
        console.log(error)
    }
   
};

// Función para desencriptar un dato con SJCL
function desencriptarDatoSJCL(datoEncriptado) {
  const decryptedData = sjcl.decrypt(clave, datoEncriptado);
  return decryptedData;
}

const perfil = (req, res) => {
  const { paciente } = req;

  // Desencriptar el campo "rut" utilizando SJCL
  const rutDesencriptado = desencriptarDatoSJCL(paciente.rut);
  const desencriptadoNombres = desencriptarDatoSJCL(paciente.nombres);
  const desencriptadoApellidos = desencriptarDatoSJCL(paciente.apellidos);

  // Crear un nuevo objeto con el campo "rut" desencriptado
  const perfilPaciente = {
    ...paciente.toObject(),
    rut: rutDesencriptado,
    nombres: desencriptadoNombres,
    apellidos: desencriptadoApellidos,
  };

  res.json(perfilPaciente);
};

//Confirmacion de cienta via Token
const confirmar = async (req,res)=>{
    const { token } =req.params
    const UsuarioConfirmar = await Paciente.findOne({ token })
    if(!UsuarioConfirmar){
        const error= new Error("Token no valido");
        return res.status(404).json({msg: error.message})
    }

    try {
        UsuarioConfirmar.token = null;
        UsuarioConfirmar.confirmado = true;
        await UsuarioConfirmar.save();
        res.json({msg:"Paciente confirmado correctamente"})
    } catch (error) {
        console.log("error")
        
    }

 
}
//Autentificar la cuenta 
const autenticar = async (req, res)=>{
    const {email, password }  =req.body;
    //comprobar si el usuario existe
    const usuario= await Paciente.findOne({email: email});
    if(!usuario){
        const error = new Error("El usuario no existe en nuestro sistema");
        return res.status(404).json( {msg: error.message} );
    }

    //Comprueba si el usuario esta confirmado
   if(!usuario.confirmado){
    const error = new Error("Tu cuenta no ha sido confirmada");
    return res.status(403).json({msg: error.message});
   }
   //comprobar password
   if (await usuario.comprobarPassword(password)){
    //Autenticar Usuario
    res.json( 
    {   _id: usuario._id,
        nombre:usuario.nombres,
        email:usuario.nombres,
        token: generarjwt(usuario.id) }
       
       );
 
}else{
    const error = new Error("Datos incorrectos");
    return res.status(403).json(  {msg: error.message});
}
}

const olvidePassword = async (req, res) => {
  const { email } = req.body;

  const PacienteExiste = await Paciente.findOne({ email });
  if (!PacienteExiste) {
    const error = new Error("El Paciente no existe");
    return res.status(400).json({ msg: error.message });
  }

  try {
    PacienteExiste.token = generarId();
    await PacienteExiste.save();

    // Desencriptar los datos necesarios
    const desencriptadoNombres = desencriptarDatoSJCL(PacienteExiste.nombres);
    const desencriptadoApellidos = desencriptarDatoSJCL(PacienteExiste.apellidos);

    // Enviar email con instrucciones y datos desencriptados
    emailOlvidePassword({
      email,
      nombres: desencriptadoNombres,
      apellidos: desencriptadoApellidos,
      token: PacienteExiste.token,
    });

    res.json({ msg: "Revise su correo electrónico para recuperar su contraseña" });
  } catch (error) {
    console.log(error);
  }
};


const comprobarToken = async (req,res)=>{
    const { token } = req.params;
    const tokenValido = await Paciente.findOne({ token });
    if(tokenValido){
        res.json({msg: "Token Válido para recuperar contraseña"})

    } else{
        const error =  new Error("Token no válido, no tiene permisos");
        return res.status(400).json({msg: error.message});

    }
};
const nuevoPassword = async (req,res)=>{
    const { token } = req.params;
    const { password } = req.body;
    const paciente = await Paciente.findOne({token});
    if(!paciente){
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message})
    }

    try {
        paciente.token = null;
        paciente.password = password;
        await paciente.save();
        res.json({msg: "Password modificado correctamente"})
        
    } catch (error) {
        console.log(error)
    }
};
const actualizarPerfil = async (req, res) =>{
const paciente = await Paciente.findById(req.params.id);
if(!paciente){
    const error = new error("Hubo un error");
    return res.status(400).json({msg: error.message})
}

try{
    paciente.telefono = req.body.telefono;
    const pacienteActualizado = await paciente.save();
    res.json(pacienteActualizado)

} catch(error){
    console.log(error)
}

}

const actualizarPassword = async (req,res)=>{
    //leer los datos
    const {id} = req.paciente;
    const {pwd_actual, pwd_nuevo } = req.body;

    //comprobar que el paciente existe
    const paciente = await Paciente.findById(id);
    if(!paciente){
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});

    }
    //Comprobar password
    if(await paciente.comprobarPassword(pwd_actual)){
        //Almacenar nueva password
        paciente.password =  pwd_nuevo;
        await paciente.save();
        res.json({msg: "Contraseña Almacenada correctamente"});
    }
    else{
        const error = new Error("El password actual es incorrecto");
        return res.status(400).json({msg: error.message})

    }
    
}
const subirFotoPerfil = async (req,res)=>{
    const paciente = await Paciente.findById(req.params.id);
    if(!paciente){
        const error = new Error("Hubo un error");
        return res.status(400).json({msg: error.message});

    }
       if(!paciente.image.public_id === null || undefined){
        await deleteImage(paciente.image.public_id)
       }
     
       if(paciente.image.public_id){
        await deleteImage(paciente.image.public_id)
       }
       
   

    try {
        if(req.files?.image){
            const result = await uploadImage(req.files.image.tempFilePath)
            paciente.image={
                public_id : result.public_id,
                secure_url: result.secure_url,
            }
             await fs.unlink(req.files.image.tempFilePath)
            }else{
                const error = new Error("Seleccione una imagen para subir");
                    return res.status(400).json({msg: error.message})
            }
        const pacienteActualizado = await paciente.save();
    res.json(pacienteActualizado)
    } catch (error) {
        console.log(error)
    }

}


const actualizarContacto = async (req, res) =>{
    const paciente = await Paciente.findById(req.params.id);
    if(!paciente){
        const error = new error("Hubo un error");
        return res.status(400).json({msg: error.message})
    }
    try{
        paciente.contacto = req.body.contacto || paciente.contacto;
        
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado)
    
    } catch(error){
        console.log(error)
    }
    
    }
    const ActualizarNoPatologico = async (req, res) =>{
    const paciente = await Paciente.findById(req.params.id);
    if(!paciente){
        const error = new error("Hubo un error");
        return res.status(400).json({msg: error.message})
    }
    try{
        paciente.historiaclinica.fumador = req.body.fumador;
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado)
    
    } catch(error){
        console.log(error)
    }
    
    }
    const tieneAlergia = async (req, res) =>{
        const paciente = await Paciente.findById(req.params.id);
        if(!paciente){
            const error = new error("Hubo un error");
            return res.status(400).json({msg: error.message})
        }
        try{
            paciente.historiaclinica.alergia = req.body.alergia;
            const pacienteActualizado = await paciente.save();
            res.json(pacienteActualizado)
        
        } catch(error){
            console.log(error)
        }
        
        }


    const agregarAlergia= async(req,res)=>{
        const alergia= new Alergia(req.body);
        
        alergia.paciente = req.paciente._id;
        
        try {
            const alergiaAlmacenado  = await alergia.save();
            res.json(alergiaAlmacenado);
        } catch (error) {
            console.log(error);
        }
        };

    const obtenerAlergias= async (req, res)=>{
            const alergias =  await Alergia.find().where('paciente').equals(req.paciente);
        
            res.json(alergias);
        
    };
    const obtenerAlergia= async (req, res)=>{
            try {
                const alergias = await Alergia.find()
                res.json( alergias)
            } catch (error) {
                console.log(error)
                
            }
        
        
        };
        const actualizarAlergia= async (req, res)=>{
        
        const { id } =req.params;
        const alergia = await Alergia.findById(id);
        if(!alergia){
            return res.status(404).json({msg:"No encontrado"})
        }
        
        if(alergia.paciente._id.toString() !== req.paciente._id.toString()){
            return res.json({msg: "Accion no válida"});
        }
        
        //Actualizar alergia
       alergia.nombre = req.body.nombre || alergia.nombre;
       alergia.añoDiagnostico = req.body.añoDiagnostico || alergia.añoDiagnostico;

        try {
            const alergiaActualizado = await alergia.save();
            res.json(alergiaActualizado);
        } catch (error) {
            console.log(error)
            
        }
        
        
        };
        const eliminarAlergia= async (req, res)=>{
            const { id } =req.params;
            const alergia = await Alergia.findById(id);
            if(!alergia){
                return res.status(404).json({msg:"No encontrado"})
            }
            
            if(alergia.paciente._id.toString() !== req.paciente._id.toString()){
                return res.json({msg: "Accion no válida"});
            }alergia
        
            try {
                await alergia.deleteOne();
                res.json({msg:"Alergia eliminada"});
            } catch (error) {
                console.log(error)
            }
        
        };    

        const tieneEnfermedad = async (req, res) =>{
            const paciente = await Paciente.findById(req.params.id);
            if(!paciente){
                const error = new error("Hubo un error");
                return res.status(400).json({msg: error.message})
            }
            try{
                paciente.historiaclinica.enfermedad = req.body.enfermedad;
                const pacienteActualizado = await paciente.save();
                res.json(pacienteActualizado)
            
            } catch(error){
                console.log(error)
            }
            
            }

    const agregarEnfermedad= async(req,res)=>{
        const enfermedad= new Enfermedad(req.body);
        
        enfermedad.paciente = req.paciente._id;
        
        try {
            const enfermedadAlmacenado  = await enfermedad.save();
            res.json(enfermedadAlmacenado);
        } catch (error) {
            console.log(error);
        }
        };

        const obtenerEnfermedades = async (req, res) => {
            const enfermedades = await Enfermedad.find().where('paciente').equals(req.paciente);
            
            res.json(enfermedades);
          };
        const obtenerEnfermedad= async (req, res)=>{
            try {
                const enfermedades = await Enfermedad.find().sort({ createdAt: 'desc' })
                res.json( enfermedades)
            } catch (error) {
                console.log(error)
                
            }
        };
        const actualizarEnfermedad= async (req, res)=>{
        
        const { id } =req.params;
        const enfermedad = await Enfermedad.findById(id);
        if(!enfermedad){
            return res.status(404).json({msg:"No encontrado"})
        }
        
        if(enfermedad.paciente._id.toString() !== req.paciente._id.toString()){
            return res.json({msg: "Accion no válida"});
        }
        
        //Actualizar enfermedad
        enfermedad.nombre = req.body.nombre || enfermedad.nombre;
        enfermedad.fechadiagnostico = req.body.fechadiagnostico || enfermedad.fechadiagnostico;
        enfermedad.tratamiento = req.body.tratamiento || enfermedad.tratamiento;
        enfermedad.ultimocontrol = req.body.ultimocontrol || enfermedad.ultimocontrol;
        enfermedad.examenes = req.body.examenes || enfermedad.examenes;
        enfermedad.obsdiagnostico= req.body.obsdiagnostico || enfermedad.obsdiagnostico;
        enfermedad.eventos = req.body.eventos || enfermedad.eventos;

        try {
            const enfermedadActualizado = await enfermedad.save();
            res.json(enfermedadActualizado);
        } catch (error) {
            console.log(error)
            
        }
        
        
        };
        const eliminarEnfermedad= async (req, res)=>{
            const { id } =req.params;
            const enfermedad = await Enfermedad.findById(id);
            if(!enfermedad){
                return res.status(404).json({msg:"No encontrado"})
            }
            
            if(enfermedad.paciente._id.toString() !== req.paciente._id.toString()){
                return res.json({msg: "Accion no válida"});
            }enfermedad
        
            try {
                await enfermedad.deleteOne();
                res.json({msg:"Enfermedad eliminada"});
            } catch (error) {
                console.log(error)
            }
        
        };
        
    const ActualizarEstadoGeneral = async (req, res) =>{
            const paciente = await Paciente.findById(req.params.id);
            if(!paciente){
                const error = new error("Hubo un error");
                return res.status(400).json({msg: error.message})
            }
            try{
                paciente.historiaclinica.estadogeneral = req.body.estadogeneral;
                paciente.historiaclinica.estadogeneralpregunta= req.body.estadogeneralpregunta;
                const pacienteActualizado = await paciente.save();
                res.json(pacienteActualizado)
            
            } catch(error){
                console.log(error)
            }
            
            }
    const ActualizarSueño = async (req, res) =>{
         const paciente = await Paciente.findById(req.params.id);
         if(!paciente){
                 const error = new error("Hubo un error");
               return res.status(400).json({msg: error.message})
            }
            try{
         paciente.historiaclinica.sueño = req.body.sueño;
         paciente.historiaclinica.sueñopregunta = req.body.sueñopregunta;
             const pacienteActualizado = await paciente.save();
             res.json(pacienteActualizado)
                
              } catch(error){
                console.log(error)
             }
                
                }
   const Actualizarsaludmental = async (req, res) =>{
         const paciente = await Paciente.findById(req.params.id);
         if(!paciente){
                 const error = new error("Hubo un error");
               return res.status(400).json({msg: error.message})
            }
            try{
         paciente.historiaclinica.saludmental = req.body.saludmental;
         paciente.historiaclinica.saludmentalpregunta = req.body.saludmentalpregunta;
             const pacienteActualizado = await paciente.save();
             res.json(pacienteActualizado)
                
              } catch(error){
                console.log(error)
             }
                
     }  
    const Actualizaralimentacion = async (req, res) =>{
        const paciente = await Paciente.findById(req.params.id);
        if(!paciente){
                const error = new error("Hubo un error");
              return res.status(400).json({msg: error.message})
           }
           try{
        paciente.historiaclinica.alimentacion = req.body.alimentacion;
            const pacienteActualizado = await paciente.save();
            res.json(pacienteActualizado)
               
             } catch(error){
               console.log(error)
            }
               
    }
    const ActualizarAlcohol = async (req, res) =>{
        const paciente = await Paciente.findById(req.params.id);
        if(!paciente){
            const error = new error("Hubo un error");
            return res.status(400).json({msg: error.message})
        }
        try{
            paciente.historiaclinica.alcohol = req.body.alcohol;
            const pacienteActualizado = await paciente.save();
            res.json(pacienteActualizado)
        
        } catch(error){
            console.log(error)
        }
        
        } 
    const ActualizarDrogas = async (req, res) =>{
            const paciente = await Paciente.findById(req.params.id);
            if(!paciente){
                const error = new error("Hubo un error");
                return res.status(400).json({msg: error.message})
            }
            try{
                paciente.historiaclinica.drogas = req.body.drogas;
                const pacienteActualizado = await paciente.save();
                res.json(pacienteActualizado)
            
            } catch(error){
                console.log(error)
            }
            
            }
    const ActualizarDolor = async (req, res) =>{
       const paciente = await Paciente.findById(req.params.id);
      if(!paciente){
           const error = new error("Hubo un error");
          return res.status(400).json({msg: error.message})
      }
      try{
          paciente.historiaclinica.dolor = req.body.dolor;
          paciente.historiaclinica.dolorpregunta = req.body.dolorpregunta;   
          const pacienteActualizado = await paciente.save();
          res.json(pacienteActualizado)
              
      } catch(error){
           console.log(error)
      }
              
      }                            
    const ActualizarActividad = async (req, res) =>{
            const paciente = await Paciente.findById(req.params.id);
            if(!paciente){
                const error = new error("Hubo un error");
                return res.status(400).json({msg: error.message})
            }
            try{
                paciente.historiaclinica.actividadfisica = req.body.actividadfisica;
                const pacienteActualizado = await paciente.save();
                res.json(pacienteActualizado)
            
            } catch(error){
                console.log(error)
            }
            
            } 
  const GuardarExamen = async (req, res) =>{
  try {
    const { nombre, enfermedadId} = req.body;
    const pacienteId = req.paciente._id;

    let enfermedad = null;
if (enfermedadId) {
  enfermedad = await Enfermedad.findById(enfermedadId); // buscar la enfermedad por su ID
}

    const examen = new Examen({
      nombre,
      enfermedad,
      paciente: pacienteId
    });
    if (req.files?.documento) {
        const result = await uploadDocument(req.files.documento.tempFilePath)
        examen.documento = {
          public_id: result.public_id,
          secure_url: result.secure_url
        }
        await fs.unlink(req.files.documento.tempFilePath)
      }
    const examenguardado = await examen.save();
    res.json(examenguardado);
  } catch (error) {
    if (req.files?.documento) {
        await fs.unlink(req.files.documento.tempFilePath)
      }
    console.log(error);
    res.status(400).json({ error: 'Error al guardar examen' });
  }
};
    const obtenerExamenes= async (req, res)=>{
    try { 
        const examenes =  await Examen.find().where('paciente').equals(req.paciente).populate('enfermedad').populate('quirurgico');
    res.json(examenes); } 
    catch (error) {
    console.log(error);
       }        
    };
    const eliminarExamenes= async (req, res)=>{
        const { id } =req.params;
        const examen = await Examen.findById(id);
        if(!examen){
            return res.status(404).json({msg:"No encontrado"})
        }
        
        if(examen.paciente._id.toString() !== req.paciente._id.toString()){
            return res.json({msg: "Accion no válida"});
        }
    
        try {
            await examen.deleteOne();
            res.json({msg:"Examen eliminada"});
        } catch (error) {
            console.log(error)
        }
    
    };

    const agregarMotivoConsulta= async(req,res)=>{
        const motivoconsulta= new MotivoConsulta(req.body);
        
        motivoconsulta.paciente = req.paciente._id;
        
        try {
            const motivoconsultaAlmacenado  = await motivoconsulta.save();
            res.json(motivoconsultaAlmacenado);
        } catch (error) {
            console.log(error);
        }
        };
    const obtenerMotivoConsultas= async (req, res)=>{
            const motivosconsulta =  await MotivoConsulta.find().where('paciente').equals(req.paciente).sort({fecha: -1}).populate('consulta');
        
            res.json(motivosconsulta);  
        };
    const obtenerMotivoConsultaPorId = async (req, res) => {
            try {
                const { id } = req.params;
              const motivoConsulta = await MotivoConsulta.findById(id); // Buscar el motivo de consulta por ID en la base de datos
          
              if (!motivoConsulta) { // Si no se encontró un motivo de consulta con ese ID
                return res.status(404).json({ mensaje: 'Motivo de consulta no encontrado' });
              }
              const consulta = await Consulta.find({ motivoconsulta: motivoConsulta._id }).populate('profesional');
        
              if (!consulta) {
                return res.status(404).json({ msg: 'Consulta no encontrado' });
              }

              motivoConsulta.consulta = consulta;
              

          
              return res.status(200).json(motivoConsulta); // Devolver el motivo de consulta encontrado
            } catch (error) {
              return res.status(500).json({ mensaje: 'Error al buscar el motivo de consulta', error });
            }
          };
  const actualizarMotivoConsulta= async (req, res)=>{
        
        const { id } =req.params;
        const motivoconsulta = await MotivoConsulta.findById(id);
        if(!motivoconsulta){
            return res.status(404).json({msg:"No encontrado"})
        }
        
        if(motivoconsulta.paciente._id.toString() !== req.paciente._id.toString()){
            return res.json({msg: "Accion no válida"});
        }
        
        //Actualizar motivo de consulta
        motivoconsulta.titulo = req.body.titulo || motivoconsulta.titulo;
        motivoconsulta.descripcion = req.body.descripcion || motivoconsulta.descripcion;
        motivoconsulta.consentimiento = req.body.consentimiento || motivoconsulta.consentimiento;
        motivoconsulta.especialidades = req.body.especialidades || motivoconsulta.especialidades;

        try {
            const motivoconsultaActualizado = await motivoconsulta.save();
            res.json(motivoconsultaActualizado);
        } catch (error) {
            console.log(error)
            
        }
        
        
        };
        const actualizarvisibilidadMotivo= async (req, res)=>{
            try {
                const idMotivoConsulta = req.params.id;
                const motivoConsulta = await MotivoConsulta.findById(idMotivoConsulta);
                if (!motivoConsulta) {
                  return res.status(404).send('Motivo de consulta no encontrado');
                }
                motivoConsulta.visible = !motivoConsulta.visible;
                const motivoConsultaActualizado = await motivoConsulta.save();
                res.status(200).send(motivoConsultaActualizado);
              } catch (error) {
                console.error(error);
                res.status(500).send('Hubo un error al actualizar el motivo de consulta');
              }
            };
    const eliminarMotivoConsulta= async (req, res)=>{
     

            const { id } = req.params;
            const { activo } = req.body;
          
            // Validar que activo sea un valor booleano
            if (typeof activo !== 'boolean') {
              return res.status(400).json({ message: 'El campo activo debe ser un valor booleano' });
            }
          
            try {
              const motivoconsulta = await MotivoConsulta.findOneAndUpdate(
                { _id: id },
                { $set: { activo } },
                { new: true }
              );
              if(motivoconsulta.paciente._id.toString() !== req.paciente._id.toString()){
                return res.json({msg: "Accion no válida"});
            }
  
              if (!motivoconsulta) {
                return res.status(404).json({ message: 'Motivo de consulta no encontrado' });
              }
          
              res.json(motivoconsulta);
            } catch (error) {
              console.error(error);
              res.status(500).json({ message: 'Error al eliminar Motivo de consulta' });
            }
        
        };

        const ActualizarHorario = async (req, res) =>{
            const paciente = await Paciente.findById(req.params.id);
            if(!paciente){
                const error = new error("Hubo un error");
                return res.status(400).json({msg: error.message})
            }
            try{
                paciente.lunes = req.body.lunes;
                paciente.lunesinicio = req.body.lunesinicio;
                paciente.lunesfin = req.body.lunesfin;
                paciente.martes = req.body.martes;
                paciente.martesinicio = req.body.martesinicio;
                paciente.martesfin = req.body.martesfin;
                paciente.miercoles = req.body.miercoles;
                paciente.miercolesinicio = req.body.miercolesinicio;
                paciente.miercolesfin = req.body.miercolesfin;
                paciente.jueves = req.body.jueves;
                paciente.juevesinicio = req.body.juevesinicio;
                paciente.juevesfin = req.body.juevesfin;
                paciente.viernes = req.body.viernes;
                paciente.viernesinicio = req.body.viernesinicio;
                paciente.viernesfin = req.body.viernesfin;
                paciente.sabado = req.body.sabado;
                paciente.sabadoinicio = req.body.sabadoinicio;
                paciente.sabadofin = req.body.sabadofin;
                paciente.domingo = req.body.domingo;
                paciente.domingoinicio = req.body.domingoinicio;
                paciente.domingofin = req.body.domingofin;
                paciente.horasemanainicio = req.body.horasemanainicio;
                paciente.horasemanafin = req.body.horasemanafin;
                paciente.horafindesemanainicio = req.body.horafindesemanainicio;
                paciente.horafindesemanafin = req.body.horafindesemanafin;
                const pacienteActualizado = await paciente.save();
                res.json(pacienteActualizado)
            
            } catch(error){
                console.log(error)
            }
            
        }
        const verConsultas = async (req, res)  => {
            try {
              const consultas = await Consulta.find()
                .populate('profesional')
                .populate('motivoconsulta')
                .populate('tarifaGlobal')
                .populate('tarifa')
                .sort({fechaCreacion: -1});
        
              res.status(200).json(consultas);
            } catch (error) {
              console.log(error);
              res.status(500).json({ message: "Error al obtener las consultas." });
            }
          }
          const Notificacionesleidas = async (req, res)  => {
            const paciente = await Paciente.findById(req.params.id);
          
            try {
              // Buscar las consultas no leídas del paciente
              const Consultaleidas = await Consulta.find({ 
                paciente: paciente._id,
                leidopaciente: false, 
              });
          
              // Actualizar el campo `leidopaciente` de las consultas encontradas
              await Consulta.updateMany({ _id: { $in: Consultaleidas.map(c => c._id) } }, { leidopaciente: true });
          
              // Buscar los motivos de consulta relacionados con el paciente
              const Motivoleido = await MotivoConsulta.find({ 
                paciente: paciente._id,
              });
          
              // Actualizar el campo `leidopacienteinterconsulta` de los motivos de consulta encontrados
              await MotivoConsulta.updateMany({ _id: { $in: Motivoleido.map(c => c._id) } }, { leidopacienteinterconsulta: true });
              return res.status(200).send('Notificaciones actualizadas correctamente');
            } catch (err) {
              console.error(err);
              return res.status(500).send('Error al actualizar el estado de leido de las consultas');
            }
          }
          
          
        
        const VerMasEnConsulta = async (req, res) => {
            try {
                const { id } = req.params;   
                // Buscar la consulta  por ID
                const consulta = await Consulta.findById(id);
                if (!consulta) {
                  return res.status(404).json({ msg: 'consulta no encontrada' });
                }
                // Obtener el profesional relacionado a la consulta
                const profesional = await Profesional.findById(consulta.profesional);
                if (!profesional) {
                  return res.status(404).json({ msg: 'Profesional no encontrado' });
                }

                const motivoconsulta = await MotivoConsulta.findById(consulta.motivoconsulta);
                if (!motivoconsulta) {
                  return res.status(404).json({ msg: 'Motivo de consulta no encontrado' });
                }

                const tarifaGlobal = await Tarifaglobal.findById(consulta.tarifaGlobal);
                const tarifa = await Tarifa.findById(consulta.tarifa);            
                consulta.profesional = profesional;
                consulta.motivoconsulta = motivoconsulta;
                consulta.tarifaGlobal = tarifaGlobal;
                consulta.tarifa = tarifa;


                return res.json(consulta);
              } catch (error) {
                console.error(error.message);
                res.status(500).send('Error en el servidor');
              }
          };

       const RechazarConsulta = async (req,res) => {
        try {
            const { id } = req.params;   
                // Buscar la consulta  por ID
                const consulta = await Consulta.findById(id);
                if (!consulta) {
                  return res.status(404).json({ msg: 'consulta no encontrada' });
                }
        
            // Actualizar el estado de la consulta a "rechazada"
            consulta.estado = "rechazada";
           
            await consulta.save();
        
            // Enviar una respuesta exitosa
            res.status(200).json({ msg: 'El estado de la consulta ha sido cambiado a rechazado.' });
        
          } catch (error) {
            console.error(error.message);
            res.status(500).send('Error en el servidor');
          }
        };
        const ActualizarComentario = async (req, res) => {
            try {
              const consulta = await Consulta.findById(req.params.id);
              if (!consulta) {
                return res.status(404).json({ msg: 'Consulta no encontrada' });
              }
              
              const { comentario } = req.body;
              if (!comentario) {
                return res.status(400).json({ msg: 'Se requiere un comentario para actualizar la consulta' });
              }
          
              consulta.comentario = comentario;
              const consultaActualizada = await consulta.save();
              res.json(consultaActualizada);
            } catch (error) {
              console.error(error.message);
              res.status(500).send('Error en el servidor');
            }
        };
const ActualizarHorarioPaciente = async (req, res) => {
  const { horarios } = req.body;
  const horariosGuardados = [];

  for (const { fecha, horarioinicio, horariofin } of horarios) {
    const horario = new HorarioPaciente({
      fecha: fecha,
      horarioinicio: horarioinicio,
      horariofin: horariofin,
      paciente: req.paciente._id
    });

    try {
      const horarioGuardado = await horario.save();
      horariosGuardados.push(horarioGuardado);
    } catch (error) {
      console.log(error);
      res.status(500).send("Error al guardar el horario del paciente.");
      return;
    }
  }

  res.json(horariosGuardados);
};
const obtenerHorarioPaciente = async (req, res) => {
  const fechaActual = moment().startOf('day'); // Obtenemos la fecha actual en Santiago, al comienzo del día
  const horaripaciente = await HorarioPaciente.find({
    paciente: req.paciente,
    fecha: { $gte: fechaActual.toDate() }
  });
  res.json(horaripaciente);
};

          const eliminarHorario= async (req, res)=>{
            const { id } =req.params;
            const horariopaciente = await HorarioPaciente.findById(id);
            if(!horariopaciente){
                return res.status(404).json({msg:"No encontrado"})
            }
            
            if(horariopaciente.paciente._id.toString() !== req.paciente._id.toString()){
                return res.json({msg: "Accion no válida"});
            }
        
            try {
                await horariopaciente.deleteOne();
                res.json({msg:"Horario del paciente eliminado"});
            } catch (error) {
                console.log(error)
            }
        
        };

        const actualizarHorariodisponible = async (req, res) => {
            try {
              const horario = await HorarioPaciente.findById(req.params.id);
              if (!horario) {
                return res.status(404).json({ msg: 'horario no encontrada' });
              }
                               
              horario.fecha = req.body.fecha;
              horario.horarioinicio = req.body.horarioinicio;
              horario.horariofin = req.body.horariofin;
              const consultaActualizada = await horario.save();
              res.json(consultaActualizada);
            } catch (error) {
              console.error(error.message);
              res.status(500).send('Error en el servidor');
            }
          };

          cron.schedule('0 0 * * *', async () => {
            // Busca todas las consultas pendientes
            const consultasPendientes = await Consulta.find({ estado: 'pagado' });
          
            // Para cada consulta pendiente, verifica si la fecha de la consulta ha pasado
            consultasPendientes.forEach(async consulta => {
              const fechaActual = new Date();
              if (fechaActual > consulta.fecha) {
                // Si la fecha ha pasado, actualiza el estado de la consulta a "finalizado"
                consulta.estado = 'finalizado';
                await consulta.save();
              }
            });
          });
          cron.schedule('0 0 * * *', async () => {
            const consultasPendientes = await Consulta.find({ estado: 'pendiente' });
            
            consultasPendientes.forEach(async consulta => {
              const fechaActual = new Date();
              if (fechaActual > consulta.fecha) {
                consulta.estado = 'rechazada';
                await consulta.save();
              }
            });
          });
          const getProximasConsultas = async () => {
            const ahora = new Date();
            const consultas = await Consulta.find({
              fecha: { $gte: ahora, $lt: new Date(ahora.getTime() + (24 * 60 * 60 * 1000)) },
              estado: 'pagado',
            }).populate('paciente');
          
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
          
            return consultasDesencriptadas;
          };

          const RecordatorioConsultasdia = async (req, res) => {
            try {
              const consultas = await getProximasConsultas();
              res.json(consultas);
            } catch (error) {
              res.status(500).json({ message: error.message });
            }
          };
          const subirFotoMotivo = async (req, res) => {
            const {nombre, descripcion } = req.body;
            const motivo= await MotivoConsulta.findById(req.params.id);
            if (!motivo) {
              const error = new Error("Motivo de consulta no encontrado");
              return res.status(400).json({ msg: error.message });
            }
          
            try {
              if (!req.files?.image) {
                const error = new Error("Seleccione una imagen para subir");
                return res.status(400).json({ msg: error.message });
              }
          
              const result = await uploadImageMotivo(req.files.image.tempFilePath);
              const imagenMotivo = new ImagenesMotivo({
                public_id: result.public_id,
                secure_url: result.secure_url,
                motivoconsulta: motivo._id,
                nombre,
                descripcion
              });
              await imagenMotivo.save();
              await fs.unlink(req.files.image.tempFilePath);
              res.json(imagenMotivo);
            } catch (error) {
              console.log(error);
              res.status(500).json({ msg: "Error al subir la imagen" });
            }
          };
          const obtenerImagenesPorMotivo = async (req, res) => {
            try {
              const id = req.params.id;
              const imagenes = await ImagenesMotivo.find({ motivoconsulta: id });
              res.json(imagenes);
            } catch (error) {
              console.log(error);
              res.status(500).json({ msg: 'Error al obtener las imágenes' });
            }
          };
          const eliminarImagenMotivo = async (req, res) => {
            const { id } = req.params;
            const imagenMotivo = await ImagenesMotivo.findById(id);     
            if (!imagenMotivo) {
              return res.status(404).json({ msg: 'No encontrado' });
            }          
            try {
              // Eliminar la imagen de Cloudinary
              await deleteImage(imagenMotivo.public_id);       
              // Eliminar la imagen de la base de datos
              await imagenMotivo.deleteOne();         
              res.json({ msg: 'Motivo de consulta eliminado' });
            } catch (error) {
              console.log(error);
              res.status(500).json({ msg: 'Hubo un error al eliminar la imagen' });
            }
          };
          const actualizarvisibilidadImagenMotivo= async (req, res)=>{
            try {
                const id = req.params.id;
                const imagenesmotivo = await ImagenesMotivo.findById(id);
                if (!imagenesmotivo) {
                  return res.status(404).send('Imagen de Motivo de consulta no encontrado');
                }
                imagenesmotivo.visible = !imagenesmotivo.visible;
                const imagenesmotivoActualizado = await imagenesmotivo.save();
                res.status(200).send(imagenesmotivoActualizado);
              } catch (error) {
                console.error(error);
                res.status(500).send('Hubo un error al actualizar el motivo de consulta');
              }
            };
            const actualizarInformacionMotivo = async (req, res) => {
                const { id } = req.params;
                const { informacion } = req.body;
                try {
                    const motivoConsulta = await MotivoConsulta.findOneAndUpdate(
                      { _id: id },
                      { $set: { informacion: informacion } },
                      { new: true }
                    );
                    res.json(motivoConsulta);
                  } catch (error) {
                    console.error(error);
                    res.status(500).json({ message: 'Error al actualizar el motivo de consulta' });
                  }
              };

              const obtenerEducacionPorProfesionalId = async (req, res) => {
                try {
                  const { id } = req.params;
                  const educacion = await Educacion.find({ profesional: id }).populate('profesional');
                  res.status(200).json(educacion);
                } catch (error) {
                  console.log(error);
                  res.status(500).json({ message: "Error al obtener la educación." });
                }
              }
              const obtenerExperienciaPorProfesionalId = async (req, res) => {
                try {
                  const { id } = req.params;
                  const experiencia = await Experiencia.find({ profesional: id }).populate('profesional');
                  res.status(200).json(experiencia);
                } catch (error) {
                  console.log(error);
                  res.status(500).json({ message: "Error al obtener la experiencia" });
                }
              }
              const obtenerEspecialidadPorProfesionalId = async (req, res) => {
                try {
                  const { id } = req.params;
                  const especialidad = await Especialidad.find({ profesional: id }).populate('profesional');
                  res.status(200).json(especialidad);
                } catch (error) {
                  console.log(error);
                  res.status(500).json({ message: "Error al obtener la especialidad" });
                }
              }

            const agregarSeguimientoMotivo= async(req,res)=>{
                const { nombre, descripcion } = req.body;
                const pacienteId = req.paciente._id;
                const motivo= await MotivoConsulta.findById(req.params.id);
                if (!motivo) {
                  const error = new Error("Motivo de consulta no encontrado");
                  return res.status(400).json({ msg: error.message });
                }
                try {

                  const seguimientoMotivo = new SeguimientoMotivo({
                    nombre,
                    descripcion,
                    motivoconsulta: motivo._id,
                    paciente: pacienteId
                  });
                  await seguimientoMotivo.save();
                  res.json(seguimientoMotivo);
                } catch (error) {
                    console.log(error);
                }
                };
            const obtenerSeguimientoMotivoPaciente= async (req, res)=>{
              try {
                const id = req.params.id;
                const seguimiento = await SeguimientoMotivo.find({ motivoconsulta: id });
                res.json(seguimiento);
              } catch (error) {
                console.log(error);
                res.status(500).json({ msg: 'Error al obtener el seguimiento' });
              }
                };
            const actualizarSeguimientoPaciente= async (req, res)=>{
                  const {id} =req.params;
                  const seguimiento = await SeguimientoMotivo.findById(id);
                  if(!seguimiento){
                      return res.status(404).json({msg:"No encontrado"})
                  }   
                  if(seguimiento.paciente._id.toString() !== req.paciente._id.toString()){
                    return res.json({msg: "Accion no válida"});
                }      
                  //Actualizar motivo de consulta
                 seguimiento.nombre = req.body.nombre || seguimiento.nombre;
                 seguimiento.descripcion = req.body.descripcion || seguimiento.descripcion;
                  try {
                      const seguimientoActualizado = await seguimiento.save();
                      res.json(seguimientoActualizado);
                  } catch (error) {
                      console.log(error)        
                  }         
                };
                const eliminarSeguimientoPaciente= async (req, res)=>{
                  const { id } =req.params;
                  const seguimiento= await SeguimientoMotivo.findById(id);
                  if(!seguimiento){
                      return res.status(404).json({msg:"No encontrado"})
                  }
                  
                  if(seguimiento.paciente._id.toString() !== req.paciente._id.toString()){
                      return res.json({msg: "Accion no válida"});
                  }        
                  try {
                      await seguimiento.deleteOne();
                      res.json({msg:"Seguimiento eliminado"});
                  } catch (error) {
                      console.log(error)
                  }
              
              };
              const verListaConsultasPaciente = async (req, res)  => {
                try {
                    const consultas = await Consulta.find()
                    .populate('paciente')
                    .populate('motivoconsulta').populate('tarifaGlobal').populate('tarifa')
                            res.status(200).json(consultas);
                          } catch (error) {
                            console.log(error);
                            res.status(500).json({ message: "Error al obtener las consultas." });
                          }
               }  
               const verMasEnConsultaPaciente = async (req, res) => {
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
              
              
              const consultarConsultasAceptadas = async (req, res)  => {
                const paciente = await Paciente.findById(req.params.id);
                const consultasproAceptadas = await Consulta.find({ 
                   paciente: paciente._id,
                   leidopacienteheader: false, 
                   estado: 'pagado'
                });
                const consultasPendientes = await Consulta.find({ 
                    paciente: paciente._id,
                    leidopacienteheader: false, 
                    estado: 'pendiente'
                 });
                 const consultasRechazadas = await Consulta.find({ 
                    paciente: paciente._id,
                    leidopacienteheader: false, 
                    estado: 'rechazada'
                 });
                 const consultasFinalizadas = await Consulta.find({ 
                  paciente: paciente._id,
                  leidopacienteheader: false, 
                  estado: 'finalizado'
               });
                
                
                  try {
                    // Actualizar el campo `leido` de las consultas encontradas
                    await Consulta.updateMany({ _id: { $in: consultasproAceptadas.map(c => c._id) } }, { leidopacienteheader: true });
                  } catch (err) {
                    console.error(err);
                    return res.status(500).send('Error al actualizar el estado de leido de las consultas');
                  }
                  try {
        
                    await Consulta.updateMany({ _id: { $in: consultasPendientes.map(c => c._id) } }, { leidopacienteheader: true });
                  } catch (err) {
                    console.error(err);
                    return res.status(500).send('Error al actualizar el estado de leido de las consultas');
                  }
                  try {
                    await Consulta.updateMany({ _id: { $in: consultasRechazadas.map(c => c._id) } }, { leidopacienteheader: true });
                  } catch (err) {
                    console.error(err);
                    return res.status(500).send('Error al actualizar el estado de leido de las consultas');
                  }
                  try {
                    await Consulta.updateMany({ _id: { $in: consultasFinalizadas.map(c => c._id) } }, { leidopacienteheader: true });
                  } catch (err) {
                    console.error(err);
                    return res.status(500).send('Error al actualizar el estado de leido de las consultas');
                  }
                
                      
            }

            const ActualizarpreguntasSaludgeneral = async (req, res) => {
              const paciente = await Paciente.findById(req.params.id);
              if (!paciente) {
                const error = new Error("Hubo un error");
                return res.status(400).json({ msg: error.message });
              }
            
              try {
                paciente.historiaclinica.estadogeneralpregunta = req.body.estadogeneralpregunta;
            
                if (req.body.estadogeneralpregunta === 'Si') {
                  paciente.historiaclinica.procesopreguntas = req.body.procesopreguntas;
                }
            
                const pacienteActualizado = await paciente.save();
                res.json(pacienteActualizado);
              } catch (error) {
                console.log(error);
              }
            }; 
          const ActualizarpreguntasSueño = async (req, res) =>{
            const paciente = await Paciente.findById(req.params.id);
            if(!paciente){
                    const error = new error("Hubo un error");
                  return res.status(400).json({msg: error.message})
               }
               try{
            paciente.historiaclinica.sueñopregunta = req.body.sueñopregunta;
            if (req.body.sueñopregunta === 'Si') {
              paciente.historiaclinica.procesopreguntas = req.body.procesopreguntas;
            }
                const pacienteActualizado = await paciente.save();
                res.json(pacienteActualizado)
                   
                 } catch(error){
                   console.log(error)
                }              
        } 
        const ActualizarpreguntasSaludMental = async (req, res) =>{
          const paciente = await Paciente.findById(req.params.id);
          if(!paciente){
                  const error = new error("Hubo un error");
                return res.status(400).json({msg: error.message})
             }
             try{
          paciente.historiaclinica.saludmentalpregunta = req.body.saludmentalpregunta;
          if (req.body.saludmentalpregunta === 'Si') {
            paciente.historiaclinica.procesopreguntas = req.body.procesopreguntas;
          }
              const pacienteActualizado = await paciente.save();
              res.json(pacienteActualizado)
                 
               } catch(error){
                 console.log(error)
              }              
      }


      const ActualizarpreguntasDolor = async (req, res) =>{
        const paciente = await Paciente.findById(req.params.id);
        if(!paciente){
                const error = new error("Hubo un error");
              return res.status(400).json({msg: error.message})
           }
           try{
        paciente.historiaclinica.dolorpregunta = req.body.dolorpregunta;
        if (req.body.dolorpregunta  === 'Si') {
          paciente.historiaclinica.procesopreguntas = req.body.procesopreguntas;
        }
            const pacienteActualizado = await paciente.save();
            res.json(pacienteActualizado)
               
             } catch(error){
               console.log(error)
            }              
    } 
    const Actualizarprocesopreguntas = async (req, res) =>{
      const paciente = await Paciente.findById(req.params.id);
      if(!paciente){
              const error = new error("Hubo un error");
            return res.status(400).json({msg: error.message})
         }
         try{
      paciente.historiaclinica.procesopreguntas = req.body.procesopreguntas;
          const pacienteActualizado = await paciente.save();
          res.json(pacienteActualizado)
             
           } catch(error){
             console.log(error)
          }              
  } 
  const EditarDocumentoExamen = async (req, res) => {
    try {
      const { id } = req.params; // Obtener el ID del examen a editar
      const { documento } = req.files;
  
      if (!documento) {
        return res.status(400).json({ error: 'Seleccione un documento' });
      }
      const examen = await Examen.findById(id);
  
      if (!examen) {
        return res.status(404).json({ error: 'El examen no existe' });
      }
  
      // Realizar la lógica para subir el nuevo documento y eliminar el anterior
      const result = await uploadDocument(documento.tempFilePath);
      examen.documento = {
        public_id: result.public_id,
        secure_url: result.secure_url
      };
      await fs.unlink(documento.tempFilePath);
  
      examen.estado = true; // Cambiar el estado a true
  
      const examenActualizado = await examen.save();
  
      res.json(examenActualizado);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Error al editar el documento del examen' });
    }
  };

  const AceptarConsulta = async (req, res) => {
    try {
      const { id } = req.params;
  
      // Buscar la consulta por ID
      const consulta = await Consulta.findById(id)
        .populate('motivoconsulta')
        .populate('paciente')
        .populate('profesional');
      if (!consulta) {
        return res.status(404).json({ msg: 'Consulta no encontrada' });
      }
  
      const fechaActual = new Date();
      const fechaaceptada =
        fechaActual.getDate() +
        '/' +
        (fechaActual.getMonth() + 1) +
        '/' +
        fechaActual.getFullYear();
  
      // Actualizar el estado de la consulta a "pagado"
      consulta.fechaaceptada = fechaaceptada;
      consulta.estado = 'pagado';
      await consulta.save();
  
      // Obtener los valores relevantes de la consulta
      const { fecha, paciente, horarioinicio, horariofin, profesional } = consulta;
  
      // Buscar consultas superpuestas pendientes del mismo profesional en la misma fecha
      const consultasSuperpuestas = await Consulta.find({
        profesional,
        fecha,
        _id: { $ne: id }, // Excluir la consulta actual
        estado: 'pendiente',
        $or: [
          { horarioinicio: { $lte: horariofin }, horariofin: { $gte: horarioinicio } },
          { horarioinicio: { $gte: horarioinicio, $lte: horariofin } },
        ],
      });
  
      // Cambiar el estado de las consultas superpuestas a "rechazada"
      if (consultasSuperpuestas.length > 0) {
        await Consulta.updateMany(
          { _id: { $in: consultasSuperpuestas.map((c) => c._id) } },
          { estado: 'rechazada' }
        );
      }
  
      // Buscar horarios disponibles que se superpongan con el horario de la consulta
      const horariosCoincidentes = await HorarioPaciente.find({
        paciente,
        fecha,
        horarioinicio: { $lte: horariofin },
        horariofin: { $gte: horarioinicio },
      });
  
      // Eliminar los horarios encontrados
      if (horariosCoincidentes.length > 0) {
        await HorarioPaciente.deleteMany({
          paciente,
          fecha,
          horarioinicio: { $lte: horariofin },
          horariofin: { $gte: horarioinicio },
        });
      }
  
      // Desencriptar los datos necesarios
      const desencriptadoNombres = desencriptarDatoSJCL(consulta.paciente.nombres);
      const desencriptadoApellidos = desencriptarDatoSJCL(consulta.paciente.apellidos);
  
      // Enviar email con instrucciones y datos desencriptados
      emailConsultaAceptada({
        nombres: consulta.profesional.nombres,
        apellidos: consulta.profesional.apellidos,
        email: consulta.profesional.email,
        tituloMotivoConsulta: consulta.motivoconsulta.titulo,
        fechaConsulta: consulta.fecha,
        inicio: consulta.horarioinicio,
        fin: consulta.horariofin,
        id: consulta._id,
        tarifaConsulta: consulta.precio,
        NombrePaciente: desencriptadoNombres,
        ApellidoPaciente: desencriptadoApellidos,
      });
  
      // Enviar una respuesta exitosa
      res.status(200).json({ msg: 'El estado de la consulta ha sido cambiado a pagado.' });
    } catch (error) {
      console.error(error.message);
      res.status(500).send('Error en el servidor');
    }
  };
  
  const Actualizarpreguntaspaciente= async (req, res)=>{
    const { id } =req.params;
    const consulta = await Consulta.findById(id);
    if(!consulta){
        return res.status(404).json({msg:"No encontrado"})
    }
    if(consulta.paciente._id.toString() !== req.paciente._id.toString()){
      return res.json({msg: "Accion no válida"});
  }                 
   consulta.preguntaspaciente = req.body.preguntaspaciente;

    try {
        const consultasActualizadas = await consulta.save();
        res.json(consultasActualizadas);
    } catch (error) {
        console.log(error)        
    }         
  }; 
  const RechazarInterconsulta = async (req,res) => {
    try {
        const { id } = req.params;   
            // Buscar la consulta  por ID
            const motivo = await MotivoConsulta.findById(id);
            if (!motivo) {
              return res.status(404).json({ msg: 'Motivo no encontrado' });
            }
    
        // Actualizar datos de motivo para limpiar todo por defecto 
        motivo.interconsulta = "No";
        motivo.notificacioninterconsulta = false;
        motivo.propuestainterconsulta = null;
        motivo.motivointerconsulta = null;

       
        await motivo.save();
    
        // Enviar una respuesta exitosa
        res.status(200).json({ msg: 'El estado del motivo ha sido cambiado ' });
    
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
      }
    };
    const AceptarInterconsulta = async (req, res) => {
      try {
        const { id } = req.params;   
        // Buscar la consulta por ID
        const motivo = await MotivoConsulta.findById(id);
        if (!motivo) {
          return res.status(404).json({ msg: 'Motivo no encontrado' });
        }
      
        // Copiar los datos de propuestainterconsulta a especialidades
        motivo.especialidades = motivo.propuestainterconsulta;
      
        // Actualizar datos de motivo para limpiar todo por defecto 
        motivo.interconsulta = "Interconsulta";
        motivo.notificacioninterconsulta = false;
        motivo.visible = true;
      
        await motivo.save();
      
        // Enviar una respuesta exitosa
        res.status(200).json({ msg: 'El estado del motivo ha sido cambiado ' });
      
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
      }
    };

    const ObtenerControlesMotivo= async (req, res)=>{
      try {
        const { id } =req.params;
        const controles = await Controles.find({ paciente: id })
        .populate('paciente')
        .populate('motivoconsulta')
        .populate('profesional')
  
      res.json(controles);
      } catch (error) {
          console.log(error)
          
      }
    };
    const HistoriaclinicaPDF = async (req, res) => {
      try {
        const { id } = req.params;
        const paciente = await Paciente.findById(id);
        
        paciente.nombres = desencriptarDatoSJCL(paciente.nombres);
        paciente.apellidos = desencriptarDatoSJCL(paciente.apellidos);
        paciente.rut = desencriptarDatoSJCL(paciente.rut);
  
        // Buscar datos relacionados en la tabla "Enfermedad"
          const enfermedades = await Enfermedad.find({ paciente: id });
          // Buscar datos relacionados en la tabla "Enfermedad"
          const farmacos = await Farmaco.find({ paciente: id });
          const farmacosprevio = await Farmacoprevios.find({ paciente: id });
          const quirurgico = await Quirurgico.find({ paciente: id });
          const antecedentes = await AntecedentesFam.find({ paciente: id });
          const alergias = await Alergia.find({ paciente: id });
                  
        res.status(200).json({paciente,enfermedades,farmacos,farmacosprevio,quirurgico,antecedentes,alergias});
      } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Error al obtener datos de la historia clínica" });
      }
    };
    const Obtenerunaconsulta = async (req, res) => {
      try {
        const { id } = req.params;
        // Buscar la consulta por ID
        const consulta = await Consulta.findById(id).populate('motivoconsulta').populate('profesional');
        if (!consulta) {
          return res.status(404).json({ msg: 'consulta no encontrada' });
        }
    
        // Buscar los farmacos que coincidan con el campo motivoconsulta
        const farmaco = await Farmaco.find({ motivoconsulta: consulta.motivoconsulta });
        const examenessolicitado = await Examensolicitado.find({ consulta: consulta._id });
        const recetas = await Receta.find({ consulta: consulta._id });
    
        // Agregar los farmacos encontrados al objeto consulta
        consulta.farmaco = farmaco;
        consulta.examenessolicitado = examenessolicitado;
        consulta.recetas = recetas;
    
        return res.json(consulta);
      } catch (error) {
        console.error(error.message);
        res.status(500).send('Error en el servidor');
      }
    };
    
    

export{
    registrar,
    perfil,
    confirmar,
    autenticar,
    olvidePassword,
    comprobarToken,
    nuevoPassword,
    actualizarPerfil,
    actualizarPassword,
    subirFotoPerfil,
    actualizarContacto,
    ActualizarNoPatologico,
    agregarAlergia,
    obtenerAlergia,
    obtenerAlergias,
    actualizarAlergia,
    eliminarAlergia,
    tieneAlergia,
    agregarEnfermedad,
    obtenerEnfermedad,
    obtenerEnfermedades,
    actualizarEnfermedad,
    eliminarEnfermedad,
    tieneEnfermedad,
    ActualizarEstadoGeneral,
    ActualizarSueño,
    Actualizarsaludmental,
    Actualizaralimentacion,
    ActualizarAlcohol,
    ActualizarDrogas,
    ActualizarDolor,
    ActualizarActividad,
    GuardarExamen,
    obtenerExamenes,
    agregarMotivoConsulta,
    obtenerMotivoConsultas,
    actualizarMotivoConsulta,
    eliminarMotivoConsulta,
    ActualizarHorario,
    eliminarExamenes,
    actualizarvisibilidadMotivo,
    verConsultas,
    Notificacionesleidas,
    VerMasEnConsulta,
    RechazarConsulta,
    ActualizarComentario,
    ActualizarHorarioPaciente,
    obtenerHorarioPaciente,
    eliminarHorario,
    actualizarHorariodisponible,
    RecordatorioConsultasdia,
    obtenerMotivoConsultaPorId,
    subirFotoMotivo,
    obtenerImagenesPorMotivo,
    eliminarImagenMotivo,
    actualizarvisibilidadImagenMotivo,
    actualizarInformacionMotivo,
    obtenerEducacionPorProfesionalId,
    obtenerExperienciaPorProfesionalId,
    obtenerEspecialidadPorProfesionalId,
    agregarSeguimientoMotivo,
    obtenerSeguimientoMotivoPaciente,
    actualizarSeguimientoPaciente,
    eliminarSeguimientoPaciente,
    verListaConsultasPaciente,
    verMasEnConsultaPaciente,
    consultarConsultasAceptadas,
    ActualizarpreguntasSaludgeneral,
    ActualizarpreguntasSueño,
    ActualizarpreguntasSaludMental,
    ActualizarpreguntasDolor,
    Actualizarprocesopreguntas,
    EditarDocumentoExamen,
    AceptarConsulta,
    Actualizarpreguntaspaciente,
    RechazarInterconsulta,
    AceptarInterconsulta,
    ObtenerControlesMotivo,
    HistoriaclinicaPDF,
    Obtenerunaconsulta
}