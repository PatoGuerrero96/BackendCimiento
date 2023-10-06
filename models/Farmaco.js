import mongoose from "mongoose";
const farmacoSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    horario:{
     type: String,
     required: false,
    },
    dosis:{
    type: String,
    required: false,
    },
    duracion:{
    type: String,
    required: false,
    },
    formato:{
    type: String,
     required: false,
    },
    tipodeuso:{
        type: String,
         required: false,
        },
    fecha:{
        type:Date,
        required:false
    },
    fechatermino:{
        type:Date,
        required:false
    },
    guardadoporpaciente:{
        type:Boolean,
        default:true
    },
    magistral:{
        type: String,
         default:null,
        },
    tipo:{
        type: String, 
        enum:['Agudo','Cronico'],
        default:'Cronico',
    }, 
    paciente:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Paciente",
    },
    enfermedad:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Enfermedad",
        required: false,
        default:null,
    },
    motivoconsulta: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MotivoConsulta'
    }],
})

const Farmaco= mongoose.model("Farmaco", farmacoSchema);
export default Farmaco;