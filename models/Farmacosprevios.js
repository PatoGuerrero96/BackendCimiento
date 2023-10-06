import mongoose from "mongoose";
const farmacoprevioSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: false,
    },
    motivosuspencion:{
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

const Farmacoprevios= mongoose.model("Farmacoprevios", farmacoprevioSchema);
export default Farmacoprevios;