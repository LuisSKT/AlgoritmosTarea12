// Simulación de la entidad Cita en la Base de Datos
class Cita {
    constructor(id, paciente, doctor, fecha, hora, ticket, estado) {
        this.id = id;
        this.paciente = paciente;
        this.doctor = doctor;
        this.fecha = fecha;
        this.hora = hora;
        this.ticket = ticket;
        this.estado = estado; // 'En espera', 'Atendido'
    }
}