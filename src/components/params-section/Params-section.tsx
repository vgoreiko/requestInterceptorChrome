import React from 'react';
import './Params-section.css';
import {ParamsSectionPropsModel} from "./params-section-props.model";

export default class ParamsSection extends React.Component<ParamsSectionPropsModel> {
    render() {
        return (
            <section className="params-section">
                <div className="row">
                    <label htmlFor="url-to-intercept">
                        <b>Response to modify:</b>
                        <div>
                            <input type="text"
                                   className="url-to-intercept"
                                   value={this.props.requestUrl}
                                   onChange={(e) => this.props.urlChanged(e, this.props.id)}
                            />
                        </div>
                    </label>
                </div>
                <p><b>Params to change:</b></p>

                <div className="row">
                    <label htmlFor="status-code">
                        Status Code:
                        <div>
                            <input type="number"
                                   className="status-code"
                                   onChange={(e) => this.props.changeStatusCode(e, this.props.id)}
                                   value={this.props.statusCode}/>
                        </div>
                    </label>
                </div>

                <div className="row">
                    <label htmlFor="response">
                        Response
                        <div>
                            <textarea className="response"
                                      value={this.props.response}
                                      onChange={(e) => this.props.changeResponseValue(e, this.props.id)}></textarea>
                        </div>
                    </label>
                </div>

                <div className="row">
                    <label htmlFor="timeout">
                        Timeout (ms):
                        <div>
                            <input type="number"
                                   className="timeout"
                                   step="1000"
                                   value={this.props.timeout}
                                   onChange={(e) => this.props.changeTimeout(e, this.props.id)}
                            />
                        </div>
                    </label>
                </div>

            </section>
        )
    }
}


