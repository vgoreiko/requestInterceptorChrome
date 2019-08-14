import React from "react";

export default class MainFormThead extends React.Component {
    render() {
        return (
            <thead className="thead-light">
            <tr>
                <th>#</th>
                <th>Remove</th>
                <th>SearchUrl</th>
                <th>StatusCode</th>
                <th>Response to return</th>
                <th>Timeout</th>
                <th>Enabled</th>
            </tr>
            </thead>
        )
    }
}
