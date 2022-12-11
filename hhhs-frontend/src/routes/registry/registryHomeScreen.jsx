import React, { useState, useEffect } from "react";
import { API, Auth } from "aws-amplify";
import { SearchInput } from "../../components/input";
import { TextButton } from "../../components/buttons";

function RegistryHomeScreen() {
    const [profileData, setprofileData] = useState([]);
    const [error, setError] = useState(null);
    const [isLoaded, setIsLoaded] = useState(false);
    async function getData() {
        const apiName = "api994a52bc";
        const path = "/users";
        const myInit = {
            // OPTIONAL
            headers: {}, // OPTIONAL
        };
        return API.get(apiName, path, myInit);
    }

    useEffect(() => {
        console.log("hello");
        getData().then(
            (result) => {
                setprofileData(result);
                console.log(result);
            },
            // Note: it's important to handle errors here
            // instead of a catch() block so that we don't swallow
            // exceptions from actual bugs in components.
            (error) => {
                setIsLoaded(true);
                setError(error);
            }
        );
    }, []);

    // (async function () {
    //     const response = await getData();
    //     console.log(response);
    //     setprofileData(response);
    // })();
    const [q, setQ] = useState("");
    const [searchTerm] = useState(["email", "firstName", "lastName"]);

    function search(items) {
        return items.filter((item) => {
            return searchTerm.some((newItem) => {
                return (
                    item[newItem].toString().toLowerCase().indexOf(q.toLowerCase()) > -1
                );
            });
        });
    }

    return (
        <div className="flex flex-col items-center bg-primaryLightGrey h-screen ">
            <div className=" basis-1/12 flex items-end w-11/12 sm:w-1/2">
                <TextButton label="Back" to="/" />
            </div>
            <div className=" basis-11/12 flex flex-col overflow-y-auto w-screen sm:w-1/4 pt-5 mb-4">
                <div className=" flex justify-center mb-2">
                    <SearchInput
                        id="search"
                        type="text"
                        placeholder="Search Dentists"
                        value={q}
                        onChange={(e) => setQ(e.target.value)}
                    />
                </div>

                {search(profileData).map((val, key) => {
                    return (
                        <div
                            className="flex flex-col m-1 border-b-2 border-x-borderGrey w-10/12 self-center"
                            key={key}
                        >
                            <p className="font-semibold mt-1 mb-1">
                                {val.firstName} {val.lastName}
                            </p>
                            <p className="mb-1 font-light">{val.email}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

export default RegistryHomeScreen;
