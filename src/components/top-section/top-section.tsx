import React, {Component} from 'react'
import './top-section.css'
import {TopSectionPropsModel} from "./top-section-props.model";

export default class TopSection extends Component<TopSectionPropsModel> {
    render() {
        return (
            <div className="top-section">
                <div className="form-check">
                    <input type="checkbox"
                           className="form-check-input"
                           id="enable-interceptor"
                           onChange={this.props.changeEnabled}
                           defaultChecked={this.props.enabled}
                    />
                    <label htmlFor="enable-interceptor" className="form-check-label">
                        Enable interceptor
                    </label>
                </div>
            </div>
        )
    }
}
