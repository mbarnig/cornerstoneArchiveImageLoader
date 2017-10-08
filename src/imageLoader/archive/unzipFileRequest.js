import $ from 'jquery';
import parseImageId from './parseImageId.js';
import { returnObject } from './archiveLoader.js';

function unzipFileRequest (uri) {
  const zip = returnObject();
  // create a deferred object
  const deferred = $.Deferred();
  // asynchronous archiveLoader
  const parsedImageId = parseImageId(uri);
  const path = parsedImageId.url;
  const folderAndFile = path.split('\\');
  const fileIndex = folderAndFile.length - 1;
  let folder = '';
  const file = folderAndFile[fileIndex];

  for (let i = 0; i < fileIndex; i++) {
    folder += `${folderAndFile[i]}/`;
  } // end for i
  zip.file(folder + file).async('uint8array').then(function (dicomPart10AsArrayBuffer) {
    deferred.resolve(dicomPart10AsArrayBuffer);
  }).catch(function (err) {
    console.log(`Unzipping Error : ${err}`);
    deferred.reject(`Unzipping Error : ${err}`);
  }); // end catch async

  return deferred.promise();
}

export default unzipFileRequest;
