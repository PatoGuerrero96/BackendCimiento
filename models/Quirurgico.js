import mongoose from "mongoose";
const quirurgicoSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: false,
    },
    anio:{
        type: Number,
        required: false,
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
    guardadoporpaciente:{
        type:Boolean,
        default:true
    },
})

const Quirurgico= mongoose.model("Quirurgico", quirurgicoSchema);
export default Quirurgico;