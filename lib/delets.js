const { google } = require("googleapis");
const apikeys = require("../apikey.json");

const SCOPE = ["https://www.googleapis.com/auth/drive"];

const print = console.log;
const error = console.error;

const send = (msg) => {
  print(msg);
  return msg;
};

exports.deleteFilesDaily = async (req, res) => {
  try {
    const folderId = "1VOYcYFKQ6LIV_zfeZxa9HrMdnAiryBl2";
    const authClient = await authorize();
    // Replace with the ID of the folder to delete files from
    await deleteFilesInFolder(folderId, authClient);

    return send("Files deleted successfully.");
  } catch (error) {
    console.error("Error deleting files:", error);
    return send("Internal Server Error");
  }
};

const authorize = async () => {
  const jwtClient = new google.auth.JWT(
    apikeys.client_email,
    null,
    apikeys.private_key,
    SCOPE
  );

  await jwtClient.authorize();
  return jwtClient;
};

const deleteFilesInFolder = async (folderId, authClient) => {
  const drive = google.drive({ version: "v3", auth: authClient });

  const response = await drive.files.list({
    q: `'${folderId}' in parents`,
    fields: "files(id)",
  });

  const files = response.data.files;
  for (const file of files) {
    await drive.files.delete({ fileId: file.id });
  }
};
