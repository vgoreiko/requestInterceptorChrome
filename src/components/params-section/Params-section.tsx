import React from 'react';
import './Params-section.css';
import {ParamsSectionPropsModel} from "./params-section-props.model";

export default class ParamsSection extends React.Component<ParamsSectionPropsModel> {
    render() {
        return (
            <>
                <td>
                    <input type="text"
                           className="url-to-intercept form-control"
                           value={this.props.requestUrl}
                           onChange={this.props.urlChanged}/>
                </td>
                <td>
                    <input type="number"
                           className="status-code"
                           onChange={this.props.changeStatusCode}
                           value={this.props.statusCode}/>
                </td>
                <td>
                        <textarea className="response form-control"
                                  value={this.props.response}
                                  onChange={this.props.changeResponseValue}></textarea>
                </td>
                <td>
                    <input type="number"
                           className="timeout form-control"
                           step="1000"
                           min="1000"
                           value={this.props.timeout}
                           onChange={this.props.changeTimeout}/>
                </td>
            </>
        )
    }
}


