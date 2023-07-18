import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HOME, LOGIN, GENERATEEVENTQR, JOINEVENTBYQR } from "./constants";
import { HomePage } from "./pages";
import "./globalCSS.css";
import { IonApp, setupIonicReact } from "@ionic/react";
import "@ionic/react/css/core.css";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import { JoinEventByQr } from "./pages/JoinEventByQr";
import { GenerateEventQr } from "./pages/GenerateEventQr";

setupIonicReact();

export const App = () => {
  return (
    <IonApp>
      <BrowserRouter>
        <Routes>
          <Route path={HOME} element={<HomePage />}></Route>
          <Route path={JOINEVENTBYQR} element={<JoinEventByQr />}></Route>
          <Route path={GENERATEEVENTQR} element={<GenerateEventQr />}></Route>
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
