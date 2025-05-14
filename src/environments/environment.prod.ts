
// let ip = 'https://accomstv-production.up.railway.app'
// let imgs = 'https://accomstv-production.up.railway.app'
// let rtmp = 'rtmp://accomstv-production.up.railway.app/live/'
let ip = 'https://1c01-34-60-233-227.ngrok-free.app'
let imgs = 'https://7144-34-60-233-227.ngrok-free.app'
let rtmp = 'rtmp://8.tcp.ngrok.io:10582/live/'
// let ipvideo = 'https://ec2-52-90-118-173.compute-1.amazonaws.com'

// let ip = 'https://ec2-52-90-118-173.compute-1.amazonaws.com'
// let imgs = 'https://ec2-52-90-118-173.compute-1.amazonaws.com'
// let rtmp = 'rtmp://ec2-52-90-118-173.compute-1.amazonaws.com/live/'
// let ip = 'https://3x1c783j-3000.use2.devtunnels.ms'
export const environment = {
   production: false,
   apiURL: `${ip}/api`, // Cambia esto a la URL de tu API
   // apiURL: `${ip}:3000/api`, // Cambia esto a la URL de tu API
   // apiURLVideo: `${imgs}:8000`, // DONDE ESTE LO DEL SISTEMA RTMP EN VIDEO
   apiURLVideo: `${imgs}:8443`, // DONDE ESTE LO DEL SISTEMA RTMP EN VIDEO
   apiURLSockets: `${ip}`, // DONDE SE ALMACENEN LOS SOCKETS
   // apiURLSockets: `${ip}:3000`, // DONDE SE ALMACENEN LOS SOCKETS
   apiImagenes: `${imgs}`, // DONDE SE ALMACENEN LAS IMAGENES
   // apiImagenes: `${imgs}:3000`, // DONDE SE ALMACENEN LAS IMAGENES
   apiRTMP: `${rtmp}`, // DONDE SE GESTIONA EL RMP

};