'use strict';
let dropZone = document.querySelector('div');
let input = document.querySelector('input');
let form = document.querySelector('form');

document.addEventListener('dragover', ev => ev.preventDefault());
document.addEventListener('drop', ev => ev.preventDefault());


dropZone.addEventListener('drop', ev => {
  ev.preventDefault();
  trySendFile(ev.dataTransfer.files[0]);

});


dropZone.addEventListener('click', () => {
  input.click();
  });

input.addEventListener('change', () => {
  trySendFile(input.files[0]);
});


let trySendFile = (file) => {
  let result = checkFileType(file);
  if (!result.sucsess) {
    alert(result.message);
    return;
  }
  let formData = new FormData(form);
  formData.set('filedata',file);
  let xhr = new XMLHttpRequest();

  xhr.open("POST", '/upload');
  xhr.send(formData);

  xhr.onreadystatechange = function () {

    if (xhr.response == 'file upload') {
      document.location.href = '/viewing';
    }
  }
};

function checkFileType(file) {
  if (file.type != 'application/vnd.ms-excel') {
    return {
      message: `Wrong type for '${file.name} (${file.type})!'`,
      sucsess: false
    };
  }
  return {
    message: 'Sucsess',
    sucsess: true
  };
}
