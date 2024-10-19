import { CanalModel, Usuario } from "../../models/canales/canales.model";

export interface CanalInterface {
    canal: CanalModel
}


export interface CanalesInterface {
    msg: string;
    canales: CanalModel[];
    usuario: Usuario;
}

export interface UsuarioInterface {
    token: string;
    usuario: CanalModel;
}

export interface messageSocketInterface {
    message: string;
    user: string;
    iduser: number;
}