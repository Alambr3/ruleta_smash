const personajes = [
  "Calabaza", "Maestro Gatuno", "Molly", "Nui", "Parfait", "Peter", "Rapunzel",
  "Ravi", "Wukong", "Zepeta", "Alí", "Caperucita", "Kurenai", "Lobo Feroz", "Nieves",
  "Aoi", "Brick", "Ceni", "Don Quijote", "Kaiser", "Maya", "Timun", "Yong Yong",
  "Fulgor", "Garfio", "Gumi", "Ovinus", "Robin", "Alicia", "Octavia", "Reina Bruja",
  "Ricitos", "Lauren y Vex", "Patita y Cisne", "Víctor", "Hammelin", "Pinocho",
  "Briar", "Woochi", "Narsha", "Marina", "Javert", "Proc", "Sra Lettuse"
];

const lugares = ["Touchdown/Combate Duo", "Combate Equipo/Corona", "Dominio", "Touchdown/Combate Equipo"];

let giroActual = 0;
let resultado1 = null;
let resultado2 = null;

const canvas = document.getElementById("ruleta");
const ctx = canvas.getContext("2d");
const radius = canvas.width / 2;
const audio = document.getElementById("audio");

canvas.style.transform = "rotate(-90deg)";
canvas.style.transition = "none";

function dibujarRuleta() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  const anguloPorSector = (2 * Math.PI) / personajes.length;
  for (let i = 0; i < personajes.length; i++) {
    const anguloInicio = i * anguloPorSector;
    const anguloFin = anguloInicio + anguloPorSector;
    ctx.beginPath();
    ctx.moveTo(radius, radius);
    ctx.arc(radius, radius, radius, anguloInicio, anguloFin);
    ctx.fillStyle = i % 2 === 0 ? "#04a0faff" : "#d5d1e4ff";
    ctx.fill();
    ctx.save();
    ctx.translate(radius, radius);
    ctx.rotate(anguloInicio + anguloPorSector / 2);
    ctx.textAlign = "right";
    ctx.fillStyle = "black";
    ctx.font = "13px Arial";
    ctx.fillText(personajes[i], radius - 10, 5);
    ctx.restore();
  }
}

dibujarRuleta();

function realizarGiro(callback) {
  const anguloPorSector = 360 / personajes.length;
  const seleccion = Math.floor(Math.random() * personajes.length);
  const anguloFinal = (360 * 5 + (360 - seleccion * anguloPorSector) - anguloPorSector / 2) + 270;

  canvas.style.transition = "transform 4s cubic-bezier(0.33, 1, 0.68, 1)";
  canvas.style.transform = `rotate(${anguloFinal % 360 + 360}deg)`;

  audio.play();

  setTimeout(() => {
    const personajeSeleccionado = personajes[seleccion];
    const img = document.createElement("img");
    img.src = `./img/${personajeSeleccionado}.png`;
    img.alt = personajeSeleccionado;

    const contenedor = document.getElementById("resultado");
    const elemento = document.createElement("div");
    elemento.innerHTML = `<p>${personajeSeleccionado}</p>`;
    elemento.appendChild(img);

    if (giroActual === 0) {
      contenedor.innerHTML = "";
      contenedor.appendChild(elemento);
      resultado1 = personajeSeleccionado;
      giroActual++;
    } else {
      resultado2 = personajeSeleccionado;
      contenedor.appendChild(elemento);
    }

    if (callback) callback();
  }, 4000); // tiempo que dura el giro
}

document.getElementById("girarBtn").addEventListener("click", girarRuleta);


  function girarRuleta() {
  document.getElementById("girarBtn").style.display = "none"; // 
  realizarGiro(() => {
    setTimeout(() => {
      realizarGiro(() => {
        const lugar = lugares[Math.floor(Math.random() * lugares.length)];
        document.querySelector(".batalla").style.display = "block";
        document.querySelector(".batalla").dataset.lugar = lugar;
        giroActual = 0;
      });
    }, 1500); // tiempo entre giros en milisegundos (0.5s aquí)
  });
}

document.getElementById("btnGano").addEventListener("click", () => guardarResultado(true));
document.getElementById("btnPerdio").addEventListener("click", () => guardarResultado(false));

function guardarResultado(gano) {
  const lugar = document.querySelector(".batalla").dataset.lugar;
  const entrada = {
    personaje1: resultado1,
    personaje2: resultado2,
    lugar,
    gano
  };
  agregarHistorial(entrada);
  document.querySelector(".batalla").style.display = "none";
  document.getElementById("resultado").innerHTML = "";
}

// Mostrar estadísticas

document.getElementById("verEstadisticasBtn").addEventListener("click", () => {
  document.getElementById("seccionRuleta").style.display = "none";
  document.getElementById("seccionEstadisticas").style.display = "block";
  mostrarEstadisticas();
});

document.getElementById("verRuletaBtn").addEventListener("click", () => {
  document.getElementById("seccionEstadisticas").style.display = "none";
  document.getElementById("seccionRuleta").style.display = "block";
});

function mostrarEstadisticas() {
  const datos = obtenerHistorial();
  const resumen = {};
  let total = 0;

  datos.forEach(d => {
    total++;
    [d.personaje1, d.personaje2].forEach(p => {
      if (!resumen[p]) resumen[p] = { ganadas: 0, perdidas: 0 };
    });
    if (d.gano) {
      resumen[d.personaje1].ganadas++;
      resumen[d.personaje2].perdidas++;
    } else {
      resumen[d.personaje1].perdidas++;
      resumen[d.personaje2].ganadas++;
    }
  });

  const tabla = document.getElementById("tablaEstadisticas");
  tabla.innerHTML = `<p>Total de batallas: ${total}</p>`;

  let html = '<table border="1"><tr><th>Personaje</th><th>Ganadas</th><th>Perdidas</th></tr>';
  for (let p in resumen) {
    html += `<tr><td>${p}</td><td>${resumen[p].ganadas}</td><td>${resumen[p].perdidas}</td></tr>`;
  }
  html += '</table>';
  tabla.innerHTML += html;

  // Ranking
  const rankingGanadores = Object.entries(resumen).sort((a, b) => b[1].ganadas - a[1].ganadas);
  const rankingDerrotas = Object.entries(resumen).sort((a, b) => b[1].perdidas - a[1].perdidas);

  const mejorGanador = rankingGanadores[0];
  const peorPersonaje = rankingDerrotas[0];

  tabla.innerHTML += `<p>🥇 Personaje con más victorias: <strong>${mejorGanador[0]}</strong> (${mejorGanador[1].ganadas})</p>`;
  tabla.innerHTML += `<p>💔 Personaje con más derrotas: <strong>${peorPersonaje[0]}</strong> (${peorPersonaje[1].perdidas})</p>`;

  // Filtros
  const selectPersonaje = document.getElementById("filtroPersonaje");
  selectPersonaje.innerHTML = '<option value="">Todos</option>' + personajes.map(p => `<option value="${p}">${p}</option>`).join("");

  const selectLugar = document.getElementById("filtroLugar");
  selectLugar.innerHTML = '<option value="">Todos</option>' + lugares.map(l => `<option value="${l}">${l}</option>`).join("");
}
