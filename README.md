# cornerstoneArchiveImageLoader
Fork of Chris Hafey's [cornerstoneWADOImageLoader](https://github.com/chafey/cornerstoneWADOImageLoader) to load DICOM images from zipped DICOMDIR archives.

### Introduction
For the RadioLogic project started two years ago, I used up to now Chris Hafey's [cornerstoneWADOImageLoader](https://github.com/chafey/cornerstoneWADOImageLoader) to load DICOM studies as clinical cases from an AWS S3 bucket with a JSON file, listing the related DICOM files, or from an [Orthanc server](https://www.orthanc-server.com/) hosted on a [MacBook](http://www.web3.lu/orthancmac-os-x-el-capitan/), a [Synology NAS](https://www.synology.com/en-us/dsm/packages/Orthanc) and a [Raspberry PI](http://www.web3.lu/orthanc-raspberry-pi/) (OrthancPi).

RadioLogic is a teaching and assessment tool for radiologists, work in progress. It's a webapp optimized for use on iPAD's.

To improve the handling of the clinical cases and to facilitate the use of the iPAD's in environments without WiFi or cellular phone access, I decided to add the possibility to load the clinical cases from zipped archives.

New HTML5 technologies like [indexedDB](https://en.wikipedia.org/wiki/Indexed_Database_API) make it possible to store large files locally in the browser. Today indexedDB is supported by all major browsers.

The present cornerstoneArchiveImageLoader reads and decodes DICOM files from a standard zipped DICOMDIR archive. A simple way to create such an archive is to download a DICOMDIR file from an Orthanc server.

For different reasons I prefer to present the results in my own way, instead of using a standard GitHub fork.

### Demos

The following screenshots show the use of the cornerstoneArchiveImageLoader library in five examples running on an iPAD.   

The first example shows the dump of the DICOMDIR file with a list of all DICOM instances included in the archive. The instances are usually not saved in a sequential order in the archive. The DICOM standard does not say anything about how the DICOM files should be named or ordered within a DICOMDIR. The optional and usually missing series description in the DICOMDIR file is extracted from the first instance of the series. A useful enhancement of the Orthanc server to [add the series description as Type-3 argument](https://bitbucket.org/sjodogne/orthanc/commits/b340f0a9022c635425753eb48742574705e0454c) to the DICOMDIR was [announced by Sébastien Jodogne](https://groups.google.com/forum/#!topic/orthanc-users/Y7LOvZMDeoc) on October 8, 2017.

<kbd><img src="https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/images/ipadDemoDumpDicomdir.png" width="768"/></kbd>


The second example shows the list of the DICOM file pathes in the ordered instance sequence. 

<kbd><img src="https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/images/ipadDemoProcessDicomdir.png" width="768" /></kbd>


The third example displays one selected instance from the DICOMDIR archive. The instance number can be entered, an out of range value generates an error.

<kbd><img src="https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/images/ipadDemoOneDicomInstance.png" width="768"/></kbd>


The fourth example displays one series from the DICOMDIR archive. The series sequence number can be entered, an out of range value generates an error. If the series includes more than one instance, it's displayed as a clip.

<kbd><img src="https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/images/ipadDemoOneDicomSeries.png" width="768"/></kbd>


The fifth example displays all series from the DICOMDIR archive. Series including more than one instance are displayed as clips.

<kbd><img src="https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/images/ipadDemoAllDicomSeries.png" width="768"/></kbd>


Links to life examples are listed below. The examples are optimzed for iOS, but they should work on any modern browser, except IE 11 which does not yet support "promises" and needs a polyfill like [Bluebird 3.0](http://bluebirdjs.com/docs/api-reference.html). 

* [dumpDICOMDIR](https://www.radiologic.fr/cornerstoneArchiveImageLoader/examples/archive/dumpDICOMDIR.html)  
* [processDICOMDIR](https://www.radiologic.fr/cornerstoneArchiveImageLoader/examples/archive/processDICOMDIR.html)   
* [displayOneInstance](https://www.radiologic.fr/cornerstoneArchiveImageLoader/examples/archive/displayOneInstance.html)    
* [displayOneSeries](https://www.radiologic.fr/cornerstoneArchiveImageLoader/examples/archive/displayOneSeries.html)   
* [displayAllSeries](https://www.radiologic.fr/cornerstoneArchiveImageLoader/examples/archive/displayAllSeries.html)   

The zipped DICOMDIR archives are loaded with a local FileReader. A demofile [radiologic.zip](https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/testdicom/radiologic.zip) is available in the *testdicom folder*. On iPAD's files can be loaded from [iCloud Drive](https://www.apple.com/icloud/icloud-drive/).

### Code description

I tried to add the archive loading function with a minimum of code change to the current [cornerstoneWADOImageLoader](https://github.com/chafey/cornerstoneWADOImageLoader) to facilitate an eventuel pull request to the original code.

#### src/imageLoader/archive/loadImage.js   
Compared to the original [src/imageLoader/wadouri/loadImage.js](https://github.com/chafey/cornerstoneWADOImageLoader/blob/master/src/imageLoader/wadouri/loadImage.js) file, the [following modifications](https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/src/imageLoader/archive/loadImage.js) have been done:   
* *import unzipFileRequest from './unzipFileRequest.js'* was added  
* the function *getLoaderForScheme* was modified to return *unzipFileRequest* if the *scheme === 'ziparchive'*  
* the scheme 'ziparchive' is registered in cornerstone-core

#### src/imageLoader/archive/archiveLoader.js   
This is a [new file](https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/src/imageLoader/archive/archiveLoader.js) with the following features:   
* The function *archiveLoader* returns a promise to unzip the archive

#### src/imageLoader/archive/unzipFileRequest.js   
This is a [new file](https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/src/imageLoader/archive/unzipFileRequest.js) with the following features:   
* the function *unzipFileRequest* returns a promise to extract a selected file from the archive

#### src/imageLoader/archive/dumpDICOMDIR.js   
This is a [new file](https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/src/imageLoader/archive/dumpDICOMDIR.js) with the following features:   
* the function *dumpDICOMDIR* returns a promise to parse and output the relevant items from the DICOMDIR file

#### src/imageLoader/archive/processDICOMDIR.js
This is a [new file](https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/src/imageLoader/archive/processDICOMDIR.js) with the following features:   
* the function *processDICOMDIR* returns a promise to provide for each DICOM series a sorted list of sequential DICOM instances

#### src/imageLoader/archive/index.js
This is a [new file](https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/src/imageLoader/archive/index.js) with the following features:   
* the module is the project entry point of the archive folder

#### src/imageLoader/index.js
Compared to the original [src/imageLoader/index.js](https://github.com/chafey/cornerstoneWADOImageLoader/blob/master/src/imageLoader/index.js) file, the [following modifications](https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/src/imageLoader/index.js) have been done:   
* *export { default as archive } from './archive/index.js'* was added

#### config/webpack/webpack-base.js and config/webpack/plugins/banner.js
Compared to the original [config/webpack/webpack-base.js](https://github.com/chafey/cornerstoneWADOImageLoader/blob/master/config/webpack/webpack-base.js), the [following modifications](https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/config/webpack/webpack-base.js) have been done:    
* the project entry points and the externals for dicomParser have been set to the new names "cornerstoneArchiveImageLoader" and "cornerstoneDicomParserUTF8" 
* I added myself as contributor in the banner.js

#### package.json
Compared to the original [package.json](https://github.com/chafey/cornerstoneWADOImageLoader/blob/master/package.json) file, the [following modifications](https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/package.json) have been done:   
* the "name" and the "main" have been set to the new name "cornerstoneArchiveImageLoader"   
* I added myself as contributor   
* the url of the repository was set to the present repository    
* "jszip ^ 3.1.3" was added to the dependencies    
* the "dicom-parser" dependency was changed to "cornerstone-dicom-parser-utf8" ^1.7.53    

### Installation   
To build the new cornerstoneArchiveImageLoader, clone or download the [cornerstoneWADOImageLoader master version](https://github.com/chafey/cornerstoneWADOImageLoader/) from Chris Hafey's GitHub repository and do the following steps: 

#### 1. rename the project folder as "cornerstoneArchiveImageLoader"
#### 2. add the src/imageLoader/archive folder with content to the project   
#### 3. copy the following folders and files from the wadouri folder to the archive folder: 
* folder metadata
* dataSetCacheManager.js
* getEncapsulatedImageFrame.js
* getUncompressedImageFrame.js
* parseImageId.js
* unpackBinaryFrame.js

#### 4. replace the following files with those from the present repository:  
* src/imageLoader/index.js
* src/imageLoader/dicom-parser.js with src/imageLoader/cornerstone-dicom-parser-utf8.js
* config/webpack/webpack-base.js
* package.json

#### 5. modify the code string  
import * as dicomParser from '../../dicom-parser.js';   
with   
import * as dicomParser from '../../cornerstone-dicom-parser-utf8.js';   
in the following files:   
* scr/imageLoader/archive/dataSetCacheManager.js  
* scr/imageLoader/archive/getEncapsulatedImageFrame.js  
* scr/imageLoader/archive/metadata/metaDataProvider.js

#### 6. rebuild the project

The five demo files are available in the **example/archive/** folder.  

Ready-to-use distribution files are saved in the present **dist/** folder. 

The most recent versions of the other javascript distribution files needed to run the examples are stored in the **example/js/** folder:  

* [jquery.min.js](https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/examples/archive/js/jquery.min.js)
* [jszip.min.js](https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/examples/archive/js/jszip.min.js)
* [cornerstone.min.js](https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/examples/archive/js/cornerstone.min.js)
* [cornerstoneDicomParserUTF8.js](https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/examples/archive/js/cornerstoneDicomParserUTF8.min.js)
* [cornerstoneMath.min.js](https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/examples/archive/js/cornerstoneMath.min.js)
* [cornerstoneTools.min.js](https://github.com/mbarnig/cornerstoneArchiveImageLoader/blob/master/examples/archive/js/cornerstoneTools.min.js)

As DICOM parser, my enhanced [cornerstoneDicomParserUTF8](https://github.com/mbarnig/cornerstoneDicomParserUTF8) file is used.

### Links
* cornerstone user forum: [DICOMDIR support](https://groups.google.com/forum/#!searchin/cornerstone-platform/diego$20angulo%7Csort:relevance/cornerstone-platform/nEgWSzUbxCg/OomV8J07AgAJ)
