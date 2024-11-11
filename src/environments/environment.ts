
let ip = 'http://192.168.20.133'
// let ip = 'https://3x1c783j-3000.use2.devtunnels.ms'
export const environment = {
  production: false,
  apiURL: `${ip}:3000/api`, // Cambia esto a la URL de tu API
  apiURLVideo: `${ip}:8000`, // Cambia esto a la URL de tu API
  apiURLSockets: `${ip}:3000`, // Cambia esto a la URL de tu API
  // apiURLSockets: 'http://192.168.20.133:3000', // Cambia esto a la URL de tu API

  // apiURL: 'http://localhost:3000/api' // Cambia esto a la URL de tu API
};