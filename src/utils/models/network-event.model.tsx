import {Request} from "./request.model";
import {Response} from "./response.model";

export type NetworkEvent = {
    request?: Request
    response?: Response
    interceptionId: number
}
