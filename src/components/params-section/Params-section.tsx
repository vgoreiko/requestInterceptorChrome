import React from 'react';
import './Params-section.css';
import {ParamsSectionPropsModel} from "./params-section-props.model";
import ReactJson from 'react-json-view'
import Modal from 'react-modal';

interface Edit {
    updated_src: any,
}

Modal.setAppElement('#root')

export default class ParamsSection extends React.Component<ParamsSectionPropsModel> {
    state = {
        modalIsOpen: false,
        modalContent: {},
        jsonParseError: false
    }

    render() {
        const modalContent =
            <section>
                <ReactJson src={this.state.modalContent} onEdit={(edit) => this.onEdit(edit)}/>
                <button className="save-button btn btn-primary" onClick={this.saveModalResult}>Save changes</button>
            </section>

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
                     <div className="with-modal">
                         <textarea className="response form-control"
                                   value={this.props.response}
                                   onChange={this.props.changeResponseValue}></textarea>

                         <Modal isOpen={this.state.modalIsOpen}
                                onRequestClose={this.closeModal}
                                onAfterOpen={this.afterOpenModal}
                                contentLabel="JSON view modal">

                             {!this.state.jsonParseError ? modalContent : <h1>JSON parse error</h1>}
                             <button className="close-button btn btn-dark" onClick={this.closeModal}>X</button>

                         </Modal>

                         <button type="button" className="toggler btn btn-info" onClick={this.toggleModalWithJson}>i</button>
                     </div>
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

    closeModal = () => {
        this.setState({
            modalIsOpen: false,
            jsonParseError: false,
            modalContent: {}
        })
    }

    toggleModalWithJson = () =>  {
        const toggled = !this.state.modalIsOpen
        this.setState({
            modalIsOpen: toggled
        })
    }

    afterOpenModal = () => {
        let toJson
        try{
            toJson = JSON.parse(this.props.response)
        } catch (e) {
            toJson = ''
            this.setState({
                jsonParseError: true
            })
        }
        this.setState({
            modalContent: toJson
        })
    }

    saveModalResult = () => {
        this.props.changeResponseValueExplicit(JSON.stringify(this.state.modalContent))

        this.setState({
            modalIsOpen: false,
            modalContent: {},
            jsonParseError: false
        })
    }

    onEdit(edit: Edit){
        console.log(edit)
        this.setState({
            modalContent: edit.updated_src
        })
    }
}


