import React from "react";
import "./Modal.css";

class Modal extends React.Component {
  render() {
    return (
      <div
        className={
          this.props.visible === null
            ? "Modal hidden"
            : this.props.visible
            ? "Modal visible-modal"
            : "Modal hidden-animation-modal"
        }
      >
        <div
          className={
            this.props.visible === null
              ? "container-modal hidden"
              : this.props.visible
              ? "container-modal visible-modal-container"
              : "container-modal hidden-animation-modal-container"
          }
        >
          <h1>{this.props.header}</h1>
          <p>{this.props.text}</p>
          <div className="buttons-modal">
            <button
              onClick={() => {
                this.props.onFirst();
              }}
            >
              {this.props.firstText}
            </button>
            <button
              className={this.props.hasSecond ? "" : "hidden"}
              onClick={() => {
                this.props.onSecond();
              }}
            >
              {this.props.secondText}
            </button>
            <button
              className={this.props.cancellable ? "" : "hidden"}
              onClick={() => {
                this.props.onCancel();
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}
export default Modal;
