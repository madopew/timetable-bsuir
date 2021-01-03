import React from "react";
import "./Exams.css";
import axios from "axios";
import Modal from "../modal/Modal";
import Examitem from "../examitem/Examitem";
import ReactLoading from "react-loading";

let d = new Date();
let days = [
  "воскресенье",
  "понедельник",
  "вторник",
  "среда",
  "четверг",
  "пятница",
  "суббота",
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
  "декабря",
];

const CancelToken = axios.CancelToken;
let cancel;

class Exams extends React.Component {
  state = {
    date: d.getDate() + " " + months[d.getMonth()],
    day: days[d.getDay()],
    exams: JSON.parse(localStorage.getItem("exams")),

    modalVisible: null,
    modalHeader: "Header",
    modalText:
      "This is some dummy text for modal window. If you see this probably something went wrong.",
    modalCancellable: true,
    modalHasSecond: true,
    modalFirstText: "Yes",
    modalSecondText: "No",

    group: localStorage.getItem("group") || "951007",
    loadingVisible: false,
  };

  componentWillUnmount() {
    if (cancel) cancel("Exams: Request cancelled on unmount");
  }

  componentDidMount() {
    if (this.state.exams === null) {
      this.updateExams();
    }
  }

  updateExams = () => {
    let exams = {};
    this.setState({ loadingVisible: true });
    console.log("Fetching exams");
    axios
      .get(
        "https://journal.bsuir.by/api/v1/studentGroup/schedule?studentGroup=" +
          this.state.group,
        {
          cancelToken: new CancelToken(function executor(c) {
            cancel = c;
          }),
        }
      )
      .then((res) => {
        if (res.data === "") {
          console.log("Error on fetching exams: Wrong group");
          this.setState({
              modalVisible: true,
              modalHeader: "Похоже такой группы не существует.",
              modalText: "",
              modalCancellable: false,
              modalHasSecond: false,
              modalFirstText: "Отмена",
              loadingVisible: false,
            });
          return;
        }
        if (res.data.examSchedules.length === 0) {
          console.log("Error on fetching exams: No data");
          this.setState({
              modalVisible: true,
              modalHeader:
                "Невозможно загрузить экзамены на данный момент.",
              modalText: "",
              modalCancellable: false,
              modalHasSecond: false,
              modalFirstText: "Отмена",
              loadingVisible: false,
            });
          return;
        }
        exams = res.data.examSchedules;
        console.log("Exams fetched successfully");
        this.setState({ exams, loadingVisible: false });
        localStorage.setItem("exams", JSON.stringify(exams));
      })
      .catch((err) => {
        console.log("Error on fetching exams:");
        console.log(err);
        if (!axios.isCancel(err))
        this.setState({
          modalVisible: true,
          modalHeader:
            "При загрузке экзаменов произошла ошибка.",
          modalText: "",
          modalCancellable: false,
          modalHasSecond: false,
          modalFirstText: "Отмена",
          loadingVisible: false,
        });
      });
  }

  modalOnFirst = () => {
    this.setState({ modalVisible: false });
  };

  render() {
    let lessons = [];
    if (this.state.exams !== null) {
      for (let i = 0; i < this.state.exams.length; i++) {
        let type =
          this.state.exams[i].schedule[0].lessonType === "Консультация"
            ? "Examitem ks"
            : "Examitem ex";
        let timeOfExam = new Date();
        timeOfExam.setDate(this.state.exams[i].weekDay.split(".")[0]);
        timeOfExam.setMonth(
          parseInt(this.state.exams[i].weekDay.split(".")[1]) - 1
        );
        timeOfExam.setFullYear(this.state.exams[i].weekDay.split(".")[2]);
        timeOfExam.setHours(
          this.state.exams[i].schedule[0].endLessonTime.split(":")[0]
        );
        timeOfExam.setMinutes(
          this.state.exams[i].schedule[0].endLessonTime.split(":")[1]
        );
        lessons.push(
          <Examitem
            key={i}
            time={timeOfExam}
            type={type}
            lesson={this.state.exams[i]}
          />
        );
      }
    }
    return (
      <div className="Exams tab">
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
          firstText={this.state.modalFirstText}
          secondText={this.state.modalSecondText}
          hasSecond={this.state.modalHasSecond}
          onFirst={this.modalOnFirst}
          onSecond={this.modalOnSecond}
          onCancel={this.modalOnCancel}
        />
        <div className="exams-header">
          <h5 className="tab-upper-header">
            {this.state.day}, {this.state.date} - {this.state.group}
          </h5>
          <h1 className="tab-header">Экзамены</h1>
        </div>
        <div className="exams-timetable">{lessons}</div>
      </div>
    );
  }
}

export default Exams;
