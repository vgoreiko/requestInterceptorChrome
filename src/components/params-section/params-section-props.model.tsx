import * as React from "react";

export interface ParamsSectionState {
    statusCode: number,
    response: string,
    timeout: number
}
export interface ParamsSectionProps {
    changeStatusCode: (event: React.FormEvent<HTMLInputElement>) => void
    changeResponseValue: (event: React.FormEvent<HTMLTextAreaElement>) => void
    changeTimeout: (event: React.FormEvent<HTMLInputElement>) => void
}

export interface ParamsSectionPropsModel extends ParamsSectionState, ParamsSectionProps{

}
