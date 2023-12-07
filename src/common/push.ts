import router from "../router";

export const checkToLogin = (message: String) => {
    if (message == '用户凭证失效') {
        router.push({path: '/login'});
        return false;
    }
}