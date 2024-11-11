export interface UserData {
    token: string;
    idUsuario: string;
    nombreUsuario: string;
}

export interface UserDataExpansiva {
    nombre: string;
    id: number;
    logo: null | string;
    portada: null | string;
    correo: string;
}