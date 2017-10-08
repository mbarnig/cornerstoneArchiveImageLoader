import { getImagePixelModule,
         getLUTs,
         getModalityLUTOutputPixelRepresentation,
         getNumberValues,
         metaDataProvider } from './metaData/index.js';

import dataSetCacheManager from './dataSetCacheManager.js';
import getEncapsulatedImageFrame from './getEncapsulatedImageFrame.js';
import getUncompressedImageFrame from './getUncompressedImageFrame.js';
import { archiveLoader, returnObject } from './archiveLoader.js';
import unzipFileRequest from './unzipFileRequest.js';
import { loadImageFromPromise,
         getLoaderForScheme,
         loadImage } from './loadImage.js';
import parseImageId from './parseImageId.js';
import unpackBinaryFrame from './unpackBinaryFrame.js';
import processDICOMDIR from './processDICOMDIR.js';
import dumpDICOMDIR from './dumpDICOMDIR.js';
import JSZip from 'jszip';

const metaData = {
  getImagePixelModule,
  getLUTs,
  getModalityLUTOutputPixelRepresentation,
  getNumberValues,
  metaDataProvider
};

export default {
  metaData,
  dataSetCacheManager,
  getEncapsulatedImageFrame,
  getUncompressedImageFrame,
  archiveLoader,
  returnObject,
  unzipFileRequest,
  loadImageFromPromise,
  getLoaderForScheme,
  loadImage,
  parseImageId,
  unpackBinaryFrame,
  processDICOMDIR,
  dumpDICOMDIR,
  JSZip
};


