import Header from "@/components/home-page/header";
import {
  BEYZON_PASSWORD,
  BEYZON_USERNAME,
  CITYBEACH_PASSWORD,
  CITYBEACH_USERNAME,
  IS_DEV,
} from "@/config";
import { PATHS } from "@/paths";
import { setUserSession } from "@/utils/session";
import { startTransition, useState } from "react";
import { useNavigate } from "react-router-dom";

type AuthCredentials = {
  username: string;
  password: string;
};

const useLogin = () => {
  const [credentials, setCredentials] = useState<AuthCredentials>({
    username: IS_DEV ? "bayezon_admin" : "",
    password: IS_DEV ? "ivybhe7-kogdyw-vyRzoc" : "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCredentials({ ...credentials, [name]: value });
  };

  const navigate = useNavigate();
  const handleLoginSuccess = () => {
    const token = `authenticated=true;expiresIn:1m`;
    setUserSession(token);
    startTransition(() => {
      navigate(PATHS.root);
    });
  };

  return { credentials, handleChange, handleLoginSuccess };
};

const Login = () => {
  const { credentials, handleLoginSuccess, handleChange } = useLogin();
  return (
    <>
      <Header />
      <div className="w-full h-[85vh] flex items-center justify-center flex-col">
        <div className="rounded-md shadow-md p-4 w-[30%]  max-lg:w-[50%] max-sm:w-[90%] max-md:w-[60%]">
          <h3 className="text-lg font-bold text-center mb-5">
            Login to continue
          </h3>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              const { username, password } = credentials;

              const isBayzon = username === BEYZON_USERNAME;
              const isCityBeach = username === CITYBEACH_USERNAME;
              if (isBayzon) {
                if (password === BEYZON_PASSWORD) {
                  handleLoginSuccess();
                  return;
                }
              }

              if (isCityBeach) {
                if (password === CITYBEACH_PASSWORD) {
                  handleLoginSuccess();
                  return;
                }
              }

              alert("permission denied");
            }}
            className="flex flex-col gap-3 p-2"
          >
            <input
              name="username"
              type="text"
              id="username"
              value={credentials.username}
              onChange={handleChange}
              placeholder="username"
              className="p-2 border-[#0A2F87]  border-2 rounded-md outline-none"
            />
            <input
              name="password"
              type="password"
              id="password"
              placeholder="password"
              value={credentials.password}
              onChange={handleChange}
              className="p-2 border-[#0A2F87] border-2 rounded-md outline-none"
            />
            <button className="capitalize bg-[#0A2F87] brightness-[90%] hover:brightness-[100%] p-2 rounded-md text-white font-bold">
              login
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default Login;
