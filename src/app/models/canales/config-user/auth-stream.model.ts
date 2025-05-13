export class UsuarioKey {
    constructor(
        public nombre: string,
        public streamKey: string,
        public msg?: string
    ) { }

}

export class changePassword {
    constructor(
        public passwordActual: string,
        public password: string,
        public passwordDos: string,
    ) { }

}


