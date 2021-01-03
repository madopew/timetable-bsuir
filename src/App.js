import React from "react";
import "./App.css";
import { BrowserRouter, Switch, Route, NavLink } from "react-router-dom";
import Timetable from "./components/timetable/Timetable";
import Exams from "./components/exams/Exams";
import Groups from "./components/groups/Groups";

class App extends React.Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Switch>
            <Route exact path="/" component={Timetable} />
            <Route exact path="/exams" component={Exams} />
            <Route exact path="/groups" component={Groups} />
          </Switch>
          <ul className="nav-bar">
            <li>
              <NavLink
                exact
                activeClassName="is-active"
                to={"/"}
                className="nav-link"
              >
                <i className="material-icons">event_note</i>
                Расписание
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeClassName="is-active"
                to={"/exams"}
                className="nav-link"
              >
                <i className="material-icons">school</i>
                Экзамены
              </NavLink>
            </li>
            <li>
              <NavLink
                exact
                activeClassName="is-active"
                to={"/groups"}
                className="nav-link"
              >
                <i className="material-icons">settings_applications</i>
                Настройки
              </NavLink>
            </li>
          </ul>
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
