export interface IProfile {
    displayName: string,
    username: string,
    image: string,
    bio: boolean,
    photos: IPhoto[]
}

export interface IPhoto {
    id: string,
    url: string,
    isMain: boolean
}