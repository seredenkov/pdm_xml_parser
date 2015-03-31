"use strict";


var parser1 = require('./pdm_xml1-sb');
var parser2 = require('./pdm_xml2-sb');


var xmlFileName;

//xmlFileName =  '../xml_files/collect-preserve.xml'
//xmlFileName =  '../xml_files/ЗС975 (04.03.2015).xml'
//xmlFileName =  '../xml_files/ЗС975.01.02.100 СБ Панель задняя.xml'
//xmlFileName = "../xml_files/test.xml";
//xmlFileName = "../xml_files/test2.xml";
//xmlFileName = "../xml_files/ЗC975.00.00.000 (без вложений) 05.03.2015.xml";
//xmlFileName = "../xml_files/ЗC975.08.00.000 СБ Блок вентиляторов (11.02.2015).xml";
//xmlFileName = "../xml_files/ЗС1175.04.00.000 СБ Модуль верхний (04.03.2015).xml";
//xmlFileName = "../xml_files/ЗС1175.04.00.000 СБ Модуль верхний (26.02.2015).xml";
//xmlFileName = "../xml_files/ЗС975 часть (05.03.2015).xml";
//xmlFileName = "../xml_files/КСЦ 450 (29.01.2015).xml";
//xmlFileName = "../xml_files/КСЦ50.00.000 Конвейер скребковый цепной (27.08.2014).xml";
xmlFileName = "../xml_files/КСЦ50.01.100 Опора.xml";
//xmlFileName = "../xml_files/Материалы (03.11.2013).xml";
//xmlFileName = '../xml_files/ЗC975.00.00.000 СБ.xml';

// 03.2015
// var xml_file = "/xml_files/ЗC975.00.00.000 СБ.xml";
//xmlFileName = "../xml_files/КСЦ150С.xml";
//xmlFileName = "../xml_files/ЗC975.00.00.000 СБ.xml";  // слишком большой


//xmlFileName =  '../xml_files/КСЦ 450 (29.01.2015).xml'
//parser1.parseXML(xmlFileName);
parser2.parseXML(xmlFileName);
