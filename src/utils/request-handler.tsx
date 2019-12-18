import {NeedModificationOptions} from "./models/need-modification-options.model";
import {NetworkEvent} from "./models/network-event.model";

export function isOptions(params: NetworkEvent ) {
    const isRequest = params.request;
    if (isRequest && params.request) {
        return params.request.method === "OPTIONS"
    }
    return false
}

export function getIsTrackedUrl(params: NetworkEvent, filterUrlValue: string[]) {
    let url = '';
    const isRequest = params.request;
    const toLowerCaseUrls = filterUrlValue.map(url => url
        .replace('http://', '')
        .replace('https://', '')
        .toLowerCase())

    if(isRequest && params.request){
        url = params.request.url.toLowerCase()
    } else if(params.response) {
        url = params.response.url
    }
    url = url.toLowerCase()

    const foundMatch = toLowerCaseUrls.some(function (v) {
        return url.indexOf(v) > 0
    })
    return foundMatch
}

export function isRequestModificationNeeded(options: NeedModificationOptions) {
    const isEnabledInterceptor = options.enabled
    if (!isEnabledInterceptor) return false
    const filterUrlValue = options.requestUrls
    const isNeededTab = (options.tabId === options.debuggeeId.tabId);
    const isTrackedUrl = getIsTrackedUrl(options.params, filterUrlValue);
    const isMethodOptions = isOptions(options.params);
    const result = isNeededTab && isEnabledInterceptor && isTrackedUrl && !isMethodOptions
    return result
}
