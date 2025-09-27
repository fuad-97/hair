export interface GeneratedImage {
    id: string;
    src: string;
    prompt: string;
}

export enum Gender {
    Female = 'female',
    Male = 'male',
}

export interface StyleOptions {
    hairTexture?: string;
    hairLength?: string;
    beardStyle?: string;
}