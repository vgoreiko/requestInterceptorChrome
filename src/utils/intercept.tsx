/*global chrome*/

export interface Debuggee {
    tabId?: number;
    extensionId?: string;
    targetId?: string;
}

export const urlPatterns = [{
    urlPattern: '*',
    interceptionStage: 'HeadersReceived'
}];

export function handleRequestModification(params: any, tabId: number, newBody: string, statusCode: number) {
    chrome.debugger.sendCommand(
        {tabId},
        "Network.getResponseBodyForInterception",
        {interceptionId: params.interceptionId},
        function(response){
            params.responseHeaders.status = statusCode;

            const keys = Object.keys(params.responseHeaders);
            const headers = keys.map(key => `${key}: ${params.responseHeaders[key]}`);
            const modifiedHeaders = headers.join('\r\n');

            chrome.debugger.sendCommand(
                {tabId},
                "Network.continueInterceptedRequest",
                {
                    interceptionId: params.interceptionId,
                    rawResponse: btoa('HTTP/1.1 '+ statusCode + '\r\n' + modifiedHeaders + '\r\n\r\n' + newBody)
                }
            );
        })
}

export function isOptions(params: any) {
    const isRequest = params.request;
    const isResponse = params.response;
    if (isRequest) {
        return params.request.method === "OPTIONS"
    } else if(isResponse) {
        return params.response.method === "OPTIONS"
    }
    return false
}

export function getIsTrackedUrl(params: any, filterUrlValue: string) {
    const isRequest = params.request;
    if(isRequest){
        return (filterUrlValue && params.request)
            ? params.request.url.toLowerCase().includes(filterUrlValue.toLowerCase())
            : true
    } else {
        return (filterUrlValue && params.response)
            ? params.response.url.toLowerCase().includes(filterUrlValue.toLowerCase())
            : true
    }
}



