import mongoose from "mongoose";
const controlesSchema = mongoose.Schema({
    fecha:{
        type: String,
        required: false,
        default:null
    },
    descripcion:{
        type: String,
        required: false,
        default:null
    },
    paciente:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Paciente",
    },
    profesional:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Profesional",
    },
    motivoconsulta:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"MotivoConsulta",
    },

})

const Controles= mongoose.model("Controles", controlesSchema);
export default Controles;