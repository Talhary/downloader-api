import fs from "fs";
import { google , drive_v3 }  from "googleapis";

const SCOPE = ["https://www.googleapis.com/auth/drive"];
import * as dotevn from "dotenv"
dotevn.config()

interface CreateFileParams {
  resource: Partial<drive_v3.Schema$File>;
  media: {
    body: any; // Adjust the type according to your needs
    mimeType: string;
  };
  fields?: string;
}

interface File {
  id?: string;
  name?: string;
  mimeType?: string;
  size?: string;
  createdTime?: string;
  modifiedTime?: string;
  webViewLink?: string;
  webContentLink?: string;
  message?:string
  // Add other properties as needed
}

async function uploadFile(path: string, mimeType: string): Promise<{data:File}> {
  return new Promise((resolve, reject) => {
    const jwtClient = new google.auth.JWT(
      process.env.client_email,
      null || '',
      process.env.private_key,
      SCOPE
    );

    jwtClient.authorize(async (authError) => {
      if (authError) {
        reject(authError);
      } else {
        const authClient = jwtClient;
        const drive = google.drive({ version: "v3", auth: authClient });

        const fileMetaData: Partial<drive_v3.Schema$File> = {
          name: path.split("/").join("-").split(".").join("").slice(0, -3),
          parents: ["1VOYcYFKQ6LIV_zfeZxa9HrMdnAiryBl2"], // A folder ID to which file will get uploaded
        };

        const createParams: CreateFileParams = {
          resource: fileMetaData,
          media: {
            body: fs.createReadStream(path), // files that will get uploaded
            mimeType: mimeType,
          },
          fields:
            "id, name, mimeType, size, createdTime, modifiedTime,webViewLink, webContentLink",
        };

        drive.files.create(createParams, (err:null| undefined | object, res:null| undefined | {data:object}) => {
          if (err) {
            reject(err);
          } else {
            if(!res?.data)return reject({data:{message:'Not found anything'}} as File)
            resolve({data:res?.data as File});
          }
        });
      }
    });
  });
}
async function getFileInfo(fileId:string) {
  return new Promise((resolve, reject) => {
    const jwtClient = new google.auth.JWT(
      process.env.client_email,
      null || '',
      process.env.private_key,
      SCOPE
    );

    jwtClient.authorize(async (authError) => {
      if (authError) {
        reject(authError);
      } else {
        const authClient = jwtClient;
        const drive = google.drive({ version: "v3", auth: authClient });

        drive.files.get(
          {
            fileId: fileId,
            fields:
              "id, name, mimeType, size, createdTime, modifiedTime,webViewLink, webContentLink",
          },
          (err, res) => {
            if (err) reject(err);
            resolve(res);
          }
        );
      }
    });
  });
}

const folderId = "1VOYcYFKQ6LIV_zfeZxa9HrMdnAiryBl2";
type FileType = {
  id: string;
  name: string;
  mimeType: string;
  size: string;
  createdTime: string;
  modifiedTime: string;
  webViewLink: string;
  webContentLink: string;
};

async function getFilesWithInfo(folderId: string): Promise<FileType[]> {
  return new Promise((resolve, reject) => {
    const jwtClient = new google.auth.JWT(
      process.env.client_email,
      null || '',
      process.env.private_key,
      SCOPE
    );

    jwtClient.authorize(async (authError) => {
      if (authError) {
        reject(authError);
      } else {
        const authClient = jwtClient;
        const drive = google.drive({ version: "v3", auth: authClient });

        // Function to get information about a file from Google Drive
        const getFileInfo = async (fileId: string): Promise<FileType> => {
          const response = await drive.files.get({
            fileId: fileId,
            fields:
              "id, name, mimeType, size, createdTime, modifiedTime, webViewLink, webContentLink",
          });
          return response.data as FileType;
        };

        // Function to get all files from a specific folder in Google Drive
        const getAllFiles = async (folderId: string): Promise<FileType[]> => {
          const response = await drive.files.list({
            q: `'${folderId}' in parents`,
            fields: "files(id)",
          });
          if (!response?.data?.files) return [];
          return response.data.files.map((file: any) => ({ id: file.id })) as FileType[];
        };

        try {
          const files = await getAllFiles(folderId);
          if (files.length === 0) {
            resolve([]); // If no files found, resolve with an empty array
            return;
          }

          const filesWithInfo: FileType[] = [];
          for (const file of files) {
            const fileInfo = await getFileInfo(file.id);
            filesWithInfo.push(fileInfo);
          }

          resolve(filesWithInfo);
        } catch (error) {
          reject(error);
        }
      }
    });
  });
}
const getFile = async (id:string) => {
  try {
    const files :any = await getFilesWithInfo(folderId);
    if (!files?.[0]) getFile(id);
    return files.filter((el:{id:string}) => el.id === id);
  } catch (error) {
    return error;
  }
};
export const UploadAndGetDownLoadLink = async (path:string, mimeType:string) => {
  const { data } = await uploadFile(path, mimeType);

  return data;
};

// UploadAndGetDownLoadLink("text.txt", "text/plain").then((res) =>
//   console.log(res)
// );
// deleteFilesDaily();
// fetch(
//   "https://drive.google.com/uc?id=1hh0SLI2kQQvc47rmgPF9Yq5uJz8ugOtA&export=download",
//   { method: "GET" }
// ).then(async (res) => {
//   fs.writeFileSync("./text1.txt", Buffer.from(await res.arrayBuffer()));
// });
