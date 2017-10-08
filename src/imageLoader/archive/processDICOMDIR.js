/* eslint max-depth: [2, 12] */

import { returnObject } from './archiveLoader.js';
import * as dicomParser from 'dicom-parser';

function processDICOMDIR () {

  return new Promise(function (resolve, reject) {
    const zip = returnObject();

    zip.file('DICOMDIR').async('uint8array').then(function (dicomPart10AsArrayBuffer) {
      const byteArray = new Uint8Array(dicomPart10AsArrayBuffer);
      const dicomSeries = [];
      let items = [];
      let temp = [];

      try {
        const dataSet = dicomParser.parseDicom(byteArray);

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
                        case 'SERIES' : {
                          dicomSeries.push(items);
                          items = [];
                          break;
                        }
                        case 'IMAGE' : {
                          const path = element.items[item].dataSet.string('x00041500');
                          let instance = parseInt(element.items[item].dataSet.string('x00200013'), 10);

                          if (isNaN(instance)) {  // not a number
                            instance = 0;
                          }  // end if instance
                          temp = [instance, path];
                          items.push(temp);
                          break;
                        }
                        default : {
                          // do nothing
                          break;
                        }
                        } // end switch
                      } // end if tag
                    } // end if hasOwnProperty(k)
                  } // end for k
                } // end if hasOwnProperty(item)
              } // end for item
            } // end if tag
          } // end if hasOwnProperty(j)
        } // end for j
        dicomSeries.push(items);  // add last items to dicomSeries
        dicomSeries.shift();  // delete first element (instance number) in array
        for (let k = 0; k < dicomSeries.length; k++) {
          const serie = dicomSeries[k];

          serie.sort(sortFunction);
          for (let w = 0; w < serie.length; w++) {
            serie[w] = serie[w][1];
          } // end for w
        }  // end for k
        resolve(dicomSeries);
      } catch (err) {
        console.log(`DicomParsing Error: ${err}`);
        reject(`DicomParsing Error: ${err}`);
      } // end catch
    }).catch(function (err) {
      console.log(`Unzipping Error: ${err}`);
      reject(`Unzipping Error: ${err}`);
    }); // end catch async
  }); // end promise
}// function processDICOMDIR

function sortFunction (a, b) {
  if (a[0] === b[0]) {

    return 0;
  } // end if

  return (a[0] < b[0]) ? -1 : 1;
} // end function sortFunction

export default processDICOMDIR;
