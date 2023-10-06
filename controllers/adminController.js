import Admin from "../models/Admin.js";
import generarjwt from "../helpers/generarjwt.js";
import generarId from "../helpers/generarid.js";
import emailPasswordadmin from "../helpers/emailPasswordadmin.js";
import emailRegistroadmin from "../helpers/emailregistroadmin.js";
import Profesional from "../models/Profesional.js";
import emailregistroPro from "../helpers/emailregistroPro.js";
import Paciente from "../models/Paciente.js";
import emailRegistro from"../helpers/emailRegistro.js"
import {  deleteImage, uploadFirma} from "../utils/cloudinary.js";
import sjcl from "sjcl";
import fs from "fs-extra"
import emailRegistroPaciente from "../helpers/emailRegistroPaciente.js";
import MotivoConsulta from "../models/MotivoConsulta.js";
import Consulta from "../models/Consultas.js";
const clave = "1234567890123456";

function desencriptarDatoSJCL(datoEncriptado) {
  const decryptedData = sjcl.decrypt(clave, datoEncriptado);
  return decryptedData;
}
function encriptarDato(dato) {
    const clave = '1234567890123456';
    const datoEncriptado = sjcl.encrypt(clave, dato);
    return datoEncriptado;
  }

const registrar = async(req,res)=>{
const { email, nombre } = req.body;
    //prevenir usuarios duplicados
const existeUsuario =  await Admin.findOne({email:email});
if(existeUsuario){
    const error = new Error("Este usuario ya esta registrado, intente recuperar su cuenta");
    return res.status(400).json({msg: error.message});
}
    try {
        //Guardar nuevo veterinario
        const admin = new Admin(req.body);
        const adminGuardado = await admin.save();
        //Enviar email
        emailRegistroadmin({
            email,
            nombre,
            token:adminGuardado.token,
        });


        res.json( adminGuardado );

    } catch (error) {
        console.log(error)
    }
    
    };

const perfil=(req, res )=>{

    const {admin}=req;
    res.json( admin)
    };


const confirmar = async(req,res)=>{
const {token} = req.params
const usuarioConfirmar = await Admin.findOne({token:token})
if(!usuarioConfirmar){
 const error = new Error("Token invalido")
 return res.status(400).json({msg: error.message});   
}
try {
    usuarioConfirmar.token = null;
    usuarioConfirmar.confirmado=true;   
    await usuarioConfirmar.save();
    res.json( {msg:'Usuario confirmado correctamente'} )
} catch (error) {
    console.log(error)
}

    };

const autenticar = async (req, res) => {

    const {email, password }  =req.body;
    //comprobar si el usuario existe
    const usuario= await Admin.findOne({email: email});
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
        nombre:usuario.nombre,
        email:usuario.email,
        tokenAdm: generarjwt(usuario.id) }
       
       );
 
}else{
    const error = new Error("Datos incorrectos");
    return res.status(403).json(  {msg: error.message});
}

}   

// Funcion olvide contraseña

const olvidePassword = async (req, res)=>{
    const {email}= req.body;

    const existeAdmin =  await Admin.findOne({email:email});
    if(!existeAdmin){
        const error = new Error(" El Administrador no existe");
        return res.status(400).json({msg: error.message});
    }
    try {
        existeAdmin.token = generarId();
        await existeAdmin.save();
        // Enviar email con instrucciones para cambiar contraseña

        emailPasswordadmin({
            email,
            nombre: existeAdmin.nombre,
            token: existeAdmin.token,
        })
        res.json({msg:"Revise su correo electrónico para recuperar su contraseña"})
    } catch (error) {
        console.log(error)
    }


};
const comprobarToken = async(req, res)=>{
const {token} = req.params;

const tokenValido = await Admin.findOne({token:token});

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

const admin = await Admin.findOne({token:token});
if(!admin){
    const error = new Error("Hubo un error");
    return res.status(400).json({msg:error.message});
}
try {
    admin.token=null;
    admin.password=password;
    await admin.save()
    res.json({msg: "Password modificado correctamente"});
} catch (error) {
    console.log(error)
}
};
const registroProfesional = async (req, res) => {
    const { email, nombres } = req.body;
    const { rut } = req.body;
    const existeUsuario = await Profesional.findOne({ email: email });
    const existeUsuariorut = await Profesional.findOne({ rut });
    const existePaciente = await Paciente.findOne({ email: email });
  
    // Valida si ya existe un usuario con correo o rut
    if (existeUsuario || existeUsuariorut || existePaciente) {
      const error = new Error('Este profesional ya está registrado en el sistema');
      return res.status(400).json({ msg: error.message });
    }
  
    try {
      const profesional = new Profesional(req.body);
  
      if (req.files?.firma) {
        const result = await uploadFirma(req.files.firma.tempFilePath);
  
        profesional.firma = {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };
  
        await fs.unlink(req.files.firma.tempFilePath);
      } else {
        const error = new Error('Seleccione una imagen para subir');
        return res.status(400).json({ msg: error.message });
      }
      const rutDigits = rut.split('-')[0]; // Obtiene los dígitos del RUT sin el guión
      const password = rutDigits.slice(-6); // Obtiene los últimos 6 dígitos del RUT
      const profesionalGuardado = await profesional.save();
  
      const paciente = new Paciente(req.body);
      const pacienteGuardado = await paciente.save();
      // Enviar email
      emailregistroPro({
        email,
        nombres,
        rut,
        token: profesionalGuardado.token,
      });
  
      emailRegistroPaciente({
        email,
        nombres,
        password,
        token: pacienteGuardado.token,
      });
  
      // Enviar respuestas adecuadas
      res.json({
        profesional: profesionalGuardado,
        paciente: pacienteGuardado,
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ msg: 'Error interno del servidor' });
    }
  };
const verAdmin= async(req, res)=>{
    try {
        const admins = await Admin.find()
        res.json( admins)
    } catch (error) {
        console.log(error)
        
    }
    };

const actualizarAdmin= async (req, res)=>{

        const { id } =req.params;
        const admin = await Admin.findById(id);
        if(!admin){
            return res.status(404).json({msg:"No encontrado"})
        }
        
        //Actualizar paciente
        admin.nombre = req.body.nombre || admin.nombre;
        admin.apellidos = req.body.apellidos || admin.apellidos;
       admin.rut = req.body.rut || admin.rut;
        admin.email = req.body.email|| admin.email;
        admin.fecha = req.body.fecha|| admin.fecha
        admin.telefono = req.body.telefono|| admin.telefono      
        try {
            const adminActualizado = await admin.save();
            res.json(adminActualizado);
        } catch (error) {
            console.log(error)
            
 } };

 const eliminarAdmin= async (req, res)=>{

            const { id } =req.params;
            const admin = await Admin.findById(id);
            if(!admin){
                return res.status(404).json({msg:"No encontrado"})
            }

            try {
                await admin.deleteOne();
                res.json({msg: "Administrador eliminado correctamente"})
            } catch (error) {
                console.log(error)
            }
            
}

const registroAdmin = async (req, res) =>{
    const { email, nombre } = req.body;
    const { rut } = req.body;
    const existeUsuario = await Admin.findOne({ email:email})
    const existeUsuariorut = await Admin.findOne({ rut})
    //Valida si ya existe un usuario con correo o rut
    if (existeUsuario || existeUsuariorut){
        const error =  new Error("Este administrador ya esta registrado en el sistema");
        return res.status(400).json({msg: error.message})
    }
    try {
        //Guardar nuevo profesional
        const rutDigits = rut.split('-')[0]; // Obtiene los dígitos del RUT sin el guión
        const password = rutDigits.slice(-6); // Obtiene los últimos 6 dígitos del RUT
        const admin = new Admin(req.body);
        const adminGuardado = await admin.save();
        //Enviar email
           //Enviar email
           emailRegistroadmin({
            email,
            nombre,
            password,
            token:adminGuardado.token,
        });
        res.json( adminGuardado );

    } catch (error) {
        console.log(error)
    }
    
}
const verProfesional= async(req, res)=>{
    try {
        const profesionales = await Profesional.find()
        res.json( profesionales)
    } catch (error) {
        console.log(error)
        
    }
    };

    const actualizarProfesional = async (req, res) => {
        const { id } = req.params;
        try {
          const profesional = await Profesional.findById(id);
          if (!profesional) {
            return res.status(404).json({ msg: 'No encontrado' });
          }
      
          // Actualizar campos del profesional
          profesional.nombres = req.body.nombres || profesional.nombres;
          profesional.apellidos = req.body.apellidos || profesional.apellidos;
          profesional.rut = req.body.rut || profesional.rut;
          profesional.email = req.body.email || profesional.email;
          profesional.especialidad = req.body.especialidad || profesional.especialidad;
          profesional.fechaNacimiento = req.body.fechaNacimiento || profesional.fechaNacimiento;
          profesional.sexo = req.body.sexo || profesional.sexo;
          profesional.telefono = req.body.telefono || profesional.telefono;
      
          // Actualizar firma si se proporciona una nueva
          if (req.files?.firma) {

             
               if(profesional.firma.public_id){
                await deleteImage(profesional.firma.public_id)
               }
            const result = await uploadFirma(req.files.firma.tempFilePath);
            profesional.firma = {
              public_id: result.public_id,
              secure_url: result.secure_url,
            };
            await fs.unlink(req.files.firma.tempFilePath);
          }
      
          const profesionalActualizado = await profesional.save();
          res.json(profesionalActualizado);
        } catch (error) {
          console.log(error);
          res.status(500).json({ msg: 'Error al actualizar el profesional' });
        }
      };
      

 const eliminarProfesional= async (req, res)=>{

            const { id } =req.params;
            const profesional = await Profesional.findById(id);
            if(!profesional){
                return res.status(404).json({msg:"No encontrado"})
            }

            try {
                await profesional.deleteOne();
                res.json({msg: "Profesional eliminado correctamente"})
            } catch (error) {
                console.log(error)
            }
            
}



const registroPaciente = async (req, res) =>{
    const { email, nombres } = req.body;
    const { rut } = req.body;
    const existeUsuario = await Paciente.findOne({ email:email})
    const existeUsuariorut = await Paciente.findOne({rut})
    //Valida si ya existe un usuario con correo o rut
    if (existeUsuario || existeUsuariorut){
        const error =  new Error("Este paciente ya esta registrado en el sistema");
        return res.status(400).json({msg: error.message})
    }
    try {
        //Guardar nuevo paciente
        const rutDigits = rut.split('-')[0]; // Obtiene los dígitos del RUT sin el guión
        const password = rutDigits.slice(-6); // Obtiene los últimos 6 dígitos del RUT
        const paciente = new Paciente(req.body);
        const pacienteGuardado = await paciente.save();
        //Enviar email
           //Enviar email
           emailRegistro({
            email,
            nombres,
            password,
            token: pacienteGuardado.token,
        }
        )
        res.json( pacienteGuardado );

    } catch (error) {
        console.log(error)
    }    
}


const verPaciente = async (req, res) => {
    try {
      const pacientes = await Paciente.find();
  
      const pacientesDesencriptados = pacientes.map(paciente => {
        const rutDesencriptado = desencriptarDatoSJCL(paciente.rut);
        const nombresDesencriptados = desencriptarDatoSJCL(paciente.nombres);
        const apellidosDesencriptados = desencriptarDatoSJCL(paciente.apellidos);
  
        const pacienteDesencriptado = {
          ...paciente.toObject(),
          rut: rutDesencriptado,
          nombres: nombresDesencriptados,
          apellidos: apellidosDesencriptados
        };
  
        return pacienteDesencriptado;
      });
  
      res.json(pacientesDesencriptados);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: 'Ocurrió un error al obtener los pacientes' });
    }
  };
  const actualizarPaciente = async (req, res) => {
    const { id } = req.params;
    try {
      const paciente = await Paciente.findById(id);
      if (!paciente) {
        return res.status(404).json({ msg: "No encontrado" });
      }
  
      // Actualizar campos del paciente
      paciente.nombres = req.body.nombres || paciente.nombres;
      paciente.apellidos = req.body.apellidos || paciente.apellidos;
      paciente.rut = req.body.rut || paciente.rut;
      paciente.email = req.body.email || paciente.email;
      paciente.fechaNacimiento = req.body.fechaNacimiento || paciente.fechaNacimiento;
      paciente.sexo = req.body.sexo || paciente.sexo;
      paciente.telefono = req.body.telefono || paciente.telefono;
  
      // Encriptar campos actualizados
      paciente.rut = encriptarDato(paciente.rut);
      paciente.nombres = encriptarDato(paciente.nombres);
      paciente.apellidos = encriptarDato(paciente.apellidos);
  
      const pacienteActualizado = await paciente.save();
      res.json(pacienteActualizado);
    } catch (error) {
      console.log(error);
      res.status(500).json({ error: "Ocurrió un error al actualizar el paciente" });
    }
  };

 const eliminarPaciente= async (req, res)=>{

            const { id } =req.params;
            const paciente = await Paciente.findById(id);
            if(!paciente){
                return res.status(404).json({msg:"No encontrado"})
            }

            try {
                await paciente.deleteOne();
                res.json({msg: "Paciente eliminado correctamente"})
            } catch (error) {
                console.log(error)
            }
            
}

const registroPro = async (req, res) => {
    const { email, nombres } = req.body;
    const { rut } = req.body;
    const existeUsuario = await Profesional.findOne({ email: email });
    const existeUsuariorut = await Profesional.findOne({ rut });
  
    if (existeUsuario || existeUsuariorut) {
      const error = new Error("Este profesional ya está registrado en el sistema");
      return res.status(400).json({ msg: error.message });
    }
  
    try {
      const profesional = new Profesional(req.body); // Definir profesional aquí
  
      if (req.files?.firma) {
        const result = await uploadFirma(req.files.firma.tempFilePath);
  
        profesional.firma = {
          public_id: result.public_id,
          secure_url: result.secure_url,
        };
  
        await fs.unlink(req.files.firma.tempFilePath);
      } else {
        const error = new Error("Seleccione una imagen para subir");
        return res.status(400).json({ msg: error.message });
      }
  
      const profeGuardado = await profesional.save();
  
      emailregistroPro({
        email,
        nombres,
        rut,
        token: profeGuardado.token,
      });
  
      res.json(profeGuardado);
    } catch (error) {
      console.log(error);
    }
  };
  
  const verMotivosconsulta= async(req, res)=>{
    try {
        const motivos = await MotivoConsulta.find()
        res.json( motivos)
    } catch (error) {
        console.log(error)
        
    }
    };
    const obtenerconsultas= async(req, res)=>{
      try {
          const consultas = await Consulta.find()
          res.json( consultas)
      } catch (error) {
          console.log(error)
          
      }
      };
      const actualizarPassword = async (req,res)=>{
        //leer los datos
        const {id} = req.admin;
        const {pwd_actual, pwd_nuevo } = req.body;
    
        const admin = await Admin.findById(id);
        if(!admin){
            const error = new Error("Hubo un error");
            return res.status(400).json({msg: error.message});
    
        }
        //Comprobar password
        if(await admin.comprobarPassword(pwd_actual)){
            //Almacenar nueva password
            admin.password =  pwd_nuevo;
            await admin.save();
            res.json({msg: "Contraseña Almacenada correctamente"});
        }
        else{
            const error = new Error("El password actual es incorrecto");
            return res.status(400).json({msg: error.message})
    
        }
        
    }



    export { registrar, perfil, confirmar,
         autenticar, olvidePassword, comprobarToken, 
         nuevoPassword, registroProfesional, registroAdmin,verProfesional,actualizarProfesional, eliminarProfesional, verAdmin, actualizarAdmin, eliminarAdmin,
        eliminarPaciente, verPaciente, registroPaciente, actualizarPaciente, registroPro,verMotivosconsulta,obtenerconsultas,actualizarPassword};