"use strict";
module.exports = function(elements, pathToXLS) {

    // Модуль получает массив объектов представляющий из себя элементы (сборочные узлы, детали, ..)
    // И экспортирует данные в CSV файл для обработки в excel

    var xlsx = require('node-xlsx'),
        fs = require('fs'),
        data = [],
        xlsData,
        allSB = [],
        allDT = [],
        typesForSB = [],
        typesOfElement = {};

    // Типы элементов для сборочных едениц
    // Изделия, чьи типы отличаются от перечисленных в экспортируемые сборочные еденицы не попадут
    typesForSB = [
        'Деталь',
        'Узел/Сборка',
        'Материал',
        'Прочее изделие',
        'Стандартное покупное изделие'];

    // Объект с типами элементов и их ID в Excel
    typesOfElement = {
        'Деталь': 1,
        'Прочее изделие': 3,
        'Стандартное покупное изделие': 2,
        'Узел/Сборка': 0
    };

    // Исправляет название сборочных едениц, если оно указано с символами " СБ"
    function checkNameSB(name) {

        if (name && name.length > 3) {
            if (name.substr(-3) === ' СБ') {
                name = name.substr(0, name.length - 3);
            }
        }
        return name;
    }

    // массивы allSB[] и allDT[] наполняются перечнем позиций
    elements.forEach( function(element) {
        var idEl = element.id;

        if (element.elementType === 'Узел/Сборка') {
            // из перечня элементов выбираются сборочные еденицы, и наполняются элементами у которых текущая сборка является родителем
            allSB[idEl] = {};
            allSB[idEl].el = element;
            allSB[idEl].sb = elements.filter(function (element) {
                return (element.parentID === idEl && typesForSB.indexOf(element.elementType) != -1);
            });
        } else if (element.elementType == 'Деталь') {
            // формируется массив деталей
            allDT[idEl] = {};
            allDT[idEl].el = element;
            allDT[idEl].sb = elements.filter(function (element) {
                return (element.parentID === idEl && element.elementType === 'Материал' );  // TODO: Деталь может быть не только из материала, а ещё из мтандартных и прочих изделий
            });
        }
    });

    // в массив data помещаются данные для экспорта в XLSX
    allSB.forEach(function (elSB) {
        data.push([ checkNameSB(elSB.el.props['Обозначение']), elSB.el.props['Наименование'] ]);
        elSB.sb.forEach(function (element) {
            data.push([ '','',  checkNameSB(element.props['Обозначение']), element.props['Наименование'],
                parseFloat(element.props['Количество']), '', '', '', '', typesOfElement[element.elementType]  ]);
        })
    });

    xlsData = xlsx.build([{name: "shtData", data: data}]); // returns a buffer

    fs.writeFile(pathToXLS, xlsData, 'utf-8', function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

};
