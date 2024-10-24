import {
    GoogleSignin,
    isErrorWithCode,
    isNoSavedCredentialFoundResponse,
    isSuccessResponse,
    statusCodes
} from "@react-native-google-signin/google-signin";
import { GDrive, MimeTypes } from "@robinbobin/react-native-google-drive-api-wrapper";
import { dbPath } from "./exportImportDB";
import { DB_NAME } from "@/constants/Modal";
import RNFS from 'react-native-fs';
import * as FileSystem from 'expo-file-system';
import { zip, unzip, unzipAssets, subscribe } from 'react-native-zip-archive'
import { getLastSyncTime, updateSyncTime } from "./RecordDB";

const timeout = 30000;

/*
const googleCredentials = (() => {
    let credentials = '';
    if (Platform.OS === "android") {
        credentials = CredAndroid;
    } else if (Platform.OS === "ios") {
        credentials = CredIOS;
    }
    return credentials;
})();
*/

GoogleSignin.configure({
    webClientId: process.env.EXPO_PUBLIC_CredWeb,
    scopes: [
        'https://www.googleapis.com/auth/drive.appdata',
        'https://www.googleapis.com/auth/drive.install',
        'https://www.googleapis.com/auth/drive.file',
    ],
    offlineAccess: true,
});

export async function signInSilent() {
    try {
        const response = await GoogleSignin.signInSilently();
        if (response.type == "success") {
            console.log("User has been signed in silently");
        } else if (isNoSavedCredentialFoundResponse(response)) {
            console.log("user has not signed in yet")
        }
    } catch (error) {
        console.log(error);
    }
}

export async function signIn() {
    try {
        await GoogleSignin.hasPlayServices();
        const response = await GoogleSignin.signIn();
        if (isSuccessResponse(response)) {
            console.log("User has been signed in: " + JSON.stringify(response.data));
        } else {
            console.log("sign in was cancelled by user");
        }
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

export async function logOut() {
    await GoogleSignin.signOut();
    console.log("User signed out successfully");
}

export async function updateDB() {
    const folderName = 'backupDB';
    const directoryUri = `${FileSystem.cacheDirectory}${folderName}/`;
    const zipFilePath = `${FileSystem.cacheDirectory}${folderName}.zip`;
    const fileName = `${folderName}.zip`;
    const JSONName = 'settings.js';
    const syncTime = (new Date()).toISOString();

    let JSON_Uploader;
    let gdrive;

    // init Gdrive
    try {
        gdrive = new GDrive();
        gdrive.fetchTimeout = timeout;
        gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
        let fileList = await gdrive.files.list();

        // check locking
        let lockFile = fileList.files.find((file: { name: string; }) => file.name === '.lock');
        if (lockFile) {
            console.log("Backup is locked");
            return;
        }

        // create.lock file
        const lockUploader = await gdrive.files.newMultipartUploader()
            .setData('', MimeTypes.JSON)
            .setRequestBody({
                name: '.lock',
                mimeType: 'application/json'
            })
            .execute();

        // get the metadata from the Gdrive
        try {
            let data = { 'lastSync': syncTime };
            let jsonString = JSON.stringify(data);
            JSON_Uploader = gdrive.files.newMultipartUploader()
                .setData(jsonString, MimeTypes.JSON)
                .setRequestBody({
                    name: JSONName,
                    mimeType: 'application/json'
                });

            let settingsFile = fileList.files.find((file: { name: string; }) => file.name === JSONName);

            if (settingsFile) {
                let lastSyncTimeStamp = await getLastSyncTime();
                console.log(lastSyncTimeStamp);
                JSON_Uploader.setIdOfFileToUpdate(settingsFile.id);
                let result = await gdrive.files.getJson(settingsFile.id);
                if (new Date(result.lastSync) > new Date(lastSyncTimeStamp)) {
                    // TODO - Pull db
                    console.log("Getting DB");
                } else {
                    // Upload db
                    console.log("Uploading DB");
                    // overwriteDB(fileName, directoryUri, zipFilePath, gdrive)
                }
            } else {
                // Upload db
                console.log("First-time sync. Uploading DB.");
                // overwriteDB(fileName, directoryUri, zipFilePath, gdrive)
            }

            // Update sync timestamp
            await updateSyncTime(syncTime);
            await JSON_Uploader.execute();
        } catch (err) {
            console.log("Error while updating JSON: " + err);
        } finally {
            await gdrive.files.delete(lockUploader.id);
            return;
        }

    } catch (err) {
        console.log("Error while initializing GDrive: " + err);
        return;
    }
}

async function overwriteDB(fileName: string, directoryUri: string, zipFilePath: string, gdrive: GDrive) {
    // Secure place and clear existing to copies db
    try {
        const folderInfo = await FileSystem.getInfoAsync(directoryUri);
        if (folderInfo.exists) {
            await FileSystem.deleteAsync(directoryUri);
        }
        await FileSystem.makeDirectoryAsync(directoryUri, { intermediates: true });
        const fileInfo = await FileSystem.getInfoAsync(zipFilePath);
        if (fileInfo.exists) {
            await FileSystem.deleteAsync(zipFilePath);
        }
    } catch (error) {
        console.log("Error while creating folder: " + error);
        return;
    }


    // make a copy of db to folders
    try {
        await FileSystem.copyAsync({ from: dbPath, to: directoryUri });
        // compress folder
        zip(directoryUri, zipFilePath)
            .then((path) => {
                console.log(`zip completed at ${path}`);
            })
    } catch (err) {
        console.log("Error while prepare file: " + err);
        return;
    }

    // get files and upload new one to GDrive
    try {
        let fileToUpload = await FileSystem.readAsStringAsync(zipFilePath, { encoding: FileSystem.EncodingType.Base64 })

        // upload new file
        const uploader = gdrive.files.newMultipartUploader()
            .setData(fileToUpload, MimeTypes.BINARY)
            .setRequestBody({
                name: fileName,
                mimeType: 'application/zip'
            })
            .setIsBase64(true);

        let fileList = await gdrive.files.list();
        console.log(fileList.files);

        for (let file of fileList.files) {
            if (file.name === fileName) {
                uploader.setIdOfFileToUpdate(file.id);
            }
        };
        console.log((await uploader.execute()).id);
    } catch (err) {
        console.log("Error while upload file: " + err)
        return;
    }
}

export async function resetDrive() {
    let gdrive = new GDrive();
    gdrive.fetchTimeout = timeout;
    gdrive.accessToken = (await GoogleSignin.getTokens()).accessToken;
    let fileList = await gdrive.files.list();
    for (let file of fileList.files) {
        gdrive.files.delete(file.id);
    }

    console.log("Drive reset completed");
}