import axios from "axios";

export const LoginPage = () => {
  try {
    axios.get("http://localhost:4000/account/login").then((res): void => {
      console.log(res);
    });
  } catch (error) {
    console.log(error);
  }

  return (
    <div>
      <h1>Login Page</h1>
    </div>
  );
};
