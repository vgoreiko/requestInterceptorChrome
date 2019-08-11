import React from 'react';
import './Params-section.css';
import {ParamsSectionPropsModel} from "./params-section-props.model";

export default class ParamsSection extends React.Component<ParamsSectionPropsModel> {
    render() {
        return (
            <section className="params-section">
                <h3>Params to change:</h3>

                <div className="row">
                    <label htmlFor="status-code">
                        Status Code:
                        <div>
                            <input type="number"
                                   className="status-code"
                                   onChange={this.props.changeStatusCode}
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
                                      onChange={this.props.changeResponseValue}></textarea>
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
                                   onChange={this.props.changeTimeout}
                            />
                        </div>
                    </label>
                </div>

            </section>
        )
    }
}


