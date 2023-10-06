import express from "express";
import dotenv  from "dotenv"
import cors from "cors";
import fileUpload from "express-fileupload";
import conectarDB from "./config/db.js";
import pacienteRoutes from "./routes/pacienteRoutes.js";
import adminRoutes from "./routes/adminRoutes.js"
import profesionalRoutes from "./routes/profesionalRoutes.js"


const app = express();
app.use(express.json());

dotenv.config();
conectarDB();
console.log("FRONTEND:", process.env.FRONTEND);

const frontendURL = process.env.FRONTEND || "https://frontend-cimientoclinico.vercel.app";

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || origin === frontendURL) {
      // El Request proviene de la URL del frontend o no se proporciona el origen (localhost)
      callback(null, true);
    } else {
      callback(new Error("No permitido por CORS"));
    }
  },
};
app.use(cors(corsOptions));

app.use(fileUpload({
    useTempFiles: true,
    tempFileDir : './uploads'
}))
app.use("/api/pacientes", pacienteRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/profesional", profesionalRoutes);


const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
console.log(`Servidor funcionando en el puerto ${PORT}`);
})


