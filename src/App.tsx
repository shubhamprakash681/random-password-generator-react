import { useCallback, useEffect, useRef, useState } from "react";
import { LuRefreshCw } from "react-icons/lu";

const containsSpecialChars = (str: string): boolean => {
  const specialChars = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]+/;
  return specialChars.test(str);
};

const App = () => {
  const [generatedPassword, setGeneratedPassword] = useState<string>("");
  const [isChangedManualy, setIsChangedManualy] = useState<boolean>(false);
  const [passwordLength, setPasswordLength] = useState<number>(8);
  const [isNumberAllowed, setIsNumberAllowed] = useState<boolean>(false);
  const [isSplCharactersAllowed, setIsSplCharactersAllowed] =
    useState<boolean>(false);

  const generatedPasswordRef = useRef<HTMLInputElement>(null);
  const isNumAllowedCheckboxRef = useRef<HTMLInputElement>(null);
  const isSplCharactersAllowedCheckboxRef = useRef<HTMLInputElement>(null);
  const passwordLengthChangerRef = useRef<HTMLInputElement>(null);

  // TODO: Handle everything on manual Password change
  const handleManualPasswordChange = (e: { target: { value: string } }) => {
    setIsChangedManualy(true);

    const newPswd: string = e.target.value;
    setGeneratedPassword(newPswd);
    setPasswordLength(newPswd.length);

    setIsNumberAllowed(Boolean(newPswd.match(/\d/)));
    setIsSplCharactersAllowed(containsSpecialChars(newPswd));
  };

  const autoGeneratePassword = useCallback(() => {
    let newPswd = "";
    let str = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";

    if (isNumberAllowed) str += "1234567890";
    if (isSplCharactersAllowed) str += "~`!@#$%^&*_-+=[]{}";

    for (let i = 0; i < passwordLength; i += 1) {
      // return Math.floor(Math.random() * (max - min + 1)) + min;
      const randomIndex = Math.floor(Math.random() * str.length);

      newPswd += str[randomIndex];
    }

    setGeneratedPassword(newPswd);
  }, [passwordLength, isNumberAllowed, isSplCharactersAllowed]);

  useEffect(() => {
    const removeIsChangedManully = () => {
      console.log("Removing isChangedManully");

      setIsChangedManualy(false);
    };

    isNumAllowedCheckboxRef.current?.addEventListener(
      "click",
      removeIsChangedManully
    );

    isSplCharactersAllowedCheckboxRef.current?.addEventListener(
      "click",
      removeIsChangedManully
    );
    passwordLengthChangerRef.current?.addEventListener(
      "click",
      removeIsChangedManully
    );

    return () => {
      isNumAllowedCheckboxRef.current?.removeEventListener(
        "click",
        removeIsChangedManully
      );
      isSplCharactersAllowedCheckboxRef.current?.removeEventListener(
        "click",
        removeIsChangedManully
      );
      passwordLengthChangerRef.current?.removeEventListener(
        "click",
        removeIsChangedManully
      );
    };
  }, []);

  useEffect(() => {
    !isChangedManualy && autoGeneratePassword();
  }, [
    passwordLength,
    isNumberAllowed,
    isSplCharactersAllowed,
    isChangedManualy,
  ]);

  const handlePasswordCopy = () => {
    console.log("generatedPasswordRef: ", generatedPasswordRef);
    generatedPasswordRef.current?.select();
    window.navigator.clipboard.writeText(generatedPassword);
  };

  const refreshGeneratedPassword = () => {
    autoGeneratePassword();
  };

  return (
    <>
      {/* {console.log("generatedPassword: ", generatedPassword)} */}
      {/* {console.log("passwordLength: ", passwordLength)} */}
      {/* {console.log("isSplCharactersAllowed: ", isSplCharactersAllowed)} */}
      {/* {console.log("isNumberAllowed: ", isNumberAllowed)} */}
      {/* {console.log("isChangedManualy: ", isChangedManualy)} */}

      <div className="bg-slate-100 app-container">
        {/* Navbar */}
        <div className="upper-container shadow-sm shadow-slate-200">
          <nav className="flex items-center justify-between py-4 px-2 md:px-3 lg:px-4 ">
            <h1 className="text-3xl">Password Generator</h1>
          </nav>
        </div>

        <div className="lower-container">
          {/* Page */}
          <div className="p-3 md:p-7 lg:p-13 page-container">
            <div className="m-auto max-w-fit px-4 py-8 bg-slate-300 rounded-lg">
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-xl">Generate Password</h3>
                <button
                  className="p-1 bg-slate-400 border-slate-500 border-2 "
                  onClick={refreshGeneratedPassword}
                >
                  <LuRefreshCw />
                </button>
              </div>

              <div className="rounded-xl mb-3">
                <input
                  aria-label="password-input"
                  name="password-input"
                  id="password-input"
                  type="search"
                  className="px-4 py-2 w-96 border-none outline-none text-slate-900"
                  value={generatedPassword}
                  onChange={handleManualPasswordChange}
                  ref={generatedPasswordRef}
                />
                <button
                  className="px-4 py-2 bg-slate-700 text-white hover:bg-slate-600"
                  onClick={handlePasswordCopy}
                >
                  Copy
                </button>
              </div>

              <div className="flex items-center space-x-4">
                <span className="space-x-2">
                  <input
                    className="cursor-pointer"
                    type="range"
                    aria-label="password-length"
                    name="password-length"
                    id="password-length"
                    value={passwordLength}
                    min={4}
                    max={40}
                    ref={passwordLengthChangerRef}
                    onChange={(e) => setPasswordLength(Number(e.target.value))}
                  />
                  <span>Length: {passwordLength}</span>
                </span>
                <span>
                  <input
                    type="checkbox"
                    name="isNumberAllowed"
                    aria-label="isNumberAllowed"
                    id="isNumberAllowed"
                    className="cursor-pointer"
                    checked={isNumberAllowed}
                    ref={isNumAllowedCheckboxRef}
                    onChange={(e) => setIsNumberAllowed(e.target.checked)}
                  />{" "}
                  Numbers
                </span>
                <span>
                  <input
                    type="checkbox"
                    name="isSplCharactersAllowed"
                    aria-label="isSplCharactersAllowed"
                    id="isSplCharactersAllowed"
                    className="cursor-pointer"
                    checked={isSplCharactersAllowed}
                    ref={isSplCharactersAllowedCheckboxRef}
                    onChange={(e) =>
                      setIsSplCharactersAllowed(e.target.checked)
                    }
                  />{" "}
                  Characters
                </span>
              </div>
            </div>
          </div>

          {/* Footer */}
          {/* <footer className="bg-slate-500">Footer</footer> */}
        </div>
      </div>
    </>
  );
};

export default App;
