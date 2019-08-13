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
    requestUrl: string,
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

export function getIsTrackedUrl(params: any, filterUrlValue: string) {
    const isRequest = params.request;
    if (isRequest) {
        return (filterUrlValue && params.request)
            ? params.request.url.toLowerCase().includes(filterUrlValue.toLowerCase())
            : true
    } else {
        return (filterUrlValue && params.response)
            ? params.response.url.toLowerCase().includes(filterUrlValue.toLowerCase())
            : true
    }
}

export function isRequestModificationNeeded(options: NeedModificationOptions) {
    const isEnabledInterceptor = options.enabled
    const filterUrlValue = options.requestUrl
    const isNeededTab = (options.tabId === options.debuggeeId.tabId);
    const isTrackedUrl = getIsTrackedUrl(options.params, filterUrlValue);
    const isMethodOptions = isOptions(options.params);

    return (isNeededTab && isEnabledInterceptor && isTrackedUrl && !isMethodOptions)
}
