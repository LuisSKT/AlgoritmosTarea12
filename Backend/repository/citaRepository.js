
let tablaCitasBD = []; 

class CitaRepository {

    obtenerTodas() {
        return tablaCitasBD;
    }

    guardar(nuevaCita) {
        tablaCitasBD.push(nuevaCita);
        return nuevaCita;
    }
}