
let ip = 'https://accomz.work.gd'
// let ipvideo = 'https://ec2-52-90-118-173.compute-1.amazonaws.com'
let imgs = 'https://accomz.work.gd'
let rtmp = 'rtmp://accomz.work.gd/live/'
// let ip = 'https://ec2-52-90-118-173.compute-1.amazonaws.com'
// let imgs = 'https://ec2-52-90-118-173.compute-1.amazonaws.com'
// let rtmp = 'rtmp://ec2-52-90-118-173.compute-1.amazonaws.com/live/'
// let ip = 'https://3x1c783j-3000.use2.devtunnels.ms'
export const environment = {
   production: false,
   apiURL: `${ip}:3000/api`, // Cambia esto a la URL de tu API
   apiURLVideo: `${imgs}:8000`, // DONDE ESTE LO DEL SISTEMA RTMP EN VIDEO
   apiURLSockets: `${ip}:3000`, // DONDE SE ALMACENEN LOS SOCKETS
   apiImagenes: `${imgs}:3000`, // DONDE SE ALMACENEN LAS IMAGENES
   apiRTMP: `${rtmp}`, // DONDE SE GESTIONA EL RMP

};