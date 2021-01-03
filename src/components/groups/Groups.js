import React from "react";
import "./Groups.css";
import Modal from "../modal/Modal";
import ModalPrompt from "../modalPrompt/ModalPrompt";
import Toast from "../toast/Toast";

class Groups extends React.Component {
  state = {
    modalVisible: null,
    modalHeader: "Header",
    modalText:
      "This is some dummy text for modal window. If you see this probably something went wrong.",
    modalCancellable: false,
    modalYesText: "Yes",
    modalNoText: "No",
    modalPromptVisible: null,
    modalPromptHeader: "Header",
    modalPromptYesText: "Yes",
    modalPromptNoText: "No",
    modalPromptPlaceholder: "text",
    toastVisible: null,
    toastText: "Success"
  };

  changeGroup = () => {
    this.setState({
      modalPromptVisible: true,
      modalPromptHeader: "Введите группу",
      modalPromptYesText: "Изменить",
      modalPromptNoText: "Отмена",
      modalPromptPlaceholder: "группа"
    });
  };

  changeGroupSaved = group => {
    let groups = JSON.parse(localStorage.getItem("savedGroups"));
    groups = groups.filter(value => value !== group);
    groups.unshift(group);
    this.setState({
      toastVisible: true,
      toastText: "Изменено"
    });
    localStorage.clear();
    localStorage.setItem("group", group);
    localStorage.setItem("savedGroups", JSON.stringify(groups));
  };

  modalOnYes = () => {
    this.setState({ modalVisible: false });
  };

  modalPromptOnYes = text => {
    if (text === "") return;
    if (!text.match("^\\d{6}$")) {
      this.setState({
        modalPromptVisible: false,
        modalVisible: true,
        modalHeader: "Ошибка!",
        modalCancellable: false,
        modalText: "Неверная группа.",
        modalYesText: "Ок",
        modalNoText: "Update"
      });
      return;
    }
    let groups = JSON.parse(localStorage.getItem("savedGroups"));
    if (!groups.includes(text)) {
      if(groups.length === 5)
        groups.pop();
    } else {
      groups = groups.filter(value => value !== text);
    }
    groups.unshift(text);
    this.setState({
      modalPromptVisible: false,
      toastVisible: true,
      toastText: "Изменено"
    });
    localStorage.clear();
    localStorage.setItem("group", text);
    localStorage.setItem("savedGroups", JSON.stringify(groups));
  };

  modalPromptOnNo = () => {
    this.setState({ modalPromptVisible: false });
  };

  update = () => {
    let group = localStorage.getItem("group") || "951007";
    let groups = localStorage.getItem("savedGroups");
    localStorage.clear();
    localStorage.setItem("group", group);
    localStorage.setItem("savedGroups", groups);
    this.setState({
      toastVisible: true,
      toastText: "Обновлено"
    });
    // window.location.reload();
  };

  closeToast = () => {
    this.setState({ toastVisible: false });
  };

  clearCash = () => {
    localStorage.clear();
    this.setState({
      toastVisible: true,
      toastText: "Очищено"
    });
  }

  render() {
    let groups = JSON.parse(localStorage.getItem("savedGroups"));
    if (groups === null) {
      groups = [];
      groups.push("951007");
      localStorage.setItem("savedGroups", JSON.stringify(groups));
    }
    let groupsDiv = [];
    for (let i = 0; i < groups.length; i++) {
      groupsDiv.push(
        <div
          key={i}
          className="groups-button"
          onClick={e => this.changeGroupSaved(groups[i])}
        >
          <i className="material-icons">autorenew</i>
          <p>{groups[i]}</p>
        </div>
      );
    }
    return (
      <div className="Groups tab">
        <Toast
          visible={this.state.toastVisible}
          text={this.state.toastText}
          closeFunc={this.closeToast}
        />
        <ModalPrompt
          visible={this.state.modalPromptVisible}
          header={this.state.modalPromptHeader}
          yesText={this.state.modalPromptYesText}
          onYes={this.modalPromptOnYes}
          noText={this.state.modalPromptNoText}
          onNo={this.modalPromptOnNo}
          placeholder={this.state.modalPromptPlaceholder}
        />
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
        <h5 className="tab-upper-header-groups">.</h5>
        <h1 className="tab-header-groups">Настройки</h1>
        <div className="groups-container">
          <div className="groups-button" onClick={e => this.changeGroup()}>
            <i className="material-icons">group</i>
            <p>Изменить группу</p>
          </div>
          <div className="groups-button" onClick={e => this.update()}>
            <i className="material-icons">update</i>
            <p>Обновить расписание</p>
          </div>
          <div className="groups-button" onClick={e => this.clearCash()}>
            <i className="material-icons">clear</i>
            <p>Очистить кэш</p>
          </div>
        </div>
        <div className="groups-container">{groupsDiv}</div>
      </div>
    );
  }
}

export default Groups;
