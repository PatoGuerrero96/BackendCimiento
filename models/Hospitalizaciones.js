import mongoose from "mongoose";
const hospitalizacionesSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    documento:{
        public_id: String,
        secure_url: String,
    },
    fechaingreso:{
        type:String,
        default:null 
    },
    fechasalida:{
        type:String,
        default:null,
    },
    guardadoporpaciente:{
        type:Boolean,
        default:true
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
})

const Hospitalizaciones = mongoose.model("Hospitalizaciones", hospitalizacionesSchema);
export default Hospitalizaciones;