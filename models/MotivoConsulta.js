import mongoose from "mongoose";
const motivoconsultaSchema = mongoose.Schema({
    titulo:{
        type: String,
        required: true,
        trim: true
    },
    descripcion:{
        type: String,
        required: true,
        trim: true
    },
    informacion:{
        type: String,
        required: false,
    },
    consentimiento:{
        type: Boolean,
        default: false
    },
    fecha:{
        type:Date,
        default: Date.now()
    },
    visible:{
        type: Boolean,
        default: false
    },
    estado:{
        type: String, 
        enum:['publicado','pendiente','finalizado'],
        default:'publicado',
    },
    activo:{
        type:Boolean,
        default:true
    },
    especialidades: {
        type: String, 
        required:false, 
      },
      medidasgenerales:{
        type: String,
        default: null,
    },
    impresiondiagnostica:{
        type:String,
        default:null
    },
    interconsulta:{
        type: String, 
        enum:['Si','No','Sin datos','Interconsulta'],
        default:'Sin datos',
    },
    motivointerconsulta:{
        type: String, 
        default:null
    },
    propuestainterconsulta: {
        type: String, 
        required:false,
        default:null,
      },
      notificacioninterconsulta:{
        type:Boolean,
        default:false
      },
      leidopacienteinterconsulta:{
        type:Boolean,
        default:false
    },
    signosdealarma: {
        type: [String], // Cambiar el tipo a Array de String
        required: false,
        default: null
      },

    paciente:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Paciente",
    },
    enfermedades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enfermedad'
    }],
    alergias: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Alergia'
    }],
    antecedentesfam: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'AntecedentesFam'
    }],
    farmaco: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmaco'
    }],
    quirurgico: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Quirurgico'
    }],
    hospitalizaciones: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hospitalizaciones'
    }],
    urgencia: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Urgencia'
    }],
    horariopaciente: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'HorarioPaciente'
    }],
    consulta: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Consulta'
    }],
    imagenesmotivo:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"ImagenesMotivo",
    },
    controles:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Controles",
    },
})

const MotivoConsulta= mongoose.model("MotivoConsulta", motivoconsultaSchema);
export default MotivoConsulta;