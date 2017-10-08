import JSZip from 'jszip';
const zip = new JSZip();

function archiveLoader (selectedFile) {

  return new Promise(function (resolve, reject) {
    const str = selectedFile.name.substring(selectedFile.name.length - 4);

    if (str === '.zip') {
      zip.loadAsync(selectedFile).then(function () {
        returnObject(zip);
        resolve('success');
      }).catch(function (err) {
        console.log(`Unzipping Error: ${err}`);
        reject(`Unzipping Error: ${err}`);
      }); // end catch
    } else {
      console.log('This is not a zip file');
      reject('This is not a zip file');
    } // end if else
  }); // end promise

} // end function archiveLoader

function returnObject () {

  return zip;
}  // end function returnObject

export { returnObject, archiveLoader };

