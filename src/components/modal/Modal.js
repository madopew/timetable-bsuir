import React from 'react';
import './Modal.css'

class Modal extends React.Component {
    render() {
        return(
            <div className={(this.props.visible === null) ? "Modal hidden" : (this.props.visible) ? "Modal visible-modal" : "Modal hidden-animation-modal"}>
                <div className={(this.props.visible === null) ? "container-modal hidden" : (this.props.visible) ? "container-modal visible-modal-container" : "container-modal hidden-animation-modal-container"}>
                    <p className="modal-header">{this.props.header}</p>
                    <p className="modal-body">{this.props.text}</p>
                    <div className="buttons-modal">                        
                        <button className={(this.props.cancellable) ? "secondary-modal" : "secondary-modal hidden"} onClick={() => {this.props.onNo()}}>{this.props.noText}</button>
                        <button className="primary-modal" onClick={() => {this.props.onYes(this.props.cancellable)}}>{this.props.yesText}</button>
                    </div>
                </div>
            </div>
        );
    };
}
export default Modal;