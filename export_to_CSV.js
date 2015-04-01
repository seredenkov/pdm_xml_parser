"use strict";
module.exports = function(elements, pathToCSV) {

    // Модуль получает массив объектов представляющий из себя элементы (сборочные узлы, детали, ..)
    // И экспортирует данные в CSV файл для обработки в excel

    var stringify = require('csv-stringify'),
        input = [];


    elements.forEach( function(element) {
        var idEl = element.id,
            allSB = [],
            allDT = [];

        if (element.elementType == 'Узел/Сборка') {
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
            input.push([ elSB.el.props['Обозначение'], elSB.el.props['Наименование'] ])
            elSB.sb.forEach(function (element) {
                input.push([ '','',  element.props['Обозначение'], element.props['Наименование'], element.props['Количество'], '', '', '', element.elementType ])
            })
        });
    });

    stringify(input, function(err, output){
        console.log(output);
    });

    // TODO: Save data from input to CSV (pathToCSV)

};

