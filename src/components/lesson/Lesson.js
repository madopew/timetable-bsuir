import React from 'react';
import './Lesson.css';

let d = new Date();

class Lesson extends React.Component {
    render() {
        return (
            <div className={(this.props.time < d && this.props.mainIndex === 0) ? this.props.type + " lesson-not-active" : this.props.type}>
                <div className={this.props.lesson.numSubgroup === 0 ? "lesson-group hidden" : "lesson-group"}>
                    <h4>{this.props.lesson.numSubgroup}</h4>
                </div>
                <div className="lesson-inner">
                    <h4 className="lesson-time"><span class="material-icons">schedule</span>{this.props.lesson.startLessonTime} - {this.props.lesson.endLessonTime}</h4>
                    <h1 className="lesson-subject">{this.props.lesson.subject}</h1>
                    <h4 className="lesson-auditory"><span class={this.props.lesson.auditory.length === 0 ? "material-icons hidden": "material-icons"}>place</span>{this.props.lesson.auditory[0]}</h4>
                    <h4 className="lesson-fio"><span class={(this.props.lesson.employee[0] === undefined) ? "material-icons hidden": "material-icons"}>person</span>{(this.props.lesson.employee[0] !== undefined) ? this.props.lesson.employee[0].fio : ""}</h4>
                </div>
            </div>
        );
    }
}

export default Lesson;