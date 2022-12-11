import { Auth } from "aws-amplify";

export async function signUpAPI(username, password, email, firstName, lastName) {
    try {
        const { user } = await Auth.signUp({
            username,
            password,
            attributes: {
                email,
                "custom:firstName": firstName,
                "custom:lastName": lastName,
            },
            autoSignIn: {
                // optional - enables auto sign in after user is confirmed
                enabled: false,
            },
        });
        console.log(user);
        return true;
    } catch (error) {
        console.log("error signing up:", error);
        return false;
    }
}
