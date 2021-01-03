import React from 'react';
import './Examitem.css';

let d = new Date();

class Examitem extends React.Component {
    render() {
        return (
            <div className={(this.props.time < d) ? this.props.type + " exam-not-active" : this.props.type}>
                <div className="examitem-inner">
                    <div className="examitem-dateandtime">
                        <h4 className="examitem-auditory">{this.props.lesson.schedule[0].auditory[0]}</h4>
                        <h4 className="examitem-auditory">{this.props.lesson.weekDay}</h4>
                    </div>
                    <h1 className="examitem-subject">{this.props.lesson.schedule[0].subject}</h1>
                    <h4 className="examitem-fio">{(this.props.lesson.schedule[0].employee[0] !== undefined) ? this.props.lesson.schedule[0].employee[0].fio : ""}</h4>
                    <h4 className="examitem-time">{this.props.lesson.schedule[0].startLessonTime} - {this.props.lesson.schedule[0].endLessonTime}</h4>
                </div>
            </div>
        );
    }
}

export default Examitem;