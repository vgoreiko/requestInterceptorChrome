import {Debuggee} from "./debuggee.model";

export interface NeedModificationOptions {
    message: string,
    params: any,
    debuggeeId: Debuggee,
    enabled: boolean,
    requestUrls: string[],
    tabId: number
}
