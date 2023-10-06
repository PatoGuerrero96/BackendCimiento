import Paciente from "../models/Paciente.js";
import Vacuna from "../models/Vacunas.js";
import Farmaco from "../models/Farmaco.js";
import Quirurgico from "../models/Quirurgico.js";
import AntecedentesFam from "../models/Antecedentesfam.js";
import Hospitalizaciones from "../models/Hospitalizaciones.js";
import Urgencia from "../models/Urgencias.js";
import {uploadDocument} from "../utils/cloudinary.js";
import fs from "fs-extra"
import Farmacoprevios from "../models/Farmacosprevios.js";
const tieneVacuna = async (req, res) =>{
    const paciente = await Paciente.findById(req.params.id);
    if(!paciente){
        const error = new error("Hubo un error");
        return res.status(400).json({msg: error.message})
    }
    try{
        paciente.historiaclinica.vacuna = req.body.vacuna;
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado)
    
    } catch(error){
        console.log(error)
    }
    
    }

const agregarVacuna= async(req,res)=>{
const vacuna= new Vacuna(req.body);

vacuna.paciente = req.paciente._id;

try {
    const vacunaAlmacenado  = await vacuna.save();
    res.json(vacunaAlmacenado);
} catch (error) {
    console.log(error);
}
};

const obtenerVacunas= async (req, res)=>{
    const vacunas =  await Vacuna.find().where('paciente').equals(req.paciente);

    res.json(vacunas);

};
const obtenerVacuna= async (req, res)=>{
    try {
        const vacunas = await Vacuna.find()
        res.json( vacunas)
    } catch (error) {
        console.log(error)
        
    }
};
const actualizarVacuna= async (req, res)=>{

const { id } =req.params;
const vacuna = await Vacuna.findById(id);
if(!vacuna){
    return res.status(404).json({msg:"No encontrado"})
}vacuna

if(vacuna.paciente._id.toString() !== req.paciente._id.toString()){
    return res.json({msg: "Accion no válida"});
}

//Actualizar vacuna
vacuna.nombre = req.body.nombre || vacuna.nombre;
vacuna.fecha = req.body.fecha || vacuna.fecha;

try {
    const vacunaActualizado = await vacuna.save();
    res.json(vacunaActualizado);
} catch (error) {
    console.log(error)
    
}


};
const eliminarVacuna= async (req, res)=>{
    const { id } =req.params;
    const vacuna = await Vacuna.findById(id);
    if(!vacuna){
        return res.status(404).json({msg:"No encontrado"})
    }
    
    if(vacuna.paciente._id.toString() !== req.paciente._id.toString()){
        return res.json({msg: "Accion no válida"});
    }

    try {
        await vacuna.deleteOne();
        res.json({msg:"Vacuna eliminada"});
    } catch (error) {
        console.log(error)
    }

};




const tieneFarmaco = async (req, res) =>{
    const paciente = await Paciente.findById(req.params.id);
    if(!paciente){
        const error = new error("Hubo un error");
        return res.status(400).json({msg: error.message})
    }
    try{
        paciente.historiaclinica.farmaco = req.body.farmaco;
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado)
    
    } catch(error){
        console.log(error)
    }
    
    }

const agregarFarmaco= async(req,res)=>{
const farmaco = new Farmaco(req.body);

farmaco.paciente = req.paciente._id;

try {
    const farmacoAlmacenado  = await farmaco.save();
    res.json(farmacoAlmacenado);
} catch (error) {
    console.log(error);
}
};

const obtenerFarmacos= async (req, res)=>{
    const farmacos =  await Farmaco.find().where('paciente').equals(req.paciente);

    res.json(farmacos);

};
const obtenerFarmaco= async (req, res)=>{
    try {
        const farmacos = await Farmaco.find()
        res.json( farmacos)
    } catch (error) {
        console.log(error)
        
    }
};
const actualizarFarmaco= async (req, res)=>{

const { id } =req.params;
const farmaco = await Farmaco.findById(id);
if(!farmaco){
    return res.status(404).json({msg:"No encontrado"})
}farmaco

if(farmaco.paciente._id.toString() !== req.paciente._id.toString()){
    return res.json({msg: "Accion no válida"});
}

//Actualizar farmaco
farmaco.nombre = req.body.nombre || farmaco.nombre;
farmaco.fecha = req.body.fecha || farmaco.fecha;

try {
    const farmacoActualizado = await farmaco.save();
    res.json(farmacoActualizado);
} catch (error) {
    console.log(error)
    
}


};
const eliminarFarmaco= async (req, res)=>{
    const { id } =req.params;
    const farmaco = await Farmaco.findById(id);
    if(!farmaco){
        return res.status(404).json({msg:"No encontrado"})
    }
    
    if(farmaco.paciente._id.toString() !== req.paciente._id.toString()){
        return res.json({msg: "Accion no válida"});
    }

    try {
        await farmaco.deleteOne();
        res.json({msg:"Farmaco eliminada"});
    } catch (error) {
        console.log(error)
    }

};


const tieneQuirurgico = async (req, res) =>{
    const paciente = await Paciente.findById(req.params.id);
    if(!paciente){
        const error = new error("Hubo un error");
        return res.status(400).json({msg: error.message})
    }
    try{
        paciente.historiaclinica.quirurgico = req.body.quirurgico;
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado)
    
    } catch(error){
        console.log(error)
    }
    
    }

const agregarQuirurgico= async(req,res)=>{
const quirurgico = new Quirurgico(req.body);

quirurgico.paciente = req.paciente._id;

try {
    const quirurgicoAlmacenado  = await quirurgico.save();
    res.json(quirurgicoAlmacenado);
} catch (error) {
    console.log(error);
}
};

const obtenerQuirurgicos= async (req, res)=>{
    const quirurgicos =  await Quirurgico.find().where('paciente').equals(req.paciente);

    res.json(quirurgicos);
};
const obtenerQuirurgico= async (req, res)=>{
    try {
        const quirurgicos = await Quirurgico.find()
        res.json( quirurgicos)
    } catch (error) {
        console.log(error)
        
    }
};
const actualizarQuirurgico= async (req, res)=>{

const { id } =req.params;
const quirurgico = await Quirurgico.findById(id);
if(!quirurgico){
    return res.status(404).json({msg:"No encontrado"})
}quirurgico

if(quirurgico.paciente._id.toString() !== req.paciente._id.toString()){
    return res.json({msg: "Accion no válida"});
}

//Actualizar antecedente quirurgico
quirurgico.nombre = req.body.nombre || quirurgico.nombre;

try {
    const quirurgicoActualizado = await quirurgico.save();
    res.json(quirurgicoActualizado);
} catch (error) {
    console.log(error)
    
}


};
const eliminarQuirurgico= async (req, res)=>{
    const { id } =req.params;
    const quirurgico = await Quirurgico.findById(id);
    if(!quirurgico){
        return res.status(404).json({msg:"No encontrado"})
    }
    
    if(quirurgico.paciente._id.toString() !== req.paciente._id.toString()){
        return res.json({msg: "Accion no válida"});
    }

    try {
        await quirurgico.deleteOne();
        res.json({msg:"Antecedente quirurgico eliminado"});
    } catch (error) {
        console.log(error)
    }

};




const tieneAntecedentesfam = async (req, res) =>{
    const paciente = await Paciente.findById(req.params.id);
    if(!paciente){
        const error = new error("Hubo un error");
        return res.status(400).json({msg: error.message})
    }
    try{
        paciente.historiaclinica.antecedentesfam = req.body.antecedentesfam;
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado)
    
    } catch(error){
        console.log(error)
    }
    
    }

const agregarAntecedentesfam= async(req,res)=>{
const antecedentesfam = new AntecedentesFam(req.body);

antecedentesfam.paciente = req.paciente._id;

try {
    const antecedentesfamAlmacenado  = await antecedentesfam.save();
    res.json(antecedentesfamAlmacenado);
} catch (error) {
    console.log(error);
}
};

const obtenerAntecedentesfamiliares= async (req, res)=>{
    const antecedentesfam =  await AntecedentesFam.find().where('paciente').equals(req.paciente);

    res.json(antecedentesfam);
};
const obtenerAntecedentesfam= async (req, res)=>{
    try {
        const antecedentesfam = await AntecedentesFam.find()
        res.json( antecedentesfam)
    } catch (error) {
        console.log(error)
        
    }
};
const actualizarAntecedentesfam= async (req, res)=>{

const { id } =req.params;
const antecedentesfam = await AntecedentesFam.findById(id);
if(!antecedentesfam){
    return res.status(404).json({msg:"No encontrado"})
}antecedentesfam

if(antecedentesfam.paciente._id.toString() !== req.paciente._id.toString()){
    return res.json({msg: "Accion no válida"});
}

//Actualizar antecedente familiares
antecedentesfam.nombrediagnostico = req.body.nombrediagnostico || antecedentesfam.nombrediagnostico;

try {
    const antecedentesfamActualizado = await antecedentesfam.save();
    res.json(antecedentesfamActualizado);
} catch (error) {
    console.log(error)
    
}


};
const eliminarAntecedentesfam= async (req, res)=>{
    const { id } =req.params;
    const antecedentesfam = await AntecedentesFam.findById(id);
    if(!antecedentesfam){
        return res.status(404).json({msg:"No encontrado"})
    }
    
    if(antecedentesfam.paciente._id.toString() !== req.paciente._id.toString()){
        return res.json({msg: "Accion no válida"});
    }

    try {
        await antecedentesfam.deleteOne();
        res.json({msg:"Antecedente familiares eliminado"});
    } catch (error) {
        console.log(error)
    }

};



const tieneHospitalizaciones = async (req, res) =>{
    const paciente = await Paciente.findById(req.params.id);
    if(!paciente){
        const error = new error("Hubo un error");
        return res.status(400).json({msg: error.message})
    }
    try{
        paciente.historiaclinica.hospitalizaciones = req.body.hospitalizaciones;
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado)
    
    } catch(error){
        console.log(error)
    }
    
    }

const agregarHospitalizaciones= async(req,res)=>{
    try {
        const { nombre,fechaingreso,fechasalida} = req.body;
        const pacienteId = req.paciente._id;
        
        const hospitalizacion = new Hospitalizaciones({
          nombre,
          fechaingreso,
          fechasalida,
          paciente: pacienteId
        });
        if (req.files?.documento) {
            const result = await uploadDocument(req.files.documento.tempFilePath)
            hospitalizacion.documento = {
              public_id: result.public_id,
              secure_url: result.secure_url
            }
            await fs.unlink(req.files.documento.tempFilePath)
          }
        const hospitalizacionguardado = await hospitalizacion.save();
        res.json(hospitalizacionguardado);
      } catch (error) {
        if (req.files?.documento) {
            await fs.unlink(req.files.documento.tempFilePath)
          }
        console.log(error);
        res.status(400).json({ error: 'Error al guardar examen' });
      }
};

const obtenerHospitalizaciones= async (req, res)=>{
    const hospitalizacion =  await Hospitalizaciones.find().where('paciente').equals(req.paciente);

    res.json(hospitalizacion);
};
const obtenerHospitalizacion= async (req, res)=>{
    try {
        const hospitalizacion = await Hospitalizaciones.find()
        res.json( hospitalizacion)
    } catch (error) {
        console.log(error)
        
    }
};
const actualizarHospitalizaciones= async (req, res)=>{

const { id } =req.params;
const hospitalizacion= await Hospitalizaciones.findById(id);
if(!hospitalizacion){
    return res.status(404).json({msg:"No encontrado"})
}hospitalizacion

if(hospitalizacion.paciente._id.toString() !== req.paciente._id.toString()){
    return res.json({msg: "Accion no válida"});
}

//Actualizar antecedente familiares
hospitalizacion.nombre = req.body.nombre || hospitalizacion.nombre;

try {
    const hospitalizacionActualizado = await hospitalizacion.save();
    res.json(hospitalizacionActualizado);
} catch (error) {
    console.log(error)
    
}


};
const eliminarHospitalizaciones= async (req, res)=>{
    const { id } =req.params;
    const hospitalizacion = await Hospitalizaciones.findById(id);
    if(!hospitalizacion){
        return res.status(404).json({msg:"No encontrado"})
    }
    
    if(hospitalizacion.paciente._id.toString() !== req.paciente._id.toString()){
        return res.json({msg: "Accion no válida"});
    }

    try {
        await hospitalizacion.deleteOne();
        res.json({msg:"Hospitalización eliminada"});
    } catch (error) {
        console.log(error)
    }

};


const tieneUrgencias = async (req, res) =>{
    const paciente = await Paciente.findById(req.params.id);
    if(!paciente){
        const error = new error("Hubo un error");
        return res.status(400).json({msg: error.message})
    }
    try{
        paciente.historiaclinica.urgencia = req.body.urgencia;
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado)
    
    } catch(error){
        console.log(error)
    }
    
    }

const agregarUrgencias= async(req,res)=>{
const urgencia = new Urgencia(req.body);

urgencia.paciente = req.paciente._id;

try {
    const urgenciaAlmacenado  = await urgencia.save();
    res.json(urgenciaAlmacenado);
} catch (error) {
    console.log(error);
}
};

const obtenerUrgencias= async (req, res)=>{
    const urgencia =  await Urgencia.find().where('paciente').equals(req.paciente);

    res.json(urgencia);
};
const obtenerUrgencia= async (req, res)=>{
    try {
        const urgencia = await Urgencia.find()
        res.json( urgencia)
    } catch (error) {
        console.log(error)
        
    }
};
const actualizarUrgencias= async (req, res)=>{

const { id } =req.params;
const urgencia= await Urgencia.findById(id);
if(!urgencia){
    return res.status(404).json({msg:"No encontrado"})
}

if(urgencia.paciente._id.toString() !== req.paciente._id.toString()){
    return res.json({msg: "Accion no válida"});
}

//Actualizar antecedente familiares
urgencia.nombre = req.body.nombre || urgencia.nombre;

try {
    const urgenciaActualizado = await urgencia.save();
    res.json(urgenciaActualizado);
} catch (error) {
    console.log(error)
    
}


};
const eliminarUrgencias= async (req, res)=>{
    const { id } =req.params;
    const urgencia= await Urgencia.findById(id);
    if(!urgencia){
        return res.status(404).json({msg:"No encontrado"})
    }
    
    if(urgencia.paciente._id.toString() !== req.paciente._id.toString()){
        return res.json({msg: "Accion no válida"});
    }

    try {
        await urgencia.deleteOne();
        res.json({msg:"Urgencia eliminada"});
    } catch (error) {
        console.log(error)
    }

};


const actualizarIdentificacion = async (req, res) =>{
    const paciente = await Paciente.findById(req.params.id);
    if(!paciente){
        const error = new error("Hubo un error");
        return res.status(400).json({msg: error.message})
    }
    try{
        paciente.localidad = req.body.localidad;
        paciente.ocupacion = req.body.ocupacion;
        paciente.previsionsalud = req.body.previsionsalud;
        paciente.escolaridad = req.body.escolaridad;
        paciente.lugardeatencion = req.body.lugardeatencion;
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado)
    
    } catch(error){
        console.log(error)
    }
    
    }

const actualizarGinecoobstetrico = async (req, res) =>{
    const paciente = await Paciente.findById(req.params.id);
    if(!paciente){
        const error = new error("Hubo un error");
        return res.status(400).json({msg: error.message})
    }
    try{
        paciente.gestaciones = req.body.gestaciones;
        paciente.perdidas = req.body.perdidas;
        paciente.partos = req.body.partos;
        paciente.cesareas = req.body.cesareas;
        paciente.menarquia = req.body.menarquia;
        paciente.ultimaregla = req.body.ultimaregla;
        paciente.ultimopap = req.body.ultimopap;
        const pacienteActualizado = await paciente.save();
        res.json(pacienteActualizado)
        
    } catch(error){
        console.log(error)
    }
        
    }

    const audit = async (req, res) =>{
        const paciente = await Paciente.findById(req.params.id);
        if(!paciente){
            const error = new error("Hubo un error");
            return res.status(400).json({msg: error.message})
        }
        try{
            paciente.audit.preguntauno = req.body.preguntauno;
            paciente.audit.preguntados = req.body.preguntados;
            paciente.audit.preguntatres = req.body.preguntatres;
            paciente.audit.preguntacuatro = req.body.preguntacuatro;
            paciente.audit.preguntacinco = req.body.preguntacinco;
            paciente.audit.preguntaseis = req.body.preguntaseis;
            paciente.audit.preguntasiete = req.body.preguntasiete;
            paciente.audit.preguntaocho = req.body.preguntaocho;
            paciente.audit.preguntanueve = req.body.preguntanueve;
            paciente.audit.preguntadiez = req.body.preguntadiez;

            const pacienteActualizado = await paciente.save();
            res.json(pacienteActualizado)
        
        } catch(error){
            console.log(error)
        }
        
    }
    
    const tieneFarmacoPrevio = async (req, res) =>{
        const paciente = await Paciente.findById(req.params.id);
        if(!paciente){
            const error = new error("Hubo un error");
            return res.status(400).json({msg: error.message})
        }
        try{
            paciente.historiaclinica.farmacoprevio = req.body.farmacoprevio;
            const pacienteActualizado = await paciente.save();
            res.json(pacienteActualizado)
        
        } catch(error){
            console.log(error)
        }
        
        }
    
    const agregarFarmacoPrevio= async(req,res)=>{
    const farmaco = new Farmacoprevios(req.body);
    
    farmaco.paciente = req.paciente._id;
    
    try {
        const farmacoAlmacenado  = await farmaco.save();
        res.json(farmacoAlmacenado);
    } catch (error) {
        console.log(error);
    }
    };
    const obtenerFarmacosPrevios= async (req, res)=>{
        const farmacos =  await Farmacoprevios.find().where('paciente').equals(req.paciente);
    
        res.json(farmacos);
    
    };
    const eliminarFarmacoPrevio= async (req, res)=>{
        const { id } =req.params;
        const farmaco = await Farmacoprevios.findById(id);
        if(!farmaco){
            return res.status(404).json({msg:"No encontrado"})
        }
        
        if(farmaco.paciente._id.toString() !== req.paciente._id.toString()){
            return res.json({msg: "Accion no válida"});
        }
    
        try {
            await farmaco.deleteOne();
            res.json({msg:"Farmaco eliminada"});
        } catch (error) {
            console.log(error)
        }
    
    };
 


export{
    agregarVacuna,
    tieneVacuna,
    obtenerVacunas,
    obtenerVacuna,
    actualizarVacuna,
    eliminarVacuna,
    agregarFarmaco,
    tieneFarmaco,
    obtenerFarmacos,
    obtenerFarmaco,
    actualizarFarmaco,
    eliminarFarmaco,
    eliminarQuirurgico,
    actualizarQuirurgico,
    obtenerQuirurgico,
    obtenerQuirurgicos,
    agregarQuirurgico,
    tieneQuirurgico,
    eliminarAntecedentesfam,
    actualizarAntecedentesfam,
    obtenerAntecedentesfam,
    obtenerAntecedentesfamiliares,
    agregarAntecedentesfam,
    tieneAntecedentesfam,
    eliminarHospitalizaciones,
    actualizarHospitalizaciones,
    obtenerHospitalizacion,
    obtenerHospitalizaciones,
    agregarHospitalizaciones,
    tieneHospitalizaciones,
    tieneUrgencias,
    agregarUrgencias,
    obtenerUrgencias,
    obtenerUrgencia,
    actualizarUrgencias,
    eliminarUrgencias,
    actualizarIdentificacion,
    actualizarGinecoobstetrico,
    audit,
    tieneFarmacoPrevio,
    obtenerFarmacosPrevios,
    agregarFarmacoPrevio,
    eliminarFarmacoPrevio

    
}