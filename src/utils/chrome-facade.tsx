/*global chrome*/
import {Debuggee} from "./request-handler";

export interface ContinueInterceptionOptions {
    tabId: number,
    interceptionId: number
}

export const urlPatterns = [{
    urlPattern: '*',
    interceptionStage: 'HeadersReceived'
}];

export function continueInterception(options: ContinueInterceptionOptions) {
    const {tabId, interceptionId} = options
    chrome.debugger.sendCommand(
        {tabId},
        "Network.continueInterceptedRequest",
        {interceptionId});
}

export function handleRequestModification(params: any, tabId: number, newBody: string, statusCode: number) {
    chrome.debugger.sendCommand(
        {tabId},
        "Network.getResponseBodyForInterception",
        {interceptionId: params.interceptionId},
        function (response) {
            params.responseHeaders.status = statusCode;

            const keys = Object.keys(params.responseHeaders);
            const headers = keys.map(key => `${key}: ${params.responseHeaders[key]}`);
            const modifiedHeaders = headers.join('\r\n');
            const rawResponse=  btoa(unescape(encodeURIComponent('HTTP/1.1 ' + statusCode + '\r\n' + modifiedHeaders + '\r\n\r\n' + newBody)))

            chrome.debugger.sendCommand(
                {tabId},
                "Network.continueInterceptedRequest",
                {
                    interceptionId: params.interceptionId,
                    rawResponse: rawResponse
                }
            );
        })
}

export function detachChromeDebugger(tabId: number) {
    chrome.debugger.detach({tabId});
}

export function addEventListenersOnLoad(tabId: number) {
    window.addEventListener("load", () => {
            chrome.debugger.sendCommand({tabId}, "Network.enable");
            chrome.debugger.sendCommand({tabId}, "Network.setRequestInterception", {patterns: urlPatterns});
    });
}

export function addEventListenerOnUnload(tabId: number) {
    window.addEventListener("unload", function() {
        detachChromeDebugger(tabId);
    });
}

export function addEventListenerForOnEvent(tabId: number, callback: Function) {
    window.addEventListener("load", () => {
            chrome.debugger.onEvent.addListener(function(debuggeeId: Debuggee, message: string, params: any) {
                callback(debuggeeId, message, params)
            });
    });
}
