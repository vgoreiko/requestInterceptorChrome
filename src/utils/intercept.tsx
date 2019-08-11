export interface Debuggee {
    tabId?: number;
    extensionId?: string;
    targetId?: string;
}

const tabId = parseInt(window.location.search.substring(1));

export const elementIds = {
    enableCheckbox: 'enable-interceptor',
    clearLog: 'clear-log',
    urlToIntercept: 'url-to-intercept',
    statusCode: 'status-code',
    response: 'response',
    timeout: 'timeout'
};
export const urlPatterns = [{
    urlPattern: '*',
    interceptionStage: 'HeadersReceived'
}];

window.addEventListener("load", function() {
    if(chrome.debugger){
        chrome.debugger.sendCommand({tabId}, "Network.enable");
        chrome.debugger.sendCommand({tabId}, "Network.setRequestInterception", {patterns: urlPatterns});
        chrome.debugger.onEvent.addListener(onEvent);
        // bindClearClick()
    }
});
window.addEventListener("unload", function() {
    chrome.debugger.detach({tabId:tabId});
});

function onEvent(debuggeeId: Debuggee, message: string, params: any) {
    const filterUrlValue = getUrlToInterceptElementValue();
    const isTrackedUrl = getIsTrackedUrl(params, filterUrlValue);

    if(message === "Network.requestIntercepted"){
        onNetworkRequestIntercepted(message, params, debuggeeId)
    }

    if (message === "Network.requestWillBeSent") {
        onNetworkRequestWillBeSent(params)
    } else if (message === "Network.responseReceived" && isTrackedUrl) {
        appendResponse(params.requestId, params.response);
    }
}

function onNetworkRequestWillBeSent(params: any){
    console.log("onNetworkRequestWillBeSent")
}

function onNetworkRequestIntercepted(message: string, params: any, debuggeeId: Debuggee){
    const neededRequestModification = needModification(message, params, debuggeeId);
    if(neededRequestModification) {
        setTimeout(function(){
            handleRequestModification(params)
        }, getTimeoutElementValue())
    }
    else{
        chrome.debugger.sendCommand(
            {tabId},
            "Network.continueInterceptedRequest",
            {interceptionId: params.interceptionId});
    }
}

function handleRequestModification(params: any) {
    chrome.debugger.sendCommand(
        {tabId},
        "Network.getResponseBodyForInterception",
        {interceptionId: params.interceptionId},
        function(response){
            // const bodyData = response.base64Encoded ? atob(response.body) : response.body;
            const newBody = getResponseElementValue();
            const statusCode = getStatusCodeElementValue();
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

function needModification(message: string, params: any, debuggeeId: any) {
    const isEnabledInterceptor = getEnabledCheckboxValue();
    const filterUrlValue = getUrlToInterceptElementValue();
    const isNeededTab = (tabId === debuggeeId.tabId);
    const isTrackedUrl = getIsTrackedUrl(params, filterUrlValue);
    const isMethodOptions = isOptions(params);

    return (isNeededTab && isEnabledInterceptor && isTrackedUrl && !isMethodOptions)
}

function isOptions(params: any) {
    const isRequest = params.request;
    const isResponse = params.response;
    if (isRequest) {
        return params.request.method === "OPTIONS"
    } else if(isResponse) {
        return params.response.method === "OPTIONS"
    }
    return false
}

function getIsTrackedUrl(params: any, filterUrlValue: string) {
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

function appendResponse(requestId: string, response: any) {
    // let requestDiv = requests[requestId];
    // requestDiv.appendChild(formatHeaders(response.requestHeaders));
    //
    // let statusLine = document.createElement("div");
    // statusLine.textContent = "\nHTTP/1.1 " + response.status + " " +
    //     response.statusText;
    // requestDiv.appendChild(statusLine);
    // requestDiv.appendChild(formatHeaders(response.headers));
    console.log('appendResponse')
}

// function formatHeaders(headers: any) {
//     let text = "";
//     for (let name in headers)
//         text += name + ": " + headers[name] + "\n";
//     const div = document.createElement("div");
//     div.textContent = text;
//     return div;
// }

// function parseURL(url: string) {
//     const result = any;
//     const match = url.match(
//         /^([^:]+):\/\/([^\/:]*)(?::([\d]+))?(?:(\/[^#]*)(?:#(.*))?)?$/i);
//     if (!match)
//         return result;
//     result.scheme = match[1].toLowerCase();
//     result.host = match[2];
//     result.port = match[3];
//     result.path = match[4] || "/";
//     result.fragment = match[5];
//     return result;
// }

function getEnabledCheckboxValue() {
    return false
}

function getUrlToInterceptElementValue() {
    return ''
}

function getStatusCodeElementValue() {
    return 200
}

function getResponseElementValue() {
    return ''
}

function getTimeoutElementValue() {
    return 0
}

