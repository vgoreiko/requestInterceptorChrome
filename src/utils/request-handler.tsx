export interface Debuggee {
    tabId?: number;
    extensionId?: string;
    targetId?: string;
}

export interface NeedModificationOptions {
    message: string,
    params: any,
    debuggeeId: Debuggee,
    enabled: boolean,
    requestUrls: string[],
    tabId: number
}

export function isOptions(params: any) {
    const isRequest = params.request;
    const isResponse = params.response;
    if (isRequest) {
        return params.request.method === "OPTIONS"
    } else if (isResponse) {
        return params.response.method === "OPTIONS"
    }
    return false
}

export function getIsTrackedUrl(params: any, filterUrlValue: string[]) {
    const isRequest = params.request;
    const toLowerCaseUrls = filterUrlValue.map(url => url.toLowerCase())
    if (isRequest) {
        const found = toLowerCaseUrls.findIndex(element => element.includes(params.request.url.toLowerCase())) !== -1
        return (toLowerCaseUrls && params.request)
            ? found
            : false
    } else {
        const found = toLowerCaseUrls.findIndex(element => element.includes(params.response.url.toLowerCase())) !== -1
        return (toLowerCaseUrls && params.response)
            ? found
            : false
    }
}

export function isRequestModificationNeeded(options: NeedModificationOptions) {
    const isEnabledInterceptor = options.enabled
    const filterUrlValue = options.requestUrls
    const isNeededTab = (options.tabId === options.debuggeeId.tabId);
    const isTrackedUrl = getIsTrackedUrl(options.params, filterUrlValue);
    const isMethodOptions = isOptions(options.params);

    return (isNeededTab && isEnabledInterceptor && isTrackedUrl && !isMethodOptions)
}
