import React from "react";
import { Amplify } from "aws-amplify";
import "./input.css";
import {
    MenuButton,
    GreyPillButtonNew,
    GreyPillButton,
    LogoButton,
} from "./components/buttons";
import { signOutAPI } from "./components/API/signoutAPI";
import awsconfig from "./aws-exports";
import { Auth } from "aws-amplify";
import { useNavigate } from "react-router-dom";
Amplify.configure(awsconfig);

function App() {
    const navigate = useNavigate();

    const handleClick = async () => {
        await signOutAPI();
        navigate("/");
    };

    let button;
    if (Auth.user !== null) {
        button = <GreyPillButtonNew onClick={handleClick}>Logout</GreyPillButtonNew>;
    } else {
        button = <GreyPillButton label="Login" to="login"></GreyPillButton>;
    }

    return (
        <div className=" bg-primaryLightGrey">
            {/* adjust for different screen sizes later */}
            <div className="flex flex-col items-center h-screen ">
                <div className="flex justify-center items-center mt-6 sm:h-32 sm:mt-0">
                    <LogoButton label="" to="/" />
                </div>
                <div className=" flex flex-row gap-8 mb-8 mt-4 sm:mt-0">
                    <MenuButton
                        label="Education"
                        to="education"
                        src="https://hhhs-frontend.s3.us-east-2.amazonaws.com/images/youtube.png"
                        css="scale-90"
                    ></MenuButton>
                    <MenuButton
                        label="Events"
                        to="events"
                        src="https://hhhs-frontend.s3.us-east-2.amazonaws.com/images/plan.png"
                        css=" scale-90"
                    ></MenuButton>
                </div>
                <div className=" flex flex-row gap-8 mb-8">
                    <MenuButton
                        label="Registry"
                        to="registry"
                        src="https://hhhs-frontend.s3.us-east-2.amazonaws.com/images/contact-book.png"
                        css=" scale-90"
                    ></MenuButton>
                    <MenuButton
                        label="Community"
                        to="community"
                        src="https://hhhs-frontend.s3.us-east-2.amazonaws.com/images/conversation.png"
                        css=" scale-90"
                    ></MenuButton>
                </div>
                <div className=" flex flex-row gap-8 mb-5 sm:mb-8">
                    <MenuButton
                        label="Courses"
                        to="courses"
                        src="https://hhhs-frontend.s3.us-east-2.amazonaws.com/images/mortarboard.png"
                        css=" "
                    ></MenuButton>
                    <MenuButton
                        label="Shop"
                        to="shop"
                        src="https://hhhs-frontend.s3.us-east-2.amazonaws.com/images/shopping-cart.png"
                        css=" scale-90"
                    ></MenuButton>
                </div>
                <div className="flex justify-end w-full pr-8 sm:w-1/4">{button}</div>
            </div>
        </div>
    );
}

export default App;
