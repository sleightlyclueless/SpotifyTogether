import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HOME, LOGIN, SPOTIFY } from "./constants";
import { HomePage, LoginPage, SpotifyPage } from "./pages";
import "./globalCSS.css";
import { IonApp, setupIonicReact } from "@ionic/react";
import "@ionic/react/css/core.css";

setupIonicReact();

export const App = () => {
  return (
    <IonApp>
      <BrowserRouter>
        <Routes>
          <Route path="/"></Route>
          <Route path={LOGIN} element={<LoginPage />}></Route>
          <Route path={HOME} element={<HomePage />}></Route>
          <Route path={SPOTIFY} element={<SpotifyPage />}></Route>
        </Routes>
      </BrowserRouter>
    </IonApp>
  );
};
