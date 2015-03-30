//var xmlFileName =  './xml_files/collect-preserve.xml'
//var xmlFileName =  './xml_files/ЗС975 (04.03.2015).xml'
//var xmlFileName =  './xml_files/ЗС975.01.02.100 СБ Панель задняя.xml'
var xmlFileName = './xml_files/ЗC975.00.00.000 СБ.xml';

var fs = require('fs')
    , flow = require('xml-flow')
    , inFile = fs.createReadStream(xmlFileName)
    , xmlStream = flow(inFile)
    ;



xmlStream.on('tag:item', function(item) {
    console.log("=============================");
    console.log(item);
    //console.log(item.items[1].description)
});