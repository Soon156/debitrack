import { DB_NAME } from '@/constants/Modal';
import * as FileSystem from 'expo-file-system';
import { PermissionsAndroid } from 'react-native';
import * as DocumentPicker from 'expo-document-picker';

async function requestStoragePermission() {
    try {
        const granted = await PermissionsAndroid.request(
            PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            {
                title: 'Storage Permission',
                message: 'This app needs access to your storage to export the database',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
            }
        );
        return granted === PermissionsAndroid.RESULTS.GRANTED;
    } catch (err) {
        console.warn(err);
        return false;
    }
}


export async function importDatabase() {
    let filePath = await DocumentPicker.getDocumentAsync();
    console.log(filePath);

    // TODO
}

// Function to export the SQLite database
export async function exportDatabase() {
    try {
        const dbPath = `${FileSystem.documentDirectory}SQLITE/${DB_NAME}`;
        /*Platform.OS === 'ios'
            ? `${FileSystem.documentDirectory}SQLITE/${DB_NAME}`
            : `${RNFS.DocumentDirectoryPath}/${dbName}`;*/

        /*
            Platform.OS === 'ios'
                ? `${RNFS.TemporaryDirectoryPath}/${dbName}`
                : `${RNFS.ExternalDirectoryPath}/${dbName}`;*/
        // Copy database to an accessible location


    } catch (error) {
        console.error('Failed to export database: ', error);
    }
};
