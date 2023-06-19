import axios from "axios";
import generate from "crypto-random-string"

export const LoginResponsePage = () => {
    const urlParams = new URLSearchParams(window.location.search);
    let code = urlParams.get("code");
    if (code !== null) { code = code.toString(); }
    const state = generate({ length: 16 }).toString();
    console.log("Code:", code);
    console.log("Typeof:", typeof code);

    try {
        axios.get("http://localhost:4000/account/login_response?code", {
            params: {
                code: code,
                state: state,
            },
        }).then((res): void => {
          console.log("Res:" , res);
        });
      } catch (error) {
        console.log("Error:", error);
      }
      
    return (
        <div>
            ResponsePage
        </div>
    );
}