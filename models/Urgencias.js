import mongoose from "mongoose";
const urgenciaSchema = mongoose.Schema({
    nombreUrg:{
        type: String,
        required: true,
        trim: true
    },
    paciente:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Paciente",
    },
})

const Urgencia = mongoose.model("Urgencia", urgenciaSchema);
export default Urgencia;