export const codeToNodeType = (code: number) => {
    switch (code) {
        case 0:
            return "Slave"
        case 1:
            return "Master"
        default:
            return code
    }
};

export const nodeTypeToCode = (status: string) => {
    switch (status) {
        case "Slave":
            return 0
        case "Master":
            return 1
        default:
            return status
    }
};

export const codeToNodeStatus = (code: number) => {
    switch (code) {
        case 0:
            return "禁用中"
        case 1:
            return "启用中"
        case 2:
            return "启动失败"
        default:
            return code
    }
};

export const codeToTestCaseStatus = (code: number) => {
    switch (code) {
        case 0:
            return "没有执行";
        case 1:
            return "正在执行";
        case 2:
            return "执行成功"
        case 3:
            return "执行异常"
        case 4:
            return "排队等待"
        case 5:
            return "排队取消"
        default:
            return code;
    }
};