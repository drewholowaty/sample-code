import React from "react";

import { OrangePillButton, LogoButton } from "../../../components/buttons";

function LoginHomeScreen() {
  return (
    <div className="flex flex-col items-center bg-primaryLightGrey h-screen ">
        <div className=" basis-1/3 flex items-center">
          <LogoButton label ="" to="/"></LogoButton>
        </div>
        <div className=" basis-1/3 flex items-center">
          <div className=" flex flex-col gap-14">
            <OrangePillButton label="Login" to="enterCredentials"></OrangePillButton>
            <OrangePillButton label="Sign Up" to="signup"></OrangePillButton>
          </div>
        </div>
    </div>
  );
}

export default LoginHomeScreen;
