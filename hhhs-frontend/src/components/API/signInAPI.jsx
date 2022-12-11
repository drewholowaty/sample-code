import { Auth } from "aws-amplify";

export async function signInAPI(username, password) {
    try {
        const user = await Auth.signIn(username, password);
        console.log(user);
        return true;
    } catch (error) {
        console.log("error signing in", error);
        return false;
    }
}
