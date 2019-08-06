var tabId = parseInt(window.location.search.substring(1));

const elementIds = {
    enableCheckbox: 'enable-interceptor',
    clearLog: 'clear-log',
    urlToIntercept: 'url-to-intercept',
    statusCode: 'status-code',
    response: 'response'
}

window.addEventListener("load", function() {
    chrome.debugger.sendCommand({tabId:tabId}, "Network.enable");
    chrome.debugger.sendCommand({tabId: tabId}, "Network.setRequestInterception", {patterns: [{
            urlPattern: '*',
            interceptionStage: 'HeadersReceived'
        }]});
    chrome.debugger.onEvent.addListener(onEvent);
    bindClearClick()
});

window.addEventListener("unload", function() {
    chrome.debugger.detach({tabId:tabId});
});

var requests = {};

function onEvent(debuggeeId, message, params) {
    const filterUrlValue = getUrlToInterceptElementValue()
    const isTrackedUrl = getIsTrackedUrl(params, filterUrlValue)

    const neededRequestModification = needModification(message, params, debuggeeId)

    if(message === "Network.requestIntercepted"){
        if(neededRequestModification) {
            const response = chrome.debugger.sendCommand(
                {tabId},
                "Network.getResponseBodyForInterception",
                {interceptionId: params.interceptionId},
                function(response){
                    const bodyData = response.base64Encoded ? atob(response.body) : response.body;
                    const newBody = getResponseElementValue()
                    const statusCode = getStatusCodeElementValue()
                    params.responseHeaders.status = statusCode

                    const keys = Object.keys(params.responseHeaders)
                    const headers = keys.map(key => `${key}: ${params.responseHeaders[key]}`)
                    const modifiedHeaders = headers.join('\r\n')

                    chrome.debugger.sendCommand(
                        {tabId:tabId},
                        "Network.continueInterceptedRequest",
                        {
                            interceptionId: params.interceptionId,
                            rawResponse: btoa('HTTP/1.1 '+ statusCode + '\r\n' + modifiedHeaders + '\r\n\r\n' + newBody)
                        }
                        );
            })
        } else{
            chrome.debugger.sendCommand({tabId:tabId}, "Network.continueInterceptedRequest", {interceptionId: params.interceptionId});
        }
    }

    if (message == "Network.requestWillBeSent") {
        var requestDiv = requests[params.requestId];
        if (!requestDiv) {
            var requestDiv = document.createElement("div");
            requestDiv.className = "request";
            requests[params.requestId] = requestDiv;
            var urlLine = document.createElement("div");
            urlLine.textContent = params.request.url;
            requestDiv.appendChild(urlLine);
        }

        if (params.redirectResponse)
            appendResponse(params.requestId, params.redirectResponse);

        var requestLine = document.createElement("div");
        requestLine.textContent = "\n" + params.request.method + " " +
            parseURL(params.request.url).path + " HTTP/1.1";
        requestDiv.appendChild(requestLine);
        document.getElementById("container").appendChild(requestDiv);
    } else if (message == "Network.responseReceived" && isTrackedUrl) {
        // appendResponse(params.requestId, params.response);
        params.response.status = +getStatusCodeElementValue()
    }
}

function modifyResponse(params) {

}

function needModification(message, params, debuggeeId) {
    const isEnabledInterceptor = getEnabledCheckboxValue()
    const filterUrlValue = getUrlToInterceptElementValue()
    const isNeededTab = (tabId === debuggeeId.tabId)
    const isTrackedUrl = getIsTrackedUrl(params, filterUrlValue)
    const isMethodOptions = isOptions(params)

    return (isNeededTab && isEnabledInterceptor && isTrackedUrl && !isMethodOptions)
}

function isOptions(params) {
    const isRequest = params.request
    const isResponse = params.response
    if (isRequest) {
        return params.request.method === "OPTIONS"
    } else if(isResponse) {
        return params.response.method === "OPTIONS"
    }
    return false
}

function getIsTrackedUrl(params, filterUrlValue) {
    const isRequest = params.request
    if(isRequest){
        return (filterUrlValue && params.request) ? params.request.url.toLowerCase().includes(filterUrlValue.toLowerCase()) : true
    } else {
        return (filterUrlValue && params.response) ? params.response.url.toLowerCase().includes(filterUrlValue.toLowerCase()) : true
    }
}

function appendResponse(requestId, response) {
    var requestDiv = requests[requestId];
    requestDiv.appendChild(formatHeaders(response.requestHeaders));

    var statusLine = document.createElement("div");
    statusLine.textContent = "\nHTTP/1.1 " + response.status + " " +
        response.statusText;
    requestDiv.appendChild(statusLine);
    requestDiv.appendChild(formatHeaders(response.headers));
}

function formatHeaders(headers) {
    var text = "";
    for (name in headers)
        text += name + ": " + headers[name] + "\n";
    var div = document.createElement("div");
    div.textContent = text;
    return div;
}

function parseURL(url) {
    var result = {};
    var match = url.match(
        /^([^:]+):\/\/([^\/:]*)(?::([\d]+))?(?:(\/[^#]*)(?:#(.*))?)?$/i);
    if (!match)
        return result;
    result.scheme = match[1].toLowerCase();
    result.host = match[2];
    result.port = match[3];
    result.path = match[4] || "/";
    result.fragment = match[5];
    return result;
}

function getEnabledCheckboxValue() {
    const checkbox = document.getElementById(elementIds.enableCheckbox)
    if(checkbox) return checkbox.checked
    return false
}

function getClearLogElement() {
    const element = document.getElementById(elementIds.clearLog)
    if(element) return element
}

function getUrlToInterceptElementValue() {
    const element = document.getElementById(elementIds.urlToIntercept)
    if(element) return element.value
    return null
}

function getStatusCodeElementValue() {
    const element = document.getElementById(elementIds.statusCode)
    if(element && element.value) return element.value
    return 200
}

function getResponseElementValue() {
    const element = document.getElementById(elementIds.response)
    if(element && element.value) return element.value
    return ''
}

function clearLog() {
    document.getElementById('container').innerHTML = ''
}

function bindClearClick() {
    const element = getClearLogElement()
    if(element) element.addEventListener('click', function(e){
        return clearLog()
    })
}
