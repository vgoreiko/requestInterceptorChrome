import React, {Component} from 'react'
import './top-section.css'
import {TopSectionPropsModel} from "./top-section-props.model";
import Switch from "react-switch";

export default class TopSection extends Component<TopSectionPropsModel> {
    render() {
        return (
            <div className="top-section">
                <div className="form-check">
                    <label htmlFor="enable-interceptor" className="form-check-label enable-interceptor">
                        {this.props.enabled ? 'Disable' : 'Enable'} interception
                    </label>&nbsp;
                    <Switch onChange={this.props.changeEnabled} checked={this.props.enabled} />
                </div>
            </div>
        )
    }
}
