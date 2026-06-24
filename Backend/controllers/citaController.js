
const CitaRepository = require('../repository/citaRepository');
const repo = new CitaRepository();


function reservarCita(req, res) {
    const { paciente, doctor, fecha, hora } = req.body;

    const citasExistentes = repo.obtenerTodas();
    const existeCruce = citasExistentes.some(c => c.doctor === doctor && c.fecha === fecha && c.hora === hora);

    if (existeCruce) {
        return res.status(400).json({ mensaje: "Horario no disponible para este doctor" });
    }

       const nuevaCita = { id: citasExistentes.length + 1, paciente, doctor, fecha, hora, estado: "En espera" };
    repo.guardar(nuevaCita);

    return res.status(201).json({ mensaje: "Cita guardada en BD con éxito", data: nuevaCita });
}