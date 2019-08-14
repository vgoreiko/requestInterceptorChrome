import React from "react";

export default class MainFormThead extends React.Component {
    render() {
        return (
            <thead className="thead-dark">
            <tr>
                <th>#</th>
                <th>SearchUrl</th>
                <th>Response to return</th>
                <th>StatusCode</th>
                <th>Timeout</th>
                <th>Enabled</th>
                <th>Del</th>
            </tr>
            </thead>
        )
    }
}
