import { Storage } from '@google-cloud/storage';
import path from 'path';
import { InternalServerRest } from '../lib/errorHandle';
import { MulterFile, MulterFiles, UploadResponse } from '../types/index';
import { generateFileName } from './generateFileName';

import _keyFile from '../weighty-droplet-357309-d67e3ea0b5f4.json';

console.log(path.join(__dirname, '../weighty-droplet-357309-d67e3ea0b5f4.json' as string));

const storage = new Storage({
  keyFilename: path.join(__dirname, '../weighty-droplet-357309-d67e3ea0b5f4.json' as string),
  projectId: process.env.PROJECT_ID_STORAGE,
});

const bucket = storage.bucket(process.env.NAME_STORAGE as string);

export const uploadSingleStore = (file: MulterFile): UploadResponse => {
  const { fileName, type } = generateFileName(file.originalname);

  const blob = bucket.file(fileName);
  const blobStream = blob.createWriteStream();

  blobStream.on('error', (err) => {
    throw new InternalServerRest(err.message + err.name);
  });

  blobStream.end(file.buffer);

  return {
    url: `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
    type,
    fileName,
  };
};

export const uploadMultipleStore = (files: MulterFiles) => {
  const uploads = files.map((file) => {
    const { fileName, type } = generateFileName(file.originalname);
    const blob = bucket.file(fileName);
    const blobStream = blob.createWriteStream();

    blobStream.on('error', (err) => {
      throw new InternalServerRest(err.message + err.name);
    });

    blobStream.end(file.buffer);

    return {
      url: `https://storage.googleapis.com/${bucket.name}/${blob.name}`,
      type,
      fileName,
    };
  });

  return uploads;
};
