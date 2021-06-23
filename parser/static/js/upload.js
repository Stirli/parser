'use strict';
let dropZone = document.querySelector('div');
let input = document.querySelector('input');

document.addEventListener('dragover', ev => ev.preventDefault());
document.addEventListener('drop', ev => ev.preventDefault());

dropZone.addEventListener('drop', ev =>{
  ev.preventDefault();

  let fileList = ev.dataTransfer.files;
  let event = 'drop';

  add2Form(fileList, event)
});

dropZone.addEventListener('click', () => {

  input.click();

  input.addEventListener('change', () => {
    let fileList = input.files;
    add2Form(fileList);
  });

});

let add2Form = (fileList, event) =>{

  document.querySelector('input[type="file"]').files = fileList;

  if(event == 'drop'){
    let event = new Event('change');
    let elem = document.querySelector('input');
    elem.dispatchEvent(event);
  }

};


let send = () =>{

  let formData = new FormData(document.forms.file);
  let xhr = new XMLHttpRequest();

  xhr.open("POST", '/upload');
  xhr.send(formData);

  xhr.onreadystatechange = function(){

    if (xhr.response == 'file upload') {
      document.location.href = '/viewing';
    }
  }
};
















/*let send = (formData) =>{

  // добавим ещё одно поле

  // отправим данные
  let xhr = new XMLHttpRequest();
  xhr.open('POST', '/upload');
  xhr.send(formData);
  if (xhr.readyState === 4 && xhr.status === 200) {
    //перенаправить на какой-нибудь url
    console.log('успех');
  } else {
    console.log('');
  }

}*/

//xhr.onload = () => alert(xhr.response);
