import mongoose from "mongoose";
const antecedentesfamSchema = mongoose.Schema({
    nombrediagnostico:{
        type: String,
        required: false,
        default:null
    },
    familiar:{
        type: String,
        required: false,
        
    },
    guardadoporpaciente:{
        type:Boolean,
        default:true
    },
    paciente:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Paciente",
    },
})

const AntecedentesFam = mongoose.model("AntecedentesFam", antecedentesfamSchema);
export default AntecedentesFam;