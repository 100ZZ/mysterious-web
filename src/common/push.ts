import router from "../router";

export const checkToLogin = (message: String) => {
    if (message == '用户凭证失效' || message == '用户不存在' || message == '用户未登录') {
        router.push({path: '/login'});
        return false;
    }
}

export const handleTestCaseClick = (testCaseId: number) => {
    // 使用路由跳转到用例页面，并传递用例ID作为查询参数
    router.push({
        path: '/testcase',
        query: {
            id: testCaseId
        }
    });
}