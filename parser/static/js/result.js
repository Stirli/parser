fetch('/parse')
.then(response => response.json())
.then(data => sort(data));
let sort = (data) => {
    console.log(data);
    //add2GroupsList(data);
    //add2DisciplinesList(data);
};

let add2GroupsList = (data) => {
    let ul = document.getElementById('groups')
    for(let i = 0; i < data.length; i++){
        let arr = data[i];
        let counter = 0;
        for(let j = 0; j < arr.length; j++){
            let li = document.createElement('li');
            li.innerHTML = arr[j].group;
            ul.append(li);
            counter++;
        }
        console.log(counter);
    }
};

let add2DisciplinesList = (data) => {
    let ul = document.getElementById('disciplines')
    for(let i = 0; i < data.length; i++){
        let arr = data[i];
        let counter = 0;
        for(let j = 0; j < arr.length; j++){
            let li = document.createElement('li');
            li.innerHTML = arr[j].name;
            ul.append(li);
            counter++;
        }
        console.log(counter);
    }
};

let sorting = () =>{
let list, i, switching, shouldSwitch;
list = document.getElementById("groups").getElementsByTagName("LI");
switching = true;

while (switching) {
    switching = false;
    for (i = 0; i < list.length - 1; i++) {
        shouldSwitch = false;
        if (list[i].innerHTML.toLowerCase() > list[i + 1].innerHTML.toLowerCase()) {
            shouldSwitch = true;
            break;
        }
    }
    if (shouldSwitch) {
        list[i].parentNode.insertBefore(list[i + 1], list[i]);
        switching = true;
    }
}
};
