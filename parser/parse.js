const XLSX = require('xlsx');


let workbook = XLSX.readFile(`./uploads/${fileName}`),
  sheet_name_list = workbook.Sheets,
  listsMap = years(sheet_name_list).lists, //коллекция листов по годам
  listKeys = years(sheet_name_list).keys,
  dataMap = new Map();


function years(sheet_name_list){
  let regXp = /курс/i,
    numRegXp = /\d/;
    lists = new Map(),
    keys = [];

  for(let key in sheet_name_list){
    if(regXp.test(key)){
      lists.set(+key.match(numRegXp), sheet_name_list[key]);
      keys.push(+key.match(numRegXp));
    }
  }
  return {lists, keys};
}


class ListDataParse {
  constructor(lists) {
    this.sheetAll = lists;
    this.sheetCells = Object.keys(this.parse());
    this.sheetValues = Object.values(this.parse());
    this.semestersCells = this.findCellSemester();
    this.disciplinesCode = Object.values(this.findDisciplines(0))[0];
    this.listDisciplinesCells = Object.values(this.disDataFunc())[0];
    this.listDisciplinesCellsLength = this.listDisciplinesCells.length;
    this.listDisciplinesValues = Object.values(this.disDataFunc())[1];
    this.disMap = this.add2Map();
    this.groupsName = this.findGroupsName();
    this.allHours;
    this.labs = this.findLabs();
    this.independentWork = this.findIndependentWork();
    this.lectures = this.findLectures();
  }


  parse(){  //ищу столбцы
    let list = {};
    for(let key in this.sheetAll){
      if(key == '!rows' || key == '!merges' || key == '!ref' || key == '!margins') continue;
      list[key] = this.sheetAll[key];
    }
    return list;
  }

  findLabs(){
    let arr = [];
    let regXp = /лабо/i;
    for(let i = 0; i < this.sheetValues.length; i++){
      if(!regXp.test(this.sheetValues[i].v)) continue;
      arr.push(this.sheetCells[i]);
      if(arr.length == 2) break;
    }
    return arr;
  }

  findIndependentWork(){
    let regXp = /прак/i;
    let arr = [];
    for(let i = 0; i < this.sheetValues.length; i++){
      if(!regXp.test(this.sheetValues[i].v)) continue;
      arr.push(this.sheetCells[i]);
      if(arr.length == 2) break;
    }
    return arr;
  }

  findLectures(){
    let regXp = /лек/i;
    let arr = [];
    for(let i = 0; i < this.sheetValues.length; i++){
      if(!regXp.test(this.sheetValues[i].v)) continue;
      arr.push(this.sheetCells[i]);

      if(i == 100) break;
    }

    arr[1] = arr[2];
    arr.pop();
    arr.pop();
    return arr;
  }

  findCellSemester(){  //ищу ячейки с семестрами
    let strRegXp = /семестр/i;
    let cellArr = [],
      valuesArr = [];
    for(let i = 0; i < this.sheetValues.length; i++){
      if(!strRegXp.test(this.sheetValues[i].w)) continue;
      cellArr.push(this.sheetCells[i]);
      valuesArr.push(this.sheetValues[i].v);
    }

    return {cellArr, valuesArr};
  }

  add2Map(){ //добавляю дисиплины в коллекцию тут есть ошибка, последний элемент не добавляется

    let set = new Map();
    let regXp = /[а-я]\d\.[а-я]/i;
    let counter = 1;
    for(let i = 0; i < this.listDisciplinesCellsLength; i++){
      let toObject = [];
      if(!regXp.test(this.listDisciplinesValues[i].v)) continue;
      for(let j = i; j < this.listDisciplinesCells.length; j++){
        if(XLSX.utils.decode_cell(this.listDisciplinesCells[j]).r != XLSX.utils.decode_cell(this.listDisciplinesCells[j + 1]).r) break;
        let arr = [this.listDisciplinesCells[j], this.listDisciplinesValues[j].w];
        toObject.push(arr);
      }

     set.set(counter, Object.fromEntries(toObject));
     counter++;
    }
    return set;
  }

  findGroupsName(){
    let regXp = /[г][р][у][п][п]+/i;
    let group;
    for(let key in this.sheetValues){
      if(!regXp.test(this.sheetValues[key].v)) continue;
      group = this.sheetValues[key].v;
      break;
    }
    return group;
  }

  findDisciplines(counter){  //ищу код дисциплины
    this.counter = counter;
    let regXp = /[а-я]\d\.[а-я]/i;
    let arr = [],
      arr2 = [];
    for(let i = 0; i < this.sheetValues.length; i++){
      if(!regXp.test(this.sheetValues[i].v)) continue;
        arr.push(this.sheetCells[i + counter]);
        arr2.push(this.sheetValues[i + counter]);
    }
    return {arr, arr2};
  }

  disDataFunc(){  //ищу все данные о дисциплинах
    let arrCells = [],
      arrValues = [];
    for(let i = this.sheetCells.length - 1; i > 0; i--){
      arrCells.unshift(this.sheetCells[i]);
      arrValues.unshift(this.sheetValues[i]);
      if(this.sheetCells[i] == this.disciplinesCode[0]){
        break;
      }
    }

    return {arrCells, arrValues};
  }
}

class Discpline extends ListDataParse {

  sortBySemester(key){ //сортурую по семестрам

    let discipline = {};

    let obj = this.disMap.get(key);

    let cells = Object.keys(obj);
    let values = Object.values(obj);
    discipline.name = values[1];

    let semesterCells = Object.values(this.semestersCells)[0],
      semesterValues = Object.values(this.semestersCells)[1];
    let counter = 0;
    for(let i = 0; i < cells.length; i++){
      let x = XLSX.utils.decode_cell(semesterCells[0]).c;
      if(XLSX.utils.decode_cell(cells[i]).c < x){
        cells.shift();
        values.shift();
      }
      else{
        cells.shift();
        break;
      }
    }


    discipline.department = values.shift(); //кафедра
    discipline.group = this.groupsName; // группы

    let regXp = /\d/;
    let name = 'semester',
      path2 = XLSX.utils.decode_cell(semesterCells[1]).c;
    let arrValues = [],
      arrCells = [];
    for(let i = 0; i < values.length; i++){
      if(XLSX.utils.decode_cell(cells[0]).c < path2){
        arrValues[i] = values.shift();

        arrCells[i] = cells.shift();
      }
      else{
        continue;
      }

    }

    discipline[name + semesterValues[0].match(regXp)[0]] = {};
    discipline[name + semesterValues[1].match(regXp)[0]] = {};

    for(let i = 0; i < arrValues.length; i++){
      switch(XLSX.utils.decode_cell(arrCells[i]).c){
        case XLSX.utils.decode_cell(this.labs[0]).c:
          discipline[name + semesterValues[0].match(regXp)[0]].labs = arrValues[i];
          break;
        case XLSX.utils.decode_cell(this.independentWork[0]).c:
          discipline[name + semesterValues[0].match(regXp)[0]].independentWork = arrValues[i];
          break;
        case XLSX.utils.decode_cell(this.lectures[0]).c:
          discipline[name + semesterValues[0].match(regXp)[0]].lectures = arrValues[i];
          break;
      }
    }

    for(let i = 0; i < values.length; i++){
      switch(XLSX.utils.decode_cell(cells[i]).c){
        case XLSX.utils.decode_cell(this.labs[1]).c:
          discipline[name + semesterValues[1].match(regXp)[0]].labs = arrValues[i];
          break;
        case XLSX.utils.decode_cell(this.independentWork[1]).c:
          discipline[name + semesterValues[1].match(regXp)[0]].independentWork = arrValues[i];
          break;
        case XLSX.utils.decode_cell(this.lectures[1]).c:
          discipline[name + semesterValues[1].match(regXp)[0]].lectures = arrValues[i];
          break;
      }
    }


    let regXp2 = /semester/;


    for(let key in discipline){  //удаляю пустые семетры
      if(!regXp2.test(key)) continue;

      let counter = 0;
      for(let j in discipline[key]){
        counter++;
      }
      if(counter == 0) delete discipline[key];
    }

    return discipline;
  }

  discipline(){
    return this.disMap
  }

}

function add2Class(listsMap){  //добавляю каждый лист в карту
  this.lists = listsMap;
  for(let i = 1; i <= this.lists.size; i++){
    let list = new Discpline(this.lists.get(i));
    dataMap.set(i, list);
  }
}
add2Class(listsMap)


let getDisciplines = () =>{
   let dis = []; //массив дисциплин с их данными
   let lists = [];
   dataMap.forEach((value, key, map)=>{
   dataMap.get(key).disMap.forEach((value1, key1, map1)=>{
      dis.push(dataMap.get(key).sortBySemester(key1));
   });
  });
  listsMap.forEach((value, key, map) =>{
    lists.push(key);
  });
  return {dis, lists};
}

exports.dis = getDisciplines;
