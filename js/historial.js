
const historial = [];

function agregarHistorial(entrada) {
  historial.push(entrada);
  guardarHistorialEnArchivo();
}

function obtenerHistorial() {
  return historial;
}

function limpiarHistorial() {
  historial.length = 0;
  guardarHistorialEnArchivo();
}

function guardarHistorialEnArchivo() {
  const blob = new Blob([JSON.stringify(historial, null, 2)], { type: 'application/json' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = 'datos.json';
  a.style.display = 'none';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
}

function descargarHistorial() {
  const blob = new Blob([JSON.stringify(historial, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'datos.json';
  a.click();
  URL.revokeObjectURL(url);
}

// historial.js

const HISTORIAL_KEY = 'historial_ruleta';

function guardarHistorial(datos) {
  localStorage.setItem(HISTORIAL_KEY, JSON.stringify(datos));
}

function obtenerHistorial() {
  const datos = localStorage.getItem(HISTORIAL_KEY);
  return datos ? JSON.parse(datos) : [];
}

function agregarHistorial(entrada) {
  const historial = obtenerHistorial();
  historial.push(entrada);
  guardarHistorial(historial);
}

function limpiarHistorial() {
  localStorage.removeItem(HISTORIAL_KEY);
}
