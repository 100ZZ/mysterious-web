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
        default:
            return code
    }
};

export const statusTypeToCode = (status: string) => {
    switch (status) {
        case "禁用中":
            return 0
        case "启用中":
            return 1
        default:
            return status
    }
};