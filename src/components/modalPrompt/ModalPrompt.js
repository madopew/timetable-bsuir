import React from 'react';
import './ModalPrompt.css'

class ModalPrompt extends React.Component {
    state = {
        input: ""
    }

    render() {
        return(
            <div className={(this.props.visible === null) ? "ModalPrompt hidden" : (this.props.visible) ? "ModalPrompt visible-modalprompt" : "ModalPrompt hidden-animation-modalprompt"}>
                <div className={(this.props.visible === null) ? "container-modalprompt hidden" : (this.props.visible) ? "container-modalprompt visible-modalprompt-container" : "container-modalprompt hidden-animation-modalprompt-container"}>
                    <h3>{this.props.header}</h3>
                    <input type="text"
                    pattern="[0-9]*"
                    value={this.state.input}
                    placeholder={this.props.placeholder} 
                    onChange={e => {
                      e.target.value.length < 7 &&
                        this.setState({
                          input: e.target.value
                        });
                    }}/>
                    <div className="buttons-modalprompt">       
                        <button className="secondary-modalprompt" onClick={() => {
                            this.setState({input:""});
                            this.props.onNo();
                            }}>{this.props.noText}</button>                 
                        <button className="primary-modalprompt" onClick={() => {
                            this.setState({input:""});
                            this.props.onYes(this.state.input);
                            }}>{this.props.yesText}</button>
                    </div>
                </div>
            </div>
        );
    };
}
export default ModalPrompt;