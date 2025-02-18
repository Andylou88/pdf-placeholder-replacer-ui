import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
const [pdfFile, setPdfFile] = useState(null);
const [placeholders, setPlaceholders] = useState('');
const [replacements, setReplacements] = useState('');
const [downloadLink, setDownloadLink] = useState('');

const handleFileChange = (event) => {
  setPdfFile(event.target.files[0]);
}

const handleSubmit = async (event) => {
  event.preventDefault();
  if(!pdfFile || !placeholders || !replacements){
    alert('All fields are required.');
    return;
  }


const placeholderArray = placeholders.split(';');
const replacementArray = replacements.split(';');

if(placeholderArray.length !== replacementArray.length){
  alert('The number of placeholders and replacements must match.');
  return;
}

const formData = new FormData();
formData.append('pdfFile', pdfFile);
formData.append('placeholders', JSON.stringify(placeholderArray));
formData.append('replacements', JSON.stringify(replacementArray));

try {
  const response = await axios.post('http://localhost:8080/api/pdf/replace', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  const url = URL.createObjectURL(new Blob([response.data]));
  setDownloadLink(url);
} catch (error){
  console.error('Error', error);
  alert('There was an error processing the PDF. Please try again.');
}
};
  
return(
  <div className="container">
    <h1>Placeholder Replacer</h1>
    <form onSubmit={handleSubmit}>
      <label htmlFor="pdfFile">Upload PDF:</label>
      <input
      type="file"
      id="pdfFile"
      accept="application/pdf"
      onChange={handleFileChange}
      />

      <label htmlFor="placeholders">Placeholders (semicolon-separated ';'):</label>
      <input
      type="text"
      id="placeholders"
      accept={placeholders}
      onChange={(e) => setPlaceholders(e.target.value)}
      />

      <label htmlFor="replacements">Replacements (semicolon-separated ';'):</label>
      <input
      type="text"
      id="replacements"
      accept={replacements}
      onChange={(e) => setReplacements(e.target.value)}
      />

      <button type="submit">Replace Placeholders</button>
    </form>
    {downloadLink && (
      <div id="result">
        <h2>Modified PDF</h2>
        <button><a id="downloadLink" href={downloadLink} download="modified.pdf">Download PDF</a></button>
      </div>
    )}
  </div>
);
}

export default App;
