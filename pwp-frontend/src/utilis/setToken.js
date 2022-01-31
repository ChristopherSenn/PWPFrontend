// get user token
export function authHeader() {
    // return authorization header with  token
    let user = JSON.parse(localStorage.getItem('userInfo'));

    if (user && user.token) {
        return { 'authorization': user.token };
    } else {
        return {};
    }
}