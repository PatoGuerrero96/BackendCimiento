import mongoose from "mongoose";
const vacunaSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    fecha:{
        type:Date,
        default: Date.now(),
    },
    paciente:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Paciente",
    },
})

const Vacuna= mongoose.model("Vacuna", vacunaSchema);
export default Vacuna;