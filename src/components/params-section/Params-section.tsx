import React from 'react';
import './Params-section.css';
import {ParamsSectionPropsModel} from "./params-section-props.model";

export default class ParamsSection extends React.Component<ParamsSectionPropsModel> {
    render() {
        return (
            <>
                <td>
                    <input type="text"
                           className="url-to-intercept"
                           value={this.props.requestUrl}
                           onChange={(e) => this.props.urlChanged(e, this.props.id)}/>
                </td>
                <td>
                    <input type="number"
                           className="status-code"
                           onChange={(e) => this.props.changeStatusCode(e, this.props.id)}
                           value={this.props.statusCode}/>
                </td>
                <td>
                        <textarea className="response"
                                  value={this.props.response}
                                  onChange={(e) => this.props.changeResponseValue(e, this.props.id)}></textarea>
                </td>
                <td>
                    <input type="number"
                           className="timeout"
                           step="1000"
                           min="1000"
                           value={this.props.timeout}
                           onChange={(e) => this.props.changeTimeout(e, this.props.id)}/>
                </td>
            </>
        )
    }
}


