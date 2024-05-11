import { google } from "googleapis";
const SCOPE = ["https://www.googleapis.com/auth/drive"];
const print = console.log;
const error = console.error;
export const deleteFilesDaily = async () => {
    try {
        const folderId = "1VOYcYFKQ6LIV_zfeZxa9HrMdnAiryBl2";
        const authClient = await authorize();
        // Replace with the ID of the folder to delete files from
        await deleteFilesInFolder(folderId, authClient);
        return "Files deleted successfully.";
    }
    catch (error) {
        console.error("Error deleting files:", error);
        return "Internal Server Error";
    }
};
const authorize = async () => {
    const jwtClient = new google.auth.JWT(process.env.client_email, null || '', process.env.private_key, SCOPE);
    await jwtClient.authorize();
    return jwtClient;
};
const deleteFilesInFolder = async (folderId, authClient) => {
    const drive = google.drive({ version: "v3", auth: authClient });
    const response = await drive.files.list({
        q: `'${folderId}' in parents`,
        fields: "files(id)",
    });
    const files = response?.data?.files;
    if (!files)
        return console.log('no files founded');
    for (const file of files) {
        await drive.files.delete({ fileId: file.id || '' });
    }
};
//# sourceMappingURL=delets.js.map