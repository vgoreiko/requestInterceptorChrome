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

                <div className="row">
                    <label htmlFor="url-to-intercept">
                        Response to modify:
                        <div>
                            <input type="text"
                                   className="url-to-intercept"
                                    value={this.props.requestUrl}
                                   onChange={this.props.urlChanged}
                            />
                        </div>
                    </label>
                </div>
            </div>
        )
    }
}
