import { S3Client, PutObjectCommand, DeleteObjectCommand } from "@aws-sdk/client-s3";
import { v4 as uuidv4 } from "uuid";
import fs from 'fs'

const s3Client = new S3Client({
  endpoint: "https://s3.tebi.io",
  credentials: {
    accessKeyId: "wRc04Y5sYocX6Aec",
    secretAccessKey: "93L4ucUETrFEyo9laZtPsvNCjttYAcCsIRxvmHcc",
  },
  region: "global",
});

// Upload file function
export const uploadFile = async (file, bucketName) => {
 
  if (!file) return null;
  console.log(file)
  const fileName = `${uuidv4()}.${file.originalname.split(".").pop()}`;
  const fileBuffer = file.buffer || await fs.createReadStream(file.path);
  try {
    await s3Client.send(
      new PutObjectCommand({
        Bucket: bucketName,
        Key: fileName,
        Body: fileBuffer,
        ContentType: file.mimetype,
      })
    );

    return `https://s3.tebi.io/${bucketName}/${fileName}`;
  } catch (error) {
    console.error("Upload failed:", error);
    return null;
  }
};

// Delete file function
export const deleteFile = async (fileUrl, bucketName) => {
  if (!fileUrl) return null;

  const fileKey = new URL(fileUrl).pathname.substring(1);

  try {
    await s3Client.send(
      new DeleteObjectCommand({
        Bucket: bucketName,
        Key: fileKey,
      })
    );

    console.log(`Deleted: ${fileKey}`);
    return `Deleted from ${bucketName}: ${fileKey}`;
  } catch (error) {
    console.error("Delete failed:", error);
    return null;
  }
};
