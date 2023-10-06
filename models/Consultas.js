import mongoose from "mongoose";
const consultaSchema = mongoose.Schema({
    mensaje:{
        type:String,
        default:null
    },
    horarioinicio:{
        type:String,
        default:null
    },
    horariofin:{
        type:String,
        default:null
    },
    fecha:{
        type:Date,
        required:true
    },
    leido:{
        type:Boolean,
        default:false
    },
    leidopaciente:{
        type:Boolean,
        default:false
    },
    leidopacienteheader:{
        type:Boolean,
        default:false
    },
    fechaCreacion:{
        type:Date,
        default:Date.now()
    },
    comentario:{
        type:String,
        default:null
    },
    preguntasprofesional:{
        type:String,
        default:null
    },
    preguntaspaciente:{
        type:String,
        default:null
    },
    registro:{
        type:String,
        default:null
    },
    precio:{
        type:String,
        default:null
    },
    link:{
        type:String,
        default:null
    },
    fechaaceptada:{
        type:String,
        default:null
    },
    estado:{
        type: String, 
        enum:['pendiente','pagado','rechazada','finalizado'],
        default:'pendiente',
            },
    paciente:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Paciente",
    },
    motivoconsulta:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"MotivoConsulta",
    },
    profesional:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Profesional",
    },
    tarifa:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Tarifa",
    },
    tarifaGlobal:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Tarifaglobal",
    },
    especialidad:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Especialidad",
    },
    experiencia:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Experiencia",
    },
    educacion:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Educacion",
    },
    enfermedades: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Enfermedad'
    }],
    examenes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Examen'
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
    examenessolicitado: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Examensolicitado'
    }],
    recetas: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Receta'
    }],
    farmacoprevio: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Farmacoprevios'
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
    seguimientomotivo: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'SeguimientoMotivo'
    }],
    controles: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Controles'
    },


})

const Consulta= mongoose.model("Consulta", consultaSchema);
export default Consulta;