"use strict";
module.exports = function(elements, pathToXLS) {

    // Модуль получает массив объектов представляющий из себя элементы (сборочные узлы, детали, ..)
    // И экспортирует данные в CSV файл для обработки в excel

    var xlsx = require('node-xlsx'),
        fs = require('fs'),
        data = [], xlsData;

    function checkNameSB(name) {

        if (name && name.length > 3) {
            if (name.substr(-3) === ' СБ') {
                name = name.substr(0, name.length - 3);
            }
        }
        return name;
    }

    function checkTypeEl(elType) {
        var types = {
            'Деталь': 1,
            'Прочее изделие': 3,
            'Стандартное покупное изделие': 2,
            'Узел/Сборка': 0
        };

        return types[elType];
    }

    elements.forEach( function(element) {
        var idEl = element.id,
            allSB = [],
            allDT = [];

        if (element.elementType === 'Узел/Сборка') {
            // из перечня элементов выбираются сборочные еденицы, и наполняются элементами у которых текущая сборка является родителем
            allSB[idEl] = {};
            allSB[idEl].el = element;
            allSB[idEl].sb = elements.filter(function (element) {
                return (element.parentID === idEl &&
                    (element.elementType === 'Деталь' ||
                        element.elementType === 'Узел/Сборка' ||
                        element.elementType === 'Материал' ||
                        element.elementType === 'Прочее изделие' ||
                        element.elementType === 'Стандартное покупное изделие'));
            });
        } else if (element.elementType == 'Деталь') {
            // формируется массив деталей
            allDT[idEl] = {};
            allDT[idEl].el = element;
            allDT[idEl].sb = elements.filter(function (element) {
                return (element.parentID === idEl && element.elementType === 'Материал' );
            });
        }

        // в массив input помещаются данные для экспорта в CSV
        allSB.forEach(function (elSB) {
            data.push([ checkNameSB(elSB.el.props['Обозначение']), elSB.el.props['Наименование'] ]);
            elSB.sb.forEach(function (element) {
                data.push([ '','',  checkNameSB(element.props['Обозначение']), element.props['Наименование'], parseFloat(element.props['Количество']), '', '', '', '', checkTypeEl(element.elementType) ])
            })
        });

    });

    xlsData = xlsx.build([{name: "shtData", data: data}]); // returns a buffer

    var pathToXLS = pathToXLS;
    fs.writeFile(pathToXLS, xlsData, 'utf-8', function(err) {
        if(err) {
            return console.log(err);
        }
        console.log("The file was saved!");
    });

};