import { UsuarioKey } from "../../models/canales/config-user/auth-stream.model";


export interface ConfigUserData {
    nombre: string;
    id: number;
    logo: null | string;
    portada: null | string;
    correo: string;
}

export interface UserKeyData {
    usuario: UsuarioKey
}