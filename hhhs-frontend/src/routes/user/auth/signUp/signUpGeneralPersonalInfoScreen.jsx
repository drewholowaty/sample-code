import React, { useState } from "react";

import { TextButton, OrangePillButtonNew } from "../../../../components/buttons";
import { SingleLineTextInput } from "../../../../components/input";
import { GreyText } from "../../../../components/text";
import { signUpAPI } from "../../../../components/API/signUpAPI";

function SignUpGeneralPersonalInfoScreen(props) {
    const [valid, setValid] = useState(true);
    const [requiredFirstName, setRequiredFirstName] = useState(true);
    const [requiredLastName, setRequiredLastName] = useState(true);
    const [requiredUserID, setRequiredUserID] = useState(true);
    const [requiredEmail, setRequiredEmail] = useState(true);
    const [requiredPassword, setRequiredPassword] = useState(true);

    const handleClick = async () => {
        let canAdvance = true;
        // checks if fields are filled, we can also check via regex in the future for input to match desired
        // format
        if (props.form.firstName === "") {
            setRequiredFirstName(false);
            canAdvance = false;
        } else {
            setRequiredFirstName(true);
        }

        if (props.form.lastName === "") {
            setRequiredLastName(false);
            canAdvance = false;
        } else {
            setRequiredLastName(true);
        }

        if (props.form.userID === "") {
            setRequiredUserID(false);
            canAdvance = false;
        } else {
            setRequiredUserID(true);
        }

        if (props.form.email === "") {
            setRequiredEmail(false);
            canAdvance = false;
        } else {
            setRequiredEmail(true);
        }

        if (props.form.password === "") {
            setRequiredPassword(false);
            canAdvance = false;
        } else {
            setRequiredPassword(true);
        }

        // if forms fields are not empty, check if valid with backend
        let isAuth = await signUpAPI(
            props.form.userID,
            props.form.password,
            props.form.email,
            props.form.firstName,
            props.form.lastName
        );

        if (isAuth && canAdvance) {
            props.nextStep();
        } else {
            setValid(false);
        }
    };
    // const handeClick = () => {
    //     signUpAPI(props.form.userID, props.form.password, props.form.email);
    //     props.nextStep();
    // };
    return (
        <div className="flex flex-col items-center bg-primaryLightGrey h-screen ">
            <div className=" basis-1/12 flex items-end w-11/12 sm:w-1/2">
                <TextButton label="Back" to="/login/signup" onClick={props.prevStep} />
            </div>

            <div className=" basis-11/12 flex flex-col items-center overflow-y-auto">
                <div className="w-9/12 flex items-center mt-10 mb-10">
                    <GreyText label="Sign up to connect with other dentists!" />
                </div>

                <div className="flex flex-col space-y-8">
                    <SingleLineTextInput
                        id="firstName"
                        type="text"
                        placeholder="first name"
                        value={props.form.firstName}
                        onChange={props.handleChange}
                        valid={true}
                        required={requiredFirstName}
                    />
                    <SingleLineTextInput
                        id="lastName"
                        type="text"
                        placeholder="last name"
                        value={props.form.lastName}
                        onChange={props.handleChange}
                        valid={true}
                        required={requiredLastName}
                    />
                    <SingleLineTextInput
                        id="userID"
                        type="text"
                        placeholder="username"
                        value={props.form.userID}
                        onChange={props.handleChange}
                        valid={valid}
                        required={requiredUserID}
                    />
                    <SingleLineTextInput
                        id="email"
                        type="email"
                        placeholder="email"
                        value={props.form.email}
                        onChange={props.handleChange}
                        valid={true}
                        required={requiredEmail}
                    />
                    <SingleLineTextInput
                        id="password"
                        type="password"
                        placeholder="password"
                        value={props.form.password}
                        onChange={props.handleChange}
                        valid={valid}
                        required={requiredPassword}
                    />
                </div>
                <div className=" mb-10">
                    <OrangePillButtonNew onClick={handleClick}>Next</OrangePillButtonNew>
                </div>
            </div>
        </div>
    );
}

export default SignUpGeneralPersonalInfoScreen;
