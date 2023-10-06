import mongoose from "mongoose";
const examenSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    documento:{
        public_id: String, required:false,
        secure_url: String,required:false,
    },
    estado:{
        type:Boolean,
        default:true
    },
    enfermedad:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Enfermedad",
        default:null,
    },
    quirurgico:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"Quirurgico",
        required:false,
        default:null,
    },
    paciente:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Paciente",
    },
})

const Examen= mongoose.model("Examen", examenSchema);
export default Examen;