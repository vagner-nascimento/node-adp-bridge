const getFormattedMsg = (msg: string): string => {
    return `${new Date().toISOString()} - ${msg}`
}

const getStringifiedData = (data?: any): string => {
    return data ? JSON.stringify(data) : ''
}

export {
    getFormattedMsg,
    getStringifiedData    
}
