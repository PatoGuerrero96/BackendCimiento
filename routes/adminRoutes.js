import express  from "express";

const router = express.Router();
import { perfil, registrar, confirmar, autenticar, olvidePassword, comprobarToken, nuevoPassword,registroProfesional, 
    registroAdmin, verProfesional, actualizarProfesional, eliminarProfesional, verAdmin, actualizarAdmin, eliminarAdmin,
eliminarPaciente,registroPaciente,verPaciente,actualizarPaciente, registroPro,verMotivosconsulta,obtenerconsultas,actualizarPassword} from '../controllers/adminController.js'
import checkAuth from "../middleware/authcheckMiddleware.js";

//Area publica
router.post('/',registrar );
router.get("/confirmar/:token",confirmar);
router.post("/login", autenticar);
router.post("/olvide-password", olvidePassword);
router.get("/olvide-password/:token",comprobarToken)
router.post("/olvide-password/:token", nuevoPassword)

// area privada
router.get("/perfil", checkAuth, perfil);
router.post("/modulo-profesional", checkAuth, registroProfesional);
router.get("/modulo-profesional", checkAuth, verProfesional);
router.put("/modulo-profesional/:id", checkAuth, actualizarProfesional);
router.delete("/modulo-profesional/:id", checkAuth, eliminarProfesional )
router.post("/modulo-pro", checkAuth, registroPro);

router.post("/modulo-admin", checkAuth, registroAdmin);
router.get("/modulo-admin", checkAuth, verAdmin);
router.put("/modulo-admin/:id", checkAuth, actualizarAdmin);
router.delete("/modulo-admin/:id", checkAuth, eliminarAdmin )

router.post("/modulo-paciente", checkAuth, registroPaciente);
router.get("/modulo-paciente", checkAuth, verPaciente);
router.put("/modulo-paciente/:id", checkAuth, actualizarPaciente);
router.delete("/modulo-paciente/:id", checkAuth, eliminarPaciente )
router.get("/grafico-motivoconsulta", checkAuth, verMotivosconsulta);
router.get("/grafico-consultas", checkAuth,obtenerconsultas);
router.put("/actualizar-password", checkAuth, actualizarPassword)

export default router;