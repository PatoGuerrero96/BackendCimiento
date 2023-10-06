import mongoose from "mongoose";
const horariopacienteSchema = mongoose.Schema({
    fecha:{
        type: Date,
        required: false,
    },
    horarioinicio:{
        type:String,
        required:false
    },
    horariofin:{
        type:String,
        required:false
    },
    paciente:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Paciente",
    },
})

const HorarioPaciente= mongoose.model("HorarioPaciente", horariopacienteSchema);
export default HorarioPaciente;