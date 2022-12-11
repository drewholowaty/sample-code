import React, { useState } from "react";
import SignUpStudentOrDentistScreen from "./signUpStudentOrDentistScreen";
import SignUpGeneralPersonalInfoScreen from "./signUpGeneralPersonalInfoScreen";
import SignUpDentistScreen from "./signUpDentistScreen";
import SignUpStudentScreen from "./signUpStudentScreen";

function MultiStepForm() {
    const [form, setForm] = useState({
        step: 1,
        accountType: "",
        firstName: "",
        lastName: "",
        userID: "",
        password: "",
        email: "",
        phoneNumber: "",
        country: "",
        schoolName: "",
        graduationDate: "",
        practiceName: "",
        practiceAddress: "",
        dentalLicenseNumber: "",
        yearsOfExperience: "",
    });

    const handleChange = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.value,
        });
    };

    const handleChangeButton = (event) => {
        setForm({
            ...form,
            [event.target.id]: event.target.textContent,
            step: form.step + 1,
        });
    };

    const nextStep = () => {
        setForm({
            ...form,
            step: form.step + 1,
        });
    };

    const prevStep = () => {
        setForm({
            ...form,
            step: form.step - 1,
        });
    };

    switch (form.step) {
        case 1:
            return (
                <SignUpStudentOrDentistScreen
                    handleChange={handleChangeButton}
                />
            );
        case 2:
            return (
                <SignUpGeneralPersonalInfoScreen
                    handleChange={handleChange}
                    nextStep={nextStep}
                    prevStep={prevStep}
                    form={form}
                />
            );
        case 3:
            if (form.accountType === "Dentist") {
                return (
                    <SignUpDentistScreen
                        handleChange={handleChange}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        form={form}
                    />
                );
            } else {
                return (
                    <SignUpStudentScreen
                        handleChange={handleChange}
                        nextStep={nextStep}
                        prevStep={prevStep}
                        form={form}
                    />
                );
            }
        default:
        // do nothing
    }
}

export default MultiStepForm;
