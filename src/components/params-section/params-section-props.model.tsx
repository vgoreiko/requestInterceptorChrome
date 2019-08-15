import * as React from "react";

export interface ParamsSectionState {
    statusCode: number,
    response: string,
    timeout: number,
    requestUrl: string,
    enabled: boolean
}
export interface ParamsSectionProps {
    changeStatusCode: (event: React.FormEvent<HTMLInputElement>) => void
    changeResponseValue: (event: React.FormEvent<HTMLTextAreaElement>) => void
    changeTimeout: (event: React.FormEvent<HTMLInputElement>) => void
    urlChanged: (event: React.FormEvent<HTMLInputElement>) => void
    changeResponseValueExplicit: (event: string) => void
}

export interface ParamsSectionPropsModel extends ParamsSectionState, ParamsSectionProps{

}

export const defaultParamsSection: ParamsSectionState = {
    statusCode: 200,
    response: '{"property":"example"}',
    timeout: 1000,
    requestUrl: 'someUrl',
    enabled: true
}
