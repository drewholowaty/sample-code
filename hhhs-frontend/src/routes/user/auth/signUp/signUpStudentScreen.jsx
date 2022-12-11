import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import { OrangePillButtonNew, TextButton } from "../../../../components/buttons";
import { SingleLineTextInput } from "../../../../components/input";
import { GreyText } from "../../../../components/text";
import { putUserDataAPI } from "../../../../components/API/putUserDataAPI";

function SignUpStudentScreen(props) {
    const [requiredPhoneNumber, setRequiredPhoneNumber] = useState(true);
    const [requiredCountry, setRequiredCountry] = useState(true);
    const [requiredSchoolName, setRequiredSchoolName] = useState(true);
    const [requiredGraduationDate, setRequiredGraduationDate] = useState(true);
    const navigate = useNavigate();

    const handleClick = async () => {
        let canAdvance = true;
        if (props.form.phoneNumber === "") {
            setRequiredPhoneNumber(false);
            canAdvance = false;
        } else {
            setRequiredPhoneNumber(true);
        }

        if (props.form.country === "") {
            setRequiredCountry(false);
            canAdvance = false;
        } else {
            setRequiredCountry(true);
        }

        if (props.form.schoolName === "") {
            setRequiredSchoolName(false);
            canAdvance = false;
        } else {
            setRequiredSchoolName(true);
        }

        if (props.form.graduationDate === "") {
            setRequiredGraduationDate(false);
            canAdvance = false;
        } else {
            setRequiredGraduationDate(true);
        }

        if (canAdvance) {
            putUserDataAPI(props.form);
            navigate("/");
        }
    };

    return (
        <div className="flex flex-col items-center bg-primaryLightGrey h-screen ">
            <div className=" basis-1/12 flex items-end w-11/12 sm:w-1/2">
                <TextButton label="Back" to="/login/signup" onClick={props.prevStep} />
            </div>

            <div className=" basis-11/12 flex flex-col items-center overflow-y-auto">
                <div className="w-9/12 flex items-center mt-10 mb-10">
                    <GreyText label="Sign up to connect with other dentists!" />
                </div>

                <div className="flex flex-col space-y-10 ">
                    <SingleLineTextInput
                        id="phoneNumber"
                        type="text"
                        placeholder="phone number"
                        value={props.form.phoneNumber}
                        onChange={props.handleChange}
                        valid={true}
                        required={requiredPhoneNumber}
                    />
                    <SingleLineTextInput
                        id="country"
                        type="text"
                        placeholder="country"
                        value={props.form.country}
                        onChange={props.handleChange}
                        valid={true}
                        required={requiredCountry}
                    />
                    <SingleLineTextInput
                        id="schoolName"
                        type="text"
                        placeholder="school name"
                        value={props.form.schoolName}
                        onChange={props.handleChange}
                        valid={true}
                        required={requiredSchoolName}
                    />
                    <SingleLineTextInput
                        id="graduationDate"
                        type="text"
                        placeholder="expected graduation date"
                        value={props.form.graduationDate}
                        onChange={props.handleChange}
                        valid={true}
                        required={requiredGraduationDate}
                    />
                </div>

                <div className=" mt-10 mb-10">
                    <OrangePillButtonNew onClick={handleClick}>
                        Sign Up!
                    </OrangePillButtonNew>
                </div>
            </div>
        </div>
    );
}

export default SignUpStudentScreen;
