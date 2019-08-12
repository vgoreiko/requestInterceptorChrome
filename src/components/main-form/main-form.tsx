/*global chrome*/
import React from "react"
import TopSection from "../top-section/top-section";
import ParamsSection from "../params-section/Params-section";
import FormState from "./form-state.model";
import {Debuggee, getIsTrackedUrl, handleRequestModification, isOptions, urlPatterns} from "../../utils/intercept";

const initState = {
    enabled: true,
    requestUrl: 'Bla',
    statusCode: 200,
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


            window.addEventListener("load", () => {
                if(chrome.debugger){
                    chrome.debugger.sendCommand({tabId}, "Network.enable");
                    chrome.debugger.sendCommand({tabId}, "Network.setRequestInterception", {patterns: urlPatterns});
                    chrome.debugger.onEvent.addListener(this.onEvent);
                    // bindClearClick()
                }
            });
            window.addEventListener("unload", function() {
                chrome.debugger.detach({tabId});
            });
        }
    }

    needModification(message: string, params: any, debuggeeId: any) {
        const isEnabledInterceptor = this.state.enabled
        const filterUrlValue = this.state.requestUrl
        const isNeededTab = (this.state.tabId === debuggeeId.tabId);
        const isTrackedUrl = getIsTrackedUrl(params, filterUrlValue);
        const isMethodOptions = isOptions(params);

        return (isNeededTab && isEnabledInterceptor && isTrackedUrl && !isMethodOptions)
    }

    onNetworkRequestIntercepted(message: string, params: any, debuggeeId: Debuggee){
        const neededRequestModification = this.needModification(message, params, debuggeeId);
        if(neededRequestModification) {
            setTimeout(() => {
                handleRequestModification(params, this.state.tabId, this.state.response, this.state.statusCode)
            }, this.state.timeout)
        }
        else{
            chrome.debugger.sendCommand(
                {tabId: this.state.tabId},
                "Network.continueInterceptedRequest",
                {interceptionId: params.interceptionId});
        }
    }

    onEvent(debuggeeId: Debuggee, message: string, params: any) {
        const filterUrlValue = this.state.requestUrl;
        const isTrackedUrl = getIsTrackedUrl(params, filterUrlValue);

        if(message === "Network.requestIntercepted"){
            this.onNetworkRequestIntercepted(message, params, debuggeeId)
        }
        //
        // if (message === "Network.requestWillBeSent") {
        //     onNetworkRequestWillBeSent(params)
        // } else if (message === "Network.responseReceived" && isTrackedUrl) {
        //     appendResponse(params.requestId, params.response);
        // }
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
