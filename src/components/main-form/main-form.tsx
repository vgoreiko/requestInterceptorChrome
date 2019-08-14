/*global chrome*/
import React from "react"
import update from 'immutability-helper';
import './main-form.css'
import TopSection from "../top-section/top-section";
import ParamsSection from "../params-section/Params-section";
import FormState, {initState} from "./form-state.model";
import {Debuggee, isRequestModificationNeeded} from "../../utils/request-handler";
import {
    addEventListenerForOnEvent,
    addEventListenerOnUnload,
    addEventListenersOnLoad,
    continueInterception, getFromStorage,
    handleRequestModification, saveToStorage,
} from "../../utils/chrome-facade";
import {defaultParamsSection, ParamsSectionState} from "../params-section/params-section-props.model";
import MainFormThead from "../main-form-thead/main-form-thead";

const saveStorageKey = 'requestInterceptorChromeStorage'

export default class MainForm extends React.Component {
    state:FormState = initState

    render() {
        return (
            <section className="form-section">
                <TopSection enabled={this.state.enabled} changeEnabled={this.changeEnabled}/>
                <div className="table-responsive">
                    <table className="table table-striped table-light table-bordered">
                        <MainFormThead/>
                        <tbody>
                        {this.state.paramsSections.map((item, index) => {
                            return (
                                <tr className={item.enabled ? 'table-success' : ''} key={index}>
                                    <td>{index + 1}</td>
                                    <td>
                                        <button type="button" className="btn btn-danger btn-sm" onClick={() => this.removeSection(index)}>X</button>
                                    </td>
                                    <ParamsSection
                                        requestUrl={item.requestUrl}
                                        response={item.response}
                                        statusCode={item.statusCode}
                                        timeout={item.timeout}
                                        enabled={item.enabled}
                                        urlChanged={(e) => this.urlChanged(e, index)}
                                        changeResponseValue={(e) => this.changeResponseValue(e, index)}
                                        changeStatusCode={(e) => this.changeStatusCode(e, index)}
                                        changeTimeout={(e) => this.changeTimeout(e, index)}/>
                                        <td>
                                            <div className="form-check">
                                                <input type="checkbox"
                                                       className="form-check-input"
                                                       onChange={(e) => this.changeEnabledSection(e, index)}
                                                       defaultChecked={item.enabled}/>
                                            </div>
                                        </td>
                                </tr>
                            )
                        })}
                        </tbody>
                    </table>
                </div>
                <div className="buttons-section">
                    <button type="button" className="add-params-section btn btn-primary" onClick={this.addSection}>Add section</button>
                    <button type="button" className="remove-all-params btn btn-danger" onClick={this.removeAllSections}>Remove All Sections</button>
                    <button type="button" className="remove-all-params btn btn-success float-right" onClick={this.saveSettings}>Save Settings</button>
                </div>
            </section>
        )
    }

    async componentDidMount() {
        if(chrome && chrome.debugger && chrome.storage) {
            const tabId = parseInt(window.location.search.substring(1))
            let settings = await getFromStorage(saveStorageKey)
            settings = settings ? settings : initState;
            this.setState(settings as FormState)
            this.setState({tabId})
            this.addChromeEventListeners(tabId)
        }
    }

    addSection = () =>  {
        const newId = this.state.paramsSections.length
        const newSection = {...defaultParamsSection, id: newId}
        const newState = update(this.state, {paramsSections: {$push: [newSection]}})
        this.setState(newState)
    }

    removeSection = (index: number) => {
        this.setState((prevState: FormState) => ({
            paramsSections: prevState.paramsSections.filter((_, i) => i !== index)
        }));
    }

    removeAllSections = () => {
        this.setState({
            paramsSections: []
        })
    }

    saveSettings = () => {
        const toSave = this.state
        delete toSave.tabId
        saveToStorage(saveStorageKey, toSave)
    }

    changeEnabledSection = (event: React.FormEvent<HTMLInputElement>, id: number) => {
        const newState = update(this.state, {
            paramsSections: {[id]: {enabled: {$set: event.currentTarget.checked}}}
        });
        this.setState(newState)
    }

    onNetworkRequestIntercepted(message: string, params: any, debuggeeId: Debuggee) {
        const requestUrls = this.state.paramsSections
            .filter(item => !item.enabled)
            .map(param => param.requestUrl)
        const {enabled, tabId} = this.state
        const neededRequestModification = isRequestModificationNeeded({
            message,
            params,
            debuggeeId,
            enabled,
            requestUrls,
            tabId
        })
        if(neededRequestModification) {
            const {response, statusCode, timeout} = this.getModificationResponseSettings(this.state.paramsSections)

            setTimeout(() => {
                handleRequestModification(params, this.state.tabId, response, statusCode)
            }, timeout)
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

    addChromeEventListeners(tabId: number) {
        addEventListenerOnUnload(tabId)
        addEventListenersOnLoad(tabId)
        addEventListenerForOnEvent(tabId, this.onEvent.bind(this))
    }

    getModificationResponseSettings(paramsSections: ParamsSectionState[]) {
        const paramSection = paramsSections.find(section => section.requestUrl)
        const response = paramSection ? paramSection.response : ''
        const statusCode = paramSection ? paramSection.statusCode : 200
        const timeout = paramSection ? paramSection.timeout : 0

        return {
            response,
            statusCode,
            timeout
        }
    }

    changeEnabled = () => {
        const toggled = !this.state.enabled
        this.setState({
                enabled: toggled
        })
    }

    urlChanged = (event: React.FormEvent<HTMLInputElement>, id: number) => {
        const newState = update(this.state, {
            paramsSections: {[id]: {requestUrl: {$set: event.currentTarget.value}}}
        });
        this.setState(newState)
    }

    changeStatusCode = (event: React.FormEvent<HTMLInputElement>, id: number) => {
        const newState = update(this.state, {
            paramsSections: {[id]: {statusCode: {$set: +event.currentTarget.value}}}
        });
        this.setState(newState)
    }

    changeResponseValue = (event: React.FormEvent<HTMLTextAreaElement>, id: number) => {
        const newState = update(this.state, {
            paramsSections: {[id]: {response: {$set: event.currentTarget.value}}}
        });
        this.setState(newState)
    }

    changeTimeout = (event: React.FormEvent<HTMLInputElement>, id: number) => {
        const newState = update(this.state, {
            paramsSections: {[id]: {timeout: {$set: +event.currentTarget.value}}}
        });
        this.setState(newState)
    }

}
