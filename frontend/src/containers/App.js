import React from "react";

import "../styles/App.scss";

import UniversalLandingPage from "../containers/UniversalLandingPage.js";
import EnterNicknamePage from "../containers/EnterNicknamePage.js";
import GameCodePage from "../containers/GameCodePage.js";
import Scoreboard from "../containers/Scoreboard.js";
import Leaderboard from "./Leaderboard";

import { Route, Switch } from "react-router-dom";

function App() {
  return (
    <div className="App glow">
      <Switch>
        <Route path="/player" />

        <Route path="/host" />

        <Route path="/enter-nickname" component={EnterNicknamePage}/>

        <Route path="/enter-code" component={GameCodePage}/>

        <Route path="/scoreboard" component={Scoreboard}/>

        <Route path="/leaderboard" component={Leaderboard}/>

        <Route path="/" component={UniversalLandingPage} />
      </Switch>
    </div>
  );
}

export default App;
