export interface User {
    username: string;
    email: string;
}
export interface House {
    id: number;
    name: string;
    admin: {
        id: number;
        username: string;
    };
    members: string[];
}
export interface Profile {
    display_name: string;
    phone_number: string;
    profile_photo: string; // This will now be a full URL
}
export interface UserWithHouse {
    username: string;
    email: string;
    house: House | null;
    profile: Profile;
    display_name: string;
    profile_photo_url: string;
}



export const getCookie = (name: string) => {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}