import mongoose from "mongoose";
const enfermedadSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    fechadiagnostico:{
        type:String,
        default:null 
    },
    tratamiento:{
        type: String,
        default:null
    },
    ultimocontrol: {
        type:String,
        default:null
    },
    examenes:{
        type: String,
        default:null
    },
    obsdiagnostico:{
        type: String,
        trim: true,
        default:null
    },
    eventos:{
        type: String,
        trim: true,
        default:null
    },
    guardadoporpaciente:{
        type:Boolean,
        default:true
    },
    pacientefechadiagnostico:{
        type:Boolean,
        default:true
    },

    paciente:{ 
        type: mongoose.Schema.Types.ObjectId,
        ref:"Paciente",
    },
    motivoconsulta: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'MotivoConsulta'
    }],

    
} , {
    timestamps: true 
  })

enfermedadSchema.virtual("infoPaciente", {
    ref: "Paciente",
    localField: "paciente",
    foreignField: "_id",
    justOne: true,
})
enfermedadSchema.methods.comprobarPassword = async function(
    passwordFormulario
){
    return await bcrypt.compare(passwordFormulario, this.password);
}
const Enfermedad = mongoose.model("Enfermedad", enfermedadSchema);
export default Enfermedad;