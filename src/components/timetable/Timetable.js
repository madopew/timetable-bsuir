import React from "react";
import "./Timetable.css";
import axios from "axios";
import SwipeableViews from "react-swipeable-views";
import { virtualize } from "react-swipeable-views-utils";
import Lesson from "../lesson/Lesson";
import Modal from "../modal/Modal";
import ReactLoading from "react-loading";

let d = new Date();
let days = [
  "воскресенье",
  "понедельник",
  "вторник",
  "среда",
  "четверг",
  "пятница",
  "суббота"
];
let months = [
  "Января",
  "февраля",
  "марта",
  "апреля",
  "мая",
  "июня",
  "июля",
  "августа",
  "сентября",
  "октября",
  "ноября",
  "декабря"
];

const VirtualizeSwipeableViews = virtualize(SwipeableViews);
let styles = {
  slide: {
    width: "100%",
    color: "#fff",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    paddingTop: "18vh",
    paddingBottom: "10vh",
    WebkitOverflowScrolling: "touch",
    minHeight: 100,
    overflow: "scroll",
    zIndex: 100
  }
};
const CancelToken = axios.CancelToken;
let cancel;

let dayOfWeek = [6, 0, 1, 2, 3, 4, 5];

class Timetable extends React.Component {
  state = {
    timetable: JSON.parse(localStorage.getItem("timetable")),
    currentWeek: localStorage.getItem("currentWeek") || -1,
    nextWeek: localStorage.getItem("nextWeek") || -1,
    date: d.getDate() + " " + months[d.getMonth()],
    day: days[d.getDay()],
    index: 0,
    modalVisible: null,
    modalHeader: "Header",
    modalText:
      "This is some dummy text for modal window. If you see this probably something went wrong.",
    modalCancellable: true,
    modalYesText: "Yes",
    modalNoText: "No",
    group: localStorage.getItem("group") || "951007",
    loadingVisible: false
  };

  componentWillUnmount() {
    if (cancel) cancel("Timetable: Request cancelled on unmount");
  }

  componentDidMount() {
    if (d.getDay() === 1) {
      if (
        parseInt(this.state.currentWeek) !== -1 &&
        parseInt(this.state.currentWeek) !== parseInt(this.state.nextWeek)
      ) {
        localStorage.setItem(
          "currentWeek",
          (parseInt(this.state.currentWeek) + 1) % 4
        );
        localStorage.setItem(
          "nextWeek",
          (parseInt(this.state.currentWeek) + 1) % 4
        );
        this.setState({
          currentWeek: (parseInt(this.state.currentWeek) + 1) % 4,
          nextWeek: (parseInt(this.state.currentWeek) + 1) % 4
        });
      }
    } else {
      if (
        parseInt(this.state.currentWeek) !== -1 &&
        parseInt(this.state.currentWeek) === parseInt(this.state.nextWeek)
      ) {
        localStorage.setItem(
          "nextWeek",
          (parseInt(this.state.nextWeek) + 1) % 4
        );
        this.setState({ nextWeek: (parseInt(this.state.nextWeek) + 1) % 4 });
      }
    }
    if (this.state.timetable === null) {
      let timetable = {};
      let currentWeek;
      this.setState({ loadingVisible: true });
      console.log("Fetching timetable");
      axios
        .get(
          "https://journal.bsuir.by/api/v1/studentGroup/schedule?studentGroup=" +
            this.state.group,
          {
            cancelToken: new CancelToken(function executor(c) {
              cancel = c;
            })
          }
        )
        .then(res => {
          if (res.data === "") {
            console.log("Error on fetching timetable: Wrong group");
            this.setState({
              modalVisible: true,
              modalHeader: "Ошибка!",
              modalCancellable: false,
              modalText: "Похоже такой группы не существует.",
              modalYesText: "Ок",
              modalNoText: "Update",
              loadingVisible: false
            });
            let groups = JSON.parse(localStorage.getItem("savedGroups"));
            groups = groups.filter(value => value !== this.state.group);
            localStorage.setItem("savedGroups", JSON.stringify(groups));
            return;
          }
          if (res.data.schedules.length === 0) {
            console.log("Error on fetching timetable: No data");
            this.setState({
              modalVisible: true,
              modalHeader: "Ошибка!",
              modalCancellable: false,
              modalText:
                "Невозможно загрузить расписание на данный момент, сервер не отвечает.",
              modalYesText: "Ок",
              modalNoText: "Update",
              loadingVisible: false
            });
            return;
          }
          let schedules = res.data.schedules;
          currentWeek = res.data.currentWeekNumber - 1;
          for (let day = 0; day < schedules.length; day++) {
            let daySchedule = schedules[day].schedule;
            for (let lesson = 0; lesson < daySchedule.length; lesson++) {
              let weekNums = daySchedule[lesson].weekNumber;
              for (let week = 0; week < weekNums.length; week++) {
                if (weekNums[week] === 0) continue;
                if (timetable[weekNums[week] - 1] === undefined)
                  timetable[weekNums[week] - 1] = [];
                if (timetable[weekNums[week] - 1][day] === undefined)
                  timetable[weekNums[week] - 1][day] = {};
                if (timetable[weekNums[week] - 1][day].weekDay === undefined)
                  timetable[weekNums[week] - 1][day].weekDay =
                    schedules[day].weekDay;
                if (timetable[weekNums[week] - 1][day].lessons === undefined)
                  timetable[weekNums[week] - 1][day].lessons = [];
                timetable[weekNums[week] - 1][day].lessons.push(
                  daySchedule[lesson]
                );
              }
            }
          }
          console.log("Timetable fetched successfully");
          this.setState({
            timetable,
            currentWeek,
            displayedWeek: currentWeek,
            nextWeek: currentWeek,
            loadingVisible: false
          });
          localStorage.setItem("timetable", JSON.stringify(timetable));
          localStorage.setItem("currentWeek", currentWeek);
          localStorage.setItem("nextWeek", currentWeek);
        })
        .catch(err => {
          console.log("Error on fetching timetable:");
          console.log(err);
          if (!axios.isCancel(err)) {
            this.setState({
              modalVisible: true,
              modalHeader: "Внимание!",
              modalCancellable: false,
              modalText: "При загрузке расписания произошла ошибка.",
              modalYesText: "Ок",
              modalNoText: "Update",
              loadingVisible: false
            });
          }
        });
    }
  }

  slideRenderer = params => {
    const { index, key } = params;

    if (window.screen.height >= 812) {
      styles.slide.paddingTop = "16vh";
      styles.slide.paddingBottom = "15vh";
    }

    if (this.state.timetable === null) {
      return <div key={key} style={Object.assign({}, styles.slide)}></div>;
    }

    let phase = index % 7 < 0 ? 7 + (index % 7) : index % 7;
    let day = dayOfWeek[d.getDay()] + phase;
    day = day % 7;

    let week =
      (parseInt(this.state.currentWeek) +
        Math.abs(Math.floor((dayOfWeek[d.getDay()] + index) / 7))) %
      4;
    let lessons = [];
    if (
      this.state.timetable[week][day] === undefined ||
      this.state.timetable[week][day] === null
    )
      lessons.push(
        <div
          key={key * index}
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            width: "100%",
            height: "65vh"
          }}
        >
          <h1>Пар нет :)</h1>
        </div>
      );
    else {
      for (let i = 0; i < this.state.timetable[week][day].lessons.length; i++) {
        let hours = this.state.timetable[week][day].lessons[
          i
        ].endLessonTime.split(":")[0];
        let minutes = this.state.timetable[week][day].lessons[
          i
        ].endLessonTime.split(":")[1];
        let timeOfLesson = new Date();
        timeOfLesson.setHours(hours, minutes, 0);
        let type =
          this.state.timetable[week][day].lessons[i].lessonType === "ЛК"
            ? "Lesson lk"
            : this.state.timetable[week][day].lessons[i].lessonType === "ПЗ"
            ? "Lesson pz"
            : "Lesson lc";
        lessons.push(
          <Lesson
            key={index * key + i}
            time={timeOfLesson}
            type={type}
            mainIndex={index}
            lesson={this.state.timetable[week][day].lessons[i]}
          />
        );
      }
    }
    return (
      <div key={key} style={Object.assign({}, styles.slide)}>
        {lessons}
      </div>
    );
  };

  handleChangeIndex = index => {
    let date = new Date();
    date.setDate(date.getDate() + index);
    this.setState({
      index,
      date: date.getDate() + " " + months[date.getMonth()],
      day: days[date.getDay()]
    });
  };

  modalOnYes = () => {
    this.setState({ modalVisible: false });
  };

  toStart = () => {
    this.setState({
      index: 0,
      date: d.getDate() + " " + months[d.getMonth()],
      day: days[d.getDay()]
    });
  };

  render() {
    return (
      <div className="Timetable tab">
        <div
          className={this.state.loadingVisible ? "Loading" : "Loading hidden"}
        >
          <ReactLoading
            type="spokes"
            color="#aaaaaa"
            height={"6%"}
            width={"6%"}
          />
          <h4>Загрузка</h4>
        </div>
        <Modal
          visible={this.state.modalVisible}
          header={this.state.modalHeader}
          text={this.state.modalText}
          cancellable={this.state.modalCancellable}
          yesText={this.state.modalYesText}
          noText={this.state.modalNoText}
          onYes={this.modalOnYes}
          onNo={this.modalOnNo}
        />
        <div className="timetable-header">
          <h5 className="tab-upper-header">
            {((parseInt(this.state.currentWeek) +
              Math.abs(
                Math.floor((dayOfWeek[d.getDay()] + this.state.index) / 7)
              )) %
              4) +
              1}{" "}
            неделя, {this.state.day}, {this.state.date} - {this.state.group}
          </h5>
          <h1
            className="tab-header"
            onClick={e => {
              this.toStart();
            }}
          >
            расписание
          </h1>
        </div>
        <VirtualizeSwipeableViews
          overscanSlideBefore={3}
          ignoreNativeScroll={true}
          index={this.state.index}
          onChangeIndex={this.handleChangeIndex}
          containerStyle={{ maxHeight: "100vh" }}
          slideRenderer={this.slideRenderer}
        />
      </div>
    );
  }
}

export default Timetable;
