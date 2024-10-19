export class CanalModel {
    constructor(
        public id: number,
        public nombre: string,
        public logo?: string,
        public portada?: string) { }

}
export class Usuario {
    constructor(
        public id: number,
        public nombre: string,
        public logo: string,
        public portada: string,
    ) { }

}