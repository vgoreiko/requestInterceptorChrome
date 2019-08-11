import React from "react";

export interface TopSectionState {
    enabled: boolean,
    requestUrl: string
}

export interface TopSectionProps {
    changeEnabled: (event: React.FormEvent<HTMLInputElement>) => void,
    urlChanged: (event: React.FormEvent<HTMLInputElement>) => void
}

export interface TopSectionPropsModel extends TopSectionState, TopSectionProps{}
