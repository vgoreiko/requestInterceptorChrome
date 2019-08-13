import React from "react";

export interface TopSectionState {
    enabled: boolean,
}

export interface TopSectionProps {
    changeEnabled: (checked: boolean,
                    event: React.SyntheticEvent<MouseEvent | KeyboardEvent> | MouseEvent,
                    id: string) => void,
}

export interface TopSectionPropsModel extends TopSectionState, TopSectionProps{}
