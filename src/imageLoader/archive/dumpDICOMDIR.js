/* eslint max-depth: [2, 12] */

import { returnObject } from './archiveLoader.js';
import * as dicomParser from 'dicom-parser';

function dumpDICOMDIR () {
  return new Promise(function (resolve, reject) {

    const zip = returnObject();
    let seriesSeq = 0;

    zip.file('DICOMDIR').async('uint8array').then(function (dicomPart10AsArrayBuffer) {
      const byteArray = new Uint8Array(dicomPart10AsArrayBuffer);
      let output = '<h2>DICOMDIR Content</h2><ul>';
      let firstImageOfSeries = true;

      try {
        const dataSet = dicomParser.parseDicom(byteArray);

        output += `<li>FileSetID : ${dataSet.string('x00041130')} </li>`;
        output += `<li>Implementation Version Name : ${dataSet.string('x00020013')} </li>`;
        output += `<li>Media Storage SOP Instance UID : ${dataSet.string('x00020003')} </li>`;
        output += `<li>Transfer Syntax UID : ${dataSet.string('x00020010')} </li>`;
        output += `<li>Implementation Class UID : ${dataSet.string('x00020012')} </li>`;
        for (const j in dataSet.elements) {
          if (dataSet.elements.hasOwnProperty(j)) {
            const element = dataSet.elements[j];

            if (element.tag === 'x00041220') {
              for (const item in element.items) {
                if (element.items.hasOwnProperty(item)) {
                  for (const k in element.items[item].dataSet.elements) {
                    if (element.items[item].dataSet.elements.hasOwnProperty(k)) {
                      if (element.items[item].dataSet.elements[k].tag === 'x00041430') {
                        const type = element.items[item].dataSet.string('x00041430');

                        switch (type) {
                        case 'PATIENT' : {
                          const patient = element.items[item].dataSet.string('x00100010');
                          const id = element.items[item].dataSet.string('x00100020');

                          output += `<li>Clinical Case Name (PatientName) : ${patient} </li>`;
                          output += `<li>Clinical Case ID : ${id} </li>`;
                          break;
                        }
                        case 'STUDY' : {
                          const study = element.items[item].dataSet.string('x00081030');
                          const studyID = element.items[item].dataSet.string('x00200010');

                          output += `<li>****** STUDY ******</li><li>STUDY DESCRIPTION : ${study} </li>`;
                          output += `<li>STUDY ID : ${studyID} </li>`;
                          break;
                        }
                        case 'SERIES' : {
                          seriesSeq++;
                          const seriesNo = element.items[item].dataSet.string('x00200011');
                          const modality = element.items[item].dataSet.string('x00080060');
                          const seriesUID = element.items[item].dataSet.string('x0020000e');

                          firstImageOfSeries = true;
                          output += '<li>++++++ SERIES ++++++</li>';
                          output += `<li>SERIES NUMBER: ${seriesNo} </li>`;
                          output += `<li>SERIES MODALITY: ${modality} </li>`;
                          output += `<li>SERIES UID : ${seriesUID} </li>`;
                          output += `<li id='series${seriesSeq}'></li>`;

                          break;
                        }
                        case 'IMAGE' : {
                          const path = element.items[item].dataSet.string('x00041500');
                          const folderAndFile = path.split('\\');
                          const fileIndex = folderAndFile.length - 1;
                          let folder = '';
                          const file = folderAndFile[fileIndex];

                          for (let i = 0; i < fileIndex; i++) {
                            folder += `${folderAndFile[i]}/`;
                          } // end for i
                          const instance = parseInt(element.items[item].dataSet.string('x00200013'), 10);

                          if (firstImageOfSeries) {
                            firstImageOfSeries = false;
                            (function (index) {
                              zip.file(folder + file).async('uint8array').then(function (dicomInstanceArrayBuffer) {
                                const dicomInstanceByteArray = new Uint8Array(dicomInstanceArrayBuffer);

                                try {
                                  const instanceDataSet = dicomParser.parseDicom(dicomInstanceByteArray);
                                  const series = instanceDataSet.string('x0008103e');

                                  document.getElementById(`series${index}`).innerHTML = `SERIES DESCRIPTION : ${series}`;
                                } catch (err) {
                                  console.log(`DicomParsing Error : ${err}`);
                                  reject(`DicomParsing Error : ${err}`);
                                }  // end catch
                              }).catch(function (err) {
                                console.log(`Unzipping error : ${err}`);
                              }); // end then catch zip
                            })(seriesSeq); // end function index
                          } // end if firstImageOfSeries
                          output += `<li>IMAGE REFERENCES : ${path} - INSTANCE : ${instance} </li>`;
                          break;
                        }
                        default : {
                          output += `<li>TYPE : ${type} </li>`;
                          break;
                        }
                        } // end switch
                      } // end if tag
                    } // end if hasOwnProperty(k)
                  } // end for k
                } // end if hasOwnProperty(item)
              } // end for item
            } // end if tag
          }  // end if hasOwnProperty(j)
        }  // end for j
        output += '<ul>';
        resolve(output);
      } catch (err) {
        console.log(`DicomParsing Error : ${err}`);
        reject(`DicomParsing Error : ${err}`);
      }  // end catch
    }).catch(function (err) {
      console.log(`Unzipping error : ${err}`);
      reject(`Unzipping error : ${err}`);
    }); // end catch async
  }); // end promise
}  // end function dumpDICOMDIR(byteArray)

export default dumpDICOMDIR;
