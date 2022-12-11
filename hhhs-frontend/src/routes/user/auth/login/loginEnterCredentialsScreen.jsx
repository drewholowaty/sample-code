import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { LogoButton, OrangePillButtonNew } from "../../../../components/buttons";
import { SingleLineTextInput } from "../../../../components/input";
import { signInAPI } from "../../../../components/API/signInAPI";

function LoginEnterCredentialsScreen() {
    const [form, setForm] = useState({
        userID: "",
        password: "",
    });

    const [valid, setValid] = useState(true);
    const [requiredUserID, setRequiredUserID] = useState(true);
    const [requiredPassword, setRequiredPassword] = useState(true);

    const navigate = useNavigate();

    const handleClick = async () => {
        let canAdvance = true;
        // checks if fields are filled
        if (form.userID === "") {
            setRequiredUserID(false);
            canAdvance = false;
        } else {
            await setRequiredUserID(true);
        }

        if (form.password === "") {
            setRequiredPassword(false);
            canAdvance = false;
        } else {
            await setRequiredPassword(true);
        }

        // if forms fields are not empty, check if valid with backend
        let isAuth = await signInAPI(form.userID, form.password);

        if (isAuth && canAdvance) {
            navigate("/");
        } else {
            setValid(false);
        }
    };

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.value,
        });
    };
    return (
        <div className="flex flex-col items-center bg-primaryLightGrey h-screen ">
            <div className=" basis-1/3 flex items-center">
                <LogoButton label="" to="/" />
            </div>
            <div className=" basis-1/3 flex items-center">
                <div className=" flex flex-col gap-14">
                    <SingleLineTextInput
                        id="userID"
                        type="text"
                        placeholder="username"
                        value={form.userID}
                        onChange={handleChange}
                        valid={valid}
                        required={requiredUserID}
                    />
                    <SingleLineTextInput
                        id="password"
                        type="password"
                        placeholder="password"
                        value={form.password}
                        onChange={handleChange}
                        valid={valid}
                        required={requiredPassword}
                    />
                </div>
            </div>
            <div className=" basis-1/3 flex items-center">
                <OrangePillButtonNew onClick={handleClick}>Login</OrangePillButtonNew>
            </div>
        </div>
    );
}

export default LoginEnterCredentialsScreen;
