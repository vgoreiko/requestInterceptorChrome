/*global chrome*/
import React from "react"
import TopSection from "../top-section/top-section";
import ParamsSection from "../params-section/Params-section";
import FormState from "./form-state.model";
import {Debuggee, isRequestModificationNeeded} from "../../utils/request-handler";
import {
    addEventListenerForOnEvent,
    addEventListenerOnUnload, addEventListenersOnLoad,
    continueInterception,
    handleRequestModification,
} from "../../utils/chrome-facade";

const initState = {
    enabled: true,
    requestUrl: 'Colleagues',
    statusCode: 403,
    response: '{}',
    timeout: 1000,
    tabId: 0
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
        if(chrome && chrome.debugger) {
            const tabId = parseInt(window.location.search.substring(1))
            this.setState({
                tabId
            })
            addEventListenerOnUnload(tabId)
            addEventListenersOnLoad(tabId)
            addEventListenerForOnEvent(tabId, this.onEvent.bind(this))
        }
    }

    onNetworkRequestIntercepted(message: string, params: any, debuggeeId: Debuggee) {
        const {enabled, requestUrl, tabId} = this.state
        const neededRequestModification = isRequestModificationNeeded({
            message,
            params,
            debuggeeId,
            enabled,
            requestUrl,
            tabId
        })
        if(neededRequestModification) {
            setTimeout(() => {
                handleRequestModification(params, this.state.tabId, this.state.response, this.state.statusCode)
            }, this.state.timeout)
        }
        else{
            continueInterception({tabId: this.state.tabId, interceptionId: params.interceptionId})
        }
    }

    onEvent(debuggeeId: Debuggee, message: string, params: any) {
        if(message === "Network.requestIntercepted"){
            this.onNetworkRequestIntercepted(message, params, debuggeeId)
        }
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
