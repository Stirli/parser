const parse = require('./parse');

let dis = parse.dis().dis;
delete require.cache[require.resolve('./parse.js')]

let findGroups = (dis) =>{
    let length = dis.length - 1;
    let name = dis[length].group;
    let arr = [],
        disciplines = [];
    while(dis.length + 1){
        if(name == dis[length].group){
            arr.unshift(dis.pop());
            length = dis.length - 1;
        }
        else{
            disciplines.unshift(arr);
            name = dis[dis.length - 1].group;
            arr = [];
        }
        if(dis.length == 0){
            disciplines.unshift(arr);
            break;
        }
    }
    return disciplines
    
};

let groups = findGroups(dis);

exports.groups = groups;

//console.log(groups[0]);