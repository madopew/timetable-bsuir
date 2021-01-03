import React from "react";
import "./Toast.css";

let tid;

class Toast extends React.Component {
    componentDidUpdate() {
        if(this.props.visible)
            tid = setTimeout(() => this.props.closeFunc(), 1500);
    }
    componentWillUnmount() {
        clearTimeout(tid);
    }
    render() {
        return (
            <div className={this.props.visible === null ? "Toast hidden" : this.props.visible ? "Toast visible-toast" : "Toast hidden-animation-toast"}>
                <div className="toast-container">
                    <svg version="1.1" 
                        id="tick" 
                        xmlns="http://www.w3.org/2000/svg" 
                        xmlnsXlink="http://www.w3.org/1999/xlink" 
	                    viewBox="10 10 18 18">
                    <polyline className="tick path" style={{
                            fill:"none",
                            strokeWidth:2,
                            strokeLinejoin:"round",
                            strokeMiterlimit:10
                        }} 
                        points="11.6,20 15.9,24.2 26.4,13.8 "/>
                    </svg>
                    <h2>{this.props.text}</h2>
                </div>
            </div>
        )
    }
}

export default Toast;
