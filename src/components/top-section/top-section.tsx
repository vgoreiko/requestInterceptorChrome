import React, {Component} from 'react'
import './top-section.css'
import {TopSectionPropsModel} from "./top-section-props.model";

export default class TopSection extends Component<TopSectionPropsModel> {
    render() {
        return (
            <div className="top-section">
                <div className="row">
                    <label htmlFor="enable-interceptor">
                        <input type="checkbox"
                               className="enable-interceptor"
                               onChange={this.props.changeEnabled}
                                defaultChecked={this.props.enabled}
                        />
                        Enable interceptor
                    </label>
                </div>
            </div>
        )
    }
}
