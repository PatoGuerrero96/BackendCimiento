import mongoose from "mongoose";
const alergiaSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    añoDiagnostico:{
        type:Date,
        default: Date.now(),
    },
    obsalergia:{
        type: String,
        default:null
    },
    sintomas:{
        type: String,
        trim: true,
        default:null
    },
    gravedad: {
        type: String, 
        enum:['Leve','Media','Alta','Sin datos'],
        default:'Sin datos',
    },
    medicamento:{
        type: String,
        trim: true,
        default:null
    },
    tratamiento:{
        type: String,
        trim: true,
        default:null
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
alergiaSchema.virtual("infoPaciente", {
    ref: "Paciente",
    localField: "paciente",
    foreignField: "_id",
    justOne: true,
})

alergiaSchema.methods.comprobarPassword = async function(
    passwordFormulario
){
    return await bcrypt.compare(passwordFormulario, this.password);
}
const Alergia = mongoose.model("Alergia", alergiaSchema);
export default Alergia;