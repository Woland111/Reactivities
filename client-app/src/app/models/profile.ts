export interface IProfile {
    displayName: string,
    username: string,
    image: string,
    bio: string,
    photos: IPhoto[],
    following: boolean,
    followingCount: number,
    followersCount: number
}

export interface IPhoto {
    id: string,
    url: string,
    isMain: boolean
}

export interface IUserActivity {
    id: string,
    title: string,
    category: string,
    date: Date
}