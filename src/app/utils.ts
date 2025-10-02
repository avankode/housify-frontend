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

export interface UserWithHouse {
    username: string;
    email: string;
    house: House | null; // The user's house can be null
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