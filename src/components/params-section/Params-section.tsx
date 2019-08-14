import React from 'react';
import './Params-section.css';
import {ParamsSectionPropsModel} from "./params-section-props.model";
import ReactJson from 'react-json-view'
import Modal from 'react-modal';

interface Edit {
    updated_src: any,
}

const customStyles = {
    content : {
        padding                   : '0',
        backgroundColor: '#212529'
    }
};

Modal.setAppElement('#root')

export default class ParamsSection extends React.Component<ParamsSectionPropsModel> {
    state = {
        modalIsOpen: false,
        modalContent: {},
        jsonParseError: false
    }

    render() {
        const modalContent =
            <section className="modal-content-custom">
                <ReactJson theme="monokai" src={this.state.modalContent} onEdit={(edit) => this.onEdit(edit)}/>
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
                     <div className="with-modal">
                         <textarea className="response form-control"
                                   cols={25}
                                   value={this.props.response}
                                   onChange={this.props.changeResponseValue}></textarea>

                         <Modal isOpen={this.state.modalIsOpen}
                                onRequestClose={this.closeModal}
                                onAfterOpen={this.afterOpenModal}
                                style={customStyles}
                                contentLabel="JSON view modal">

                             {!this.state.jsonParseError ? modalContent : <h1>JSON parse error</h1>}
                             <button className="close-button btn btn-dark" onClick={this.closeModal}>X</button>
                             <button className="save-button btn btn-success" onClick={this.saveModalResult}>Save changes</button>
                         </Modal>

                         <button type="button" className="toggler btn btn-info" onClick={this.toggleModalWithJson}>i</button>
                     </div>
                </td>

                <td>
                    <input type="number"
                           className="status-code width-sm form-control"
                           onChange={this.props.changeStatusCode}
                           value={this.props.statusCode}/>
                </td>

                <td>
                    <input type="number"
                           className="timeout form-control width-sm"
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


