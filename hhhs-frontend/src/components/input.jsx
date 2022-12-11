import React from "react";
import classNames from "classnames";

export const SingleLineTextInput = ({
    id,
    type,
    placeholder,
    onChange,
    value,
    valid,
    required,
}) => {
    return (
        <input
            className={classNames(
                required && valid
                    ? "px-3 py-2 w-72 bg-white border shadow-sm border-white focus:outline-none focus:border-primaryDarkGrey focus:ring-primaryDarkGrey rounded-lg sm:text-sm focus:ring-1"
                    : "px-3 py-2 w-72 bg-white border shadow-sm border-red-600 focus:outline-none focus:border-red-600 focus:ring-red-600 rounded-lg sm:text-sm focus:ring-1"
            )}
            id={id}
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
        ></input>
    );
};

export const SearchInput = ({ ...rest }) => {
    return (
        <input
            {...rest}
            className="px-3 py-2 w-10/12 bg-white border shadow-sm border-white focus:outline-none focus:border-primaryDarkGrey focus:ring-primaryDarkGrey rounded-full sm:text-sm focus:ring-1"
        />
    );
};
