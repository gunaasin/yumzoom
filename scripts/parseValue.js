export function parseJwt() {
    const { token } = JSON.parse(localStorage.getItem("key"));
    try {
        const base64Url = token.split('.')[1];
        const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        const jsonPayload = decodeURIComponent(atob(base64).split('').map((c) => {
            return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
        }).join(''));
        const info = JSON.parse(jsonPayload);
        const array = {
            token,
            email: info.sub,
            role: info.role[0]
        }
        return array;

    } catch (error) {
        console.warn("Invalid Token", error);
        return null;
    }
}