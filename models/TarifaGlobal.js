import mongoose from "mongoose";
const tarifaglobalSchema = mongoose.Schema({
    nombre:{
        type: String,
        required: true,
        trim: true
    },
    valor:{
        type:Number,
        required:true
    },
    tiempo:{
        type:Number,
        required:true
    },

})

const Tarifaglobal= mongoose.model("Tarifaglobal", tarifaglobalSchema);
export default Tarifaglobal;