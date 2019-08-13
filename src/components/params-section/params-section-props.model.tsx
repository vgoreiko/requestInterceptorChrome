import * as React from "react";

export interface ParamsSectionState {
    statusCode: number,
    response: string,
    timeout: number,
    requestUrl: string,
    id: number
}
export interface ParamsSectionProps {
    changeStatusCode: (event: React.FormEvent<HTMLInputElement>, id: number) => void
    changeResponseValue: (event: React.FormEvent<HTMLTextAreaElement>, id: number) => void
    changeTimeout: (event: React.FormEvent<HTMLInputElement>, id: number) => void
    urlChanged: (event: React.FormEvent<HTMLInputElement>, id: number) => void
}

export interface ParamsSectionPropsModel extends ParamsSectionState, ParamsSectionProps{

}

export const defaultParamsSection: ParamsSectionState = {
    statusCode: 200,
    response: '',
    timeout: 0,
    requestUrl: '',
    id: 0
}
