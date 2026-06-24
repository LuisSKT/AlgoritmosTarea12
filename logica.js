/* 
   SISTEMA DE RESERVA DE CITAS MÉDICAS
 */

function mostrarPantalla(nombre) {
	const pantallaLogin = document.getElementById("pantalla-login");
	const pantallaSistema = document.getElementById("pantalla-sistema");

	pantallaLogin.classList.remove("pantalla-activa");
	pantallaSistema.classList.remove("pantalla-activa");

	if (nombre === "login") {
		pantallaLogin.classList.add("pantalla-activa");
	} else {
		pantallaSistema.classList.add("pantalla-activa");
	}
}

function mostrarModulo(nombre) {
	const moduloLamport = document.getElementById("modulo-lamport");
	const moduloCristian = document.getElementById("modulo-cristian");

	moduloLamport.classList.remove("modulo-activo");
	moduloCristian.classList.remove("modulo-activo");

	if (nombre === "lamport") {
		moduloLamport.classList.add("modulo-activo");
	}

	if (nombre === "cristian") {
		moduloCristian.classList.add("modulo-activo");
	}
}

function iniciarSesion() {
	const usuario = document.getElementById("usuario").value.trim();
	const password = document.getElementById("password").value.trim();

	if (usuario === "" || password === "") {
		mostrarMensaje("Ingrese usuario y contraseña");
		return;
	}

	mostrarPantalla("sistema");
	mostrarModulo("lamport");
	mostrarMensaje("Inicio de sesión correcto");
}



function cerrarSesion() {
	document.getElementById("usuario").value = "";
	document.getElementById("password").value = "";

	mostrarPantalla("login");
	mostrarMensaje("Sesión cerrada correctamente");
}

function mostrarMensaje(texto) {
	const toast = document.getElementById("toast");

	toast.textContent = texto;
	toast.classList.add("visible");

	setTimeout(function () {
		toast.classList.remove("visible");
	}, 2500);
}




function formatearHora(fecha) {
	return fecha.toLocaleTimeString("es-PE", {
		hour: "2-digit",
		minute: "2-digit",
		second: "2-digit"
	});
}

/* 
   ALGORITMO INICIAL LAMPORT 
 */

let relojLamport = 0;
let contadorProcesos = 0;
let historialLamport = [];


function ejecutarLamport() {
	const paciente = document.getElementById("lamportPaciente").value.trim();
	const doctor = document.getElementById("lamportDoctor").value;
	const fecha = document.getElementById("lamportFecha").value;
	const hora = document.getElementById("lamportHora").value;

	if (paciente === "" || doctor === "" || fecha === "" || hora === "") {
		mostrarMensaje("Complete todos los datos para reservar");
		return;
	}

	
    const citaOcupada = historialLamport.some(function(evento) {
        return evento.doctor === doctor && 
               evento.fecha === fecha && 
               evento.hora === hora &&
               evento.estado !== "Atendido"; 
    });

    if (citaOcupada) {
        mostrarMensaje("Error: El doctor ya tiene una cita reservada en ese horario");
        alert("Horario no disponible para este doctor. Por favor, elija otro.");
        return; 
    }


	relojLamport++;
	contadorProcesos++;

	const nuevaSolicitud = {
		id: contadorProcesos,
		paciente: paciente,
		doctor: doctor,
		fecha: fecha,
		hora: hora,
		ticket: relojLamport,
		estado: "En espera"
	};

	historialLamport.push(nuevaSolicitud);

	actualizarVistaLamport(
		"Solicitud registrada para " + paciente +
		". Ticket asignado: #" + nuevaSolicitud.ticket + "."
	);

	mostrarMensaje("Solicitud agregada a la cola");
}


function obtenerColaPendienteLamport() {
	return historialLamport
		.filter(function (evento) {
			return evento.estado !== "Atendido";
		})
		.sort(function (a, b) {
			if (a.ticket === b.ticket) {
				return a.id - b.id;
			}
			return a.ticket - b.ticket;
		});
}


function actualizarEstadosLamport() {
	const colaPendiente = obtenerColaPendienteLamport();

	colaPendiente.forEach(function (evento, indice) {
		if (indice === 0) {
			evento.estado = "En atención";
		} else if (indice === 1) {
			evento.estado = "Siguiente paciente";
		} else {
			evento.estado = "En espera";
		}
	});
}


function actualizarVistaLamport(mensajePersonalizado) {
	const lamportVacio = document.getElementById("lamportVacio");
	const lamportResultado = document.getElementById("lamportResultado");

	actualizarEstadosLamport();

	const colaPendiente = obtenerColaPendienteLamport();
	const pacienteActual = colaPendiente[0];
	const siguientePaciente = colaPendiente[1];

	lamportVacio.classList.add("oculto");
	lamportResultado.classList.remove("oculto");

	if (historialLamport.length === 0) {
		document.getElementById("ticketActual").textContent = "#--";
		document.getElementById("ticketOtro").textContent = "#--";
		document.getElementById("mensajeLamport").textContent =
			"No hay solicitudes registradas.";
		actualizarTablaLamport();
		return;
	}

	if (pacienteActual) {
		document.getElementById("ticketActual").textContent =
			"#" + pacienteActual.ticket;
	} else {
		document.getElementById("ticketActual").textContent = "#--";
	}

	if (siguientePaciente) {
		document.getElementById("ticketOtro").textContent =
			"#" + siguientePaciente.ticket;
	} else {
		document.getElementById("ticketOtro").textContent = "#--";
	}

	if (mensajePersonalizado) {
		document.getElementById("mensajeLamport").textContent =
			mensajePersonalizado;
	} else if (pacienteActual) {
		document.getElementById("mensajeLamport").textContent =
			"Paciente en atención: " + pacienteActual.paciente +
			" con ticket #" + pacienteActual.ticket + ".";
	} else {
		document.getElementById("mensajeLamport").textContent =
			"Todas las solicitudes han sido atendidas.";
	}

	actualizarTablaLamport();
}


function actualizarTablaLamport() {
	const tabla = document.getElementById("tablaLamport");

	tabla.innerHTML = "";

	const historialOrdenado = historialLamport.slice().sort(function (a, b) {
		if (a.ticket === b.ticket) {
			return a.id - b.id;
		}
		return a.ticket - b.ticket;
	});

	historialOrdenado.forEach(function (evento) {
		tabla.innerHTML += `
			<tr>
				<td>P${evento.id}</td>
				<td>${evento.paciente}</td>
				<td>#${evento.ticket}</td>
				<td>${evento.estado}</td>
			</tr>
		`;
	});
}


function atenderPacienteLamport() {
	const colaPendiente = obtenerColaPendienteLamport();

	if (colaPendiente.length === 0) {
		mostrarMensaje("No hay pacientes pendientes");
		return;
	}

	const pacienteAtendido = colaPendiente[0];
	pacienteAtendido.estado = "Atendido";

	actualizarEstadosLamport();

	const nuevaCola = obtenerColaPendienteLamport();
	const nuevoPacienteActual = nuevaCola[0];

	let mensaje = "Paciente atendido: " + pacienteAtendido.paciente +
		" con ticket #" + pacienteAtendido.ticket + ".";

	if (nuevoPacienteActual) {
		mensaje += " Ahora continúa " + nuevoPacienteActual.paciente +
			" con ticket #" + nuevoPacienteActual.ticket + ".";
	} else {
		mensaje += " No quedan pacientes pendientes.";
	}

	actualizarVistaLamport(mensaje);

	mostrarMensaje("Paciente marcado como atendido");
}


function limpiarLamport() {
	relojLamport = 0;
	contadorProcesos = 0;
	historialLamport = [];

	document.getElementById("lamportPaciente").value = "";
	document.getElementById("lamportDoctor").value = "";
	document.getElementById("lamportFecha").value = "";
	document.getElementById("lamportHora").value = "";

	document.getElementById("ticketActual").textContent = "#--";
	document.getElementById("ticketOtro").textContent = "#--";
	document.getElementById("tablaLamport").innerHTML = "";
	document.getElementById("mensajeLamport").textContent = "Resultado pendiente";

	document.getElementById("lamportResultado").classList.add("oculto");
	document.getElementById("lamportVacio").classList.remove("oculto");

	mostrarMensaje("Tabla de Lamport limpiada");
}



/* 
  ALGORITMO MEJORADO: CRISTIAN
 */

function ejecutarCristian() {
	const paciente = document.getElementById("cristianPaciente").value.trim();
	const doctor = document.getElementById("cristianDoctor").value;
	const fecha = document.getElementById("cristianFecha").value;
	const hora = document.getElementById("cristianHora").value;

	if (paciente === "" || doctor === "" || fecha === "" || hora === "") {
		mostrarMensaje("Complete todos los datos para sincronizar");
		return;
	}

	const tiempoEnvio = new Date();
	const latenciaSimulada = Math.floor(Math.random() * 180) + 40;
	const relojServidor = new Date(tiempoEnvio.getTime() + 3000);
	const tiempoRecepcion = new Date(tiempoEnvio.getTime() + latenciaSimulada);
	const tiempoIdaVuelta = tiempoRecepcion.getTime() - tiempoEnvio.getTime();
	const retardoEstimado = tiempoIdaVuelta / 2;
	const horaSincronizada = new Date(relojServidor.getTime() + retardoEstimado);

	document.getElementById("cristianVacio").classList.add("oculto");
	document.getElementById("cristianResultado").classList.remove("oculto");

	document.getElementById("horaCliente").textContent = formatearHora(tiempoEnvio);
	document.getElementById("horaServidor").textContent = formatearHora(relojServidor);
	document.getElementById("latencia").textContent = tiempoIdaVuelta + " ms";
	document.getElementById("horaFinal").textContent = formatearHora(horaSincronizada);

	const tabla = document.getElementById("tablaCristian");

	tabla.innerHTML = `
		<tr>
			<td>Paciente</td>
			<td>${paciente}</td>
		</tr>
		<tr>
			<td>Doctor</td>
			<td>${doctor}</td>
		</tr>
		<tr>
			<td>Fecha solicitada</td>
			<td>${fecha}</td>
		</tr>
		<tr>
			<td>Hora solicitada</td>
			<td>${hora}</td>
		</tr>
		<tr>
			<td>Tiempo de ida y vuelta</td>
			<td>${tiempoIdaVuelta} ms</td>
		</tr>
		<tr>
			<td>Retardo estimado</td>
			<td>${retardoEstimado} ms</td>
		</tr>
		<tr>
			<td>Hora final sincronizada</td>
			<td>${formatearHora(horaSincronizada)}</td>
		</tr>
	`;

	mostrarMensaje("Hora sincronizada con Cristian");
}

function limpiarDatosCristian() {
	document.getElementById("cristianPaciente").value = "";
	document.getElementById("cristianDoctor").value = "";
	document.getElementById("cristianFecha").value = "";
	document.getElementById("cristianHora").value = "";

	document.getElementById("horaCliente").textContent = "--:--:--";
	document.getElementById("horaServidor").textContent = "--:--:--";
	document.getElementById("latencia").textContent = "-- ms";
	document.getElementById("horaFinal").textContent = "--:--:--";

	document.getElementById("tablaCristian").innerHTML = "";

	document.getElementById("cristianResultado").classList.add("oculto");
	document.getElementById("cristianVacio").classList.remove("oculto");

	mostrarMensaje("Datos de Cristian limpiados");
}