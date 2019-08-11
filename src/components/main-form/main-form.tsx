import React from "react"
import TopSection from "../top-section/top-section";
import ParamsSection from "../params-section/Params-section";
import FormState from "./form-state.model";

const initState = {
    enabled: true,
    requestUrl: 'Bla',
    statusCode: 200,
    response: '{}',
    timeout: 1000
}

export default class MainForm extends React.Component {
    state:FormState = initState

    render() {
        return (
            <section className="form-section">
                <TopSection
                    enabled={this.state.enabled}
                    requestUrl={this.state.requestUrl}
                    changeEnabled={this.changeEnabled}
                    urlChanged={this.urlChanged}/>

                <hr/>
                <ParamsSection
                    response={this.state.response}
                    statusCode={this.state.statusCode}
                    timeout={this.state.timeout}
                    changeResponseValue={this.changeResponseValue}
                    changeStatusCode={this.changeStatusCode}
                    changeTimeout={this.changeTimeout} />
                <hr/>
                <div className="row">
                    <button type="button" id="clear-log" onClick={this.clearLog}>Clear log</button>
                </div>
            </section>
        )
    }

    componentDidMount(): void {
        console.log('DidMount')
        // chrome bind here
    }

    clearLog = () => {

    }

    changeEnabled = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
                enabled: event.currentTarget.checked
        })
    }

    urlChanged = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
                requestUrl: event.currentTarget.value
        })
    }

    changeStatusCode = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            statusCode: event.currentTarget.value
        })
    }

    changeResponseValue = (event: React.FormEvent<HTMLTextAreaElement>) => {
        this.setState({
            response: event.currentTarget.value
        })
    }

    changeTimeout = (event: React.FormEvent<HTMLInputElement>) => {
        this.setState({
            timeout: event.currentTarget.value
        })
    }
}
