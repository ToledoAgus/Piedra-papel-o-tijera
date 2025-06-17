function aleatorio(min, max) {
    return Math.floor(Math.random() * (max - min) + min);
}

function eleccion(jugada) {
    switch (jugada) {
        case 1:
            return "Piedra 🥌";
        case 2:
            return "Papel 🧻";
        case 3:
            return "Tijera ✂️";
        default:
            return "";
    }
}

let triunfos = 0;
let perdidas = 0;

function actualizarMarcador() {
    document.getElementById('triunfos').textContent = triunfos;
    document.getElementById('perdidas').textContent = perdidas;
}

function jugar(jugador) {
    const pc = aleatorio(1, 4);
    let resultado = '';

    if (pc === jugador) {
        resultado = 'Empate';
    } else if (
        (jugador === 1 && pc === 3) ||
        (jugador === 2 && pc === 1) ||
        (jugador === 3 && pc === 2)
    ) {
        resultado = 'Ganaste';
        triunfos++;
    } else {
        resultado = 'Perdiste';
        perdidas++;
    }

    const mensaje = `PC elige ${eleccion(pc)}. Tú elegiste ${eleccion(jugador)}. ${resultado}.`;
    document.getElementById('mensaje').textContent = mensaje;
    actualizarMarcador();
}

document.getElementById('piedra').addEventListener('click', () => jugar(1));
document.getElementById('papel').addEventListener('click', () => jugar(2));
document.getElementById('tijera').addEventListener('click', () => jugar(3));
