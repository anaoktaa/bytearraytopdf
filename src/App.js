import React, { useState } from 'react';
import b64toBlob from 'b64-to-blob';
import './App.css';

import { base64ArrayBuffer } from './utils';

function App() {
  const [ byteArr, setByteArr ] = useState("");

  const openNewTab = (response) => {
    var contentType = 'application/pdf';
    var sliceSize = 512;

    var byteCharacters = atob(response);
    var byteArrays = [];

    for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
      var slice = byteCharacters.slice(offset, offset + sliceSize);

      var byteNumbers = new Array(slice.length);
      for (var i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      var byteArray = new Uint8Array(byteNumbers);

      byteArrays.push(byteArray);
    }

    var blob = new Blob(byteArrays, {type: contentType});
    blob = b64toBlob(response, contentType);
    var blobUrl = URL.createObjectURL(blob);

    window.open(blobUrl);
  }

  const handleChange = event => {
    const { value } = event.target;
    setByteArr(value);
  }

  const handleConvert = () => {
    if (byteArr === "") {
      alert("Input must not be empty !");
    }
    else {
      let data = byteArr.trim().replace(/ /g,'');
      data.replace(/\r?\n|\r/g, '');
      let arrData = JSON.parse("["+data+"]");
      const base64 = base64ArrayBuffer(arrData);
      openNewTab(base64);
    }
  }

  const handleClear = () => {
    setByteArr("");
  }

  const handleCopy = () => {
      /* Get the text field */
    var copyText = document.getElementById("byte-arr-area");

    /* Select the text field */
    copyText.select();
    copyText.setSelectionRange(0, 99999); /*For mobile devices*/

    /* Copy the text inside the text field */
    document.execCommand("copy");

    /* Alert the copied text */
    alert("Copied ! ");
  }

  return (
    <div className="App">
      <h1>Byte Array to PDF Converter</h1>
      <p>
        Convert Byte Array to PDF online using a free decoding tool which allows you to 
        decode Byte Array as PDF and display it directly in the browser.
        In addition, you will receive some basic information about this PDF (MIME type, extension, size).
        And, of course, you will have a special link to download the PDF to your device. 
      </p>
      <div className="box">
        <div className="flex-between"> 
          <h3>Byte Array*</h3>
          <div className="flex-start">
            <p onClick={handleCopy}>Copy</p>
            <p onClick={handleClear}>Clear</p>
          </div>
        </div>
        <textarea  
          id="byte-arr-area"
          className="text-area" 
          name="data" 
          value={byteArr}
          placeholder="Example : 37, 80, 68, 70, 45, 49, 46, 52, 10, 37"
          onChange={handleChange}
        />
      </div>
      <br/>
      <button onClick={handleConvert}>
        Convert Byte Array to PDF
      </button>
    </div>
  );
}

export default App;
