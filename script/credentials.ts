import { Platform } from "react-native";
import { CredAndroid, CredIOS, CredWeb } from "@/constants/env";
import { GoogleSignin, isErrorWithCode, isSuccessResponse, statusCodes } from "@react-native-google-signin/google-signin";

const googleCredentials = (() => {
    let credentials = '';
    if (Platform.OS === "android") {
        credentials = CredAndroid;
    } else if (Platform.OS === "ios") {
        credentials = CredIOS;
    }
    return credentials;
})();

GoogleSignin.configure({
    webClientId: CredWeb,
    scopes: [
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.install',
        'https://www.googleapis.com/auth/drive.file',
    ],
});

export async function signInWithGoogle() {
    try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        if (isSuccessResponse(response)) {
            console.log(response);
        } else {
            console.log("sign in was cancelled by user");
        }
        const tokens = await GoogleSignin.getTokens(); // Get the access token
        return tokens.accessToken;
    } catch (error) {
        if (isErrorWithCode(error)) {
            switch (error.code) {
                case statusCodes.IN_PROGRESS:
                    console.log("operation (eg. sign in) already in progress");
                    break;
                case statusCodes.PLAY_SERVICES_NOT_AVAILABLE:
                    console.log("Android only, play services not available or outdated");
                    break;
                default:
                    console.log("Error with code:" + error.message);
            }
        } else {
            console.log("Error: " + error);
        }
    }
}
