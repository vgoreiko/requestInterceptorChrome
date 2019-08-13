import * as React from "react";

export interface ParamsSectionState {
    statusCode: number,
    response: string,
    timeout: number,
    requestUrl: string,
    id: number,
    enabled: boolean
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
    timeout: 1000,
    requestUrl: 'buildings?',
    id: 0,
    enabled: false
}
