import React from "react";
import { Link } from "react-router-dom";

export const MenuButton = ({ label, to, src, css }) => (
    <Link
        className="flex flex-col justify-center w-32 h-32 p-5 font-semibold rounded-lg text-black text-center bg-primaryOrange hover:bg-primaryOrange_light drop-shadow-lg"
        to={to}
    >
        <img className={css} src={src} alt="img" />
        {label}
    </Link>
);

export const GreyPillButtonNew = ({ children, ...rest }) => (
    <button
        {...rest}
        className="flex justify-center w-32 py-4 px-5 font-semibold rounded-full text-white bg-primaryDarkGrey hover:bg-primaryDarkGrey_light drop-shadow-lg"
    >
        {children}
    </button>
);

export const GreyPillButton = ({ label, id, to, onClick }) => (
    <Link
        className="flex justify-center w-32 py-4 px-5 font-semibold rounded-full text-white bg-primaryDarkGrey hover:bg-primaryDarkGrey_light drop-shadow-lg"
        id={id}
        to={to}
        onClick={onClick}
    >
        {label}
    </Link>
);

export const OrangePillButton = ({ label, id, to, onClick }) => (
    <Link
        className="flex justify-center w-32 py-4 px-5 font-semibold rounded-full text-black bg-primaryOrange hover:bg-primaryOrange_light drop-shadow-lg"
        id={id}
        to={to}
        onClick={onClick}
    >
        {label}
    </Link>
);

export const OrangePillButtonNew = ({ children, ...rest }) => (
    <button
        {...rest}
        className="flex justify-center w-32 py-4 px-5 font-semibold rounded-full text-black bg-primaryOrange hover:bg-primaryOrange_light drop-shadow-lg"
    >
        {children}
    </button>
);

export const TextButton = ({ label, id, to, onClick }) => (
    <Link
        className="flex font-semibold text-primaryDarkGrey hover:bg-primaryDarkGrey_light"
        id={id}
        to={to}
        onClick={onClick}
    >
        {label}
    </Link>
);

export const LogoButton = ({ label, to }) => (
    <Link to={to}>
        <img
            className="sm:scale-50"
            src="https://hhhs-frontend.s3.us-east-2.amazonaws.com/images/digitalDentalHubLogo.png"
            alt="logo"
        />
        {label}
    </Link>
);
