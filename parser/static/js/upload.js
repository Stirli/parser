'use strict';
let dropZone = document.querySelector('div');
let input = document.querySelector('input');

document.addEventListener('dragover', ev => ev.preventDefault());
document.addEventListener('drop', ev => ev.preventDefault());


dropZone.addEventListener('drop', ev => {
  ev.preventDefault();
  let result = checkFilesType(ev.dataTransfer.files);
  if (result.sucsess) {
    let fileList = ev.dataTransfer.files;
    input.files = fileList;
    send();
    return;
  }

  alert(result.message);

});


dropZone.addEventListener('click', () => {
  input.click();
});

input.addEventListener('change', () => {
  send();
});


let send = () => {

  let formData = new FormData(document.forms.file);
  let xhr = new XMLHttpRequest();

  xhr.open("POST", '/upload');
  xhr.send(formData);

  xhr.onreadystatechange = function () {

    if (xhr.response == 'file upload') {
      document.location.href = '/viewing';
    }
  }
};

function checkFilesType(files) {
  for (const file of files) {
    if (file.type != 'application/vnd.ms-excel') {
      return {
        message: `Wrong type for '${file.name} (${file.type})!'`,
        sucsess: false
      };
    }
  }
  return {
    message: 'Sucsess',
    sucsess: true
  };
}