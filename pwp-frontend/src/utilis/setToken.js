// get user token
export function authHeader() {
    // return authorization header with  token
    let user = JSON.parse(localStorage.getItem('userInfo'));

    if (user && user.token) {
        return { 
            "Content-type": "application/json",
            'authorization': user.token 
        };
    } else {
        return {};
    }
}