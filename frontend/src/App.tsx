import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HOME, LOGIN, LOGINRESPONSE, SPOTIFY } from "./constants";
import { HomePage, LoginPage, LoginResponsePage, SpotifyPage } from "./pages";
import "./globalCSS.css";
import { IonApp, setupIonicReact } from "@ionic/react";
import "@ionic/react/css/core.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";

setupIonicReact();

export const App = () => {
  return (
    <IonApp>
      <BrowserRouter>
        <Routes>
          <Route path={HOME} element={<HomePage />}></Route>
          <Route path={LOGIN} element={<LoginPage />}></Route>
          <Route path={LOGINRESPONSE} element={<LoginResponsePage />}></Route>
          <Route path={SPOTIFY} element={<SpotifyPage />}></Route>
        </Routes>
      </BrowserRouter>
      <ToastContainer
        position="top-center"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </IonApp>
  );
};
