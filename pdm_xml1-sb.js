/*
Функции подготовки данных для импорта в базу изделий из PDM (xml выгрузка).
*/


exports.parseXML = function(xml_file) {

    var fs = require('fs');
    var path = require('path');
    var parser = new require('xml2js').Parser();
    var colors = require('colors');

    var prop;

    var idList = {
        '0ec11e6a-54c6-4309-bef7-56ea62130d4d': 'Каталог',
        '77dcc9ac-4fd0-4dab-9fc4-ebc7a3cde0db': 'Стандартное покупное изделие',
        'e928833c-45bc-4943-bdd0-c7c7913a7e1e': 'Узел/Сборка',
        '99faac9e-01c0-4c6a-8352-7f3c0ab0843c': 'Сборка (документ)',
        '9b62ab78-5f04-4b6e-96fa-dc9578511ac1': 'Деталь',
        '09a8c6be-be3c-4d89-9f56-13e879e297ea': 'Деталь (документ)',
        '6e25a2db-795d-4ab6-836c-0762d2d4c7cf': 'Прочее изделие',
        '5638c625-aa5f-468e-8f54-96e48cb24db3': 'Материал',
        '2f1b050d-9ad5-4faf-af51-3f919a9fd613': 'Изображение',
        '6ec4b3cb-ca3e-43ab-89d3-caf3bfc3920f': 'Чертеж'
    };

    var parametersList = {
        'Дата создания': '',       // <property>387d16a9-9c92-4483-b507-6b4ea9aa65ff</property>
        'Наименование': '',        // <property>4d9a583d-44b0-4b38-9327-4cf873d94ffb</property>
        'Обозначение': '',         // <property>f8a2bef0-0a12-432f-9f0d-72a2d18528ec</property>
        'Единицы измерения': '',   // <property>f90e6384-2c80-45bc-90bb-56c3aaacb46e</property>
        'Количество': '',          // <property>6b8b027c-10af-4fe6-b4b6-7bd83b22668a</property>
        'Плотность': '',           // <property>60faecff-2eb4-4e02-bfb3-05ba7170e9a8</property>
        'Масса': '',                // <property>f90e6384-2c80-45bc-90bb-56c3aaacb46e</property>
        'id': ''
    };


    var tabs = '';
    var counter = 0;
    var el = [];

    fs.readFile(xml_file, function(err, data) {
        if (err) {
            console.log("Не удается открыть файл: " + pathToFile);
        } else {
            parser.parseString(data, function (err, result) {
                if (err) {
                    console.log("Не удается обработать xml данные: " + pathToFile);
                } else {
                    parse_item(result.item, tabs, ++counter, 0);
                }
            });
        }
        //console.log(counter);
        //console.dir(el);


        printAllElementsSB();
        /*
         el.forEach( function logArrayElements(element) {
         //console.dir(element);
         console.log(element.desc + '\t' +
         element.elementType + '\t' +
         element.props['Обозначение'] + '\t' +
         element.props['Наименование'] + '\t' +
         element.props['Количество'] + '\t' +
         element.parentID);
         } );
         */
    });


    function parse_item(item, tabs, idEl, parentID) {
        try {
            var items,
                parameters = [];
                el[idEl] = {};
                el[idEl].props = {};
                tabs += '\t';

            if (!idList.hasOwnProperty(item.elementType[0])) {
                console.log((tabs + 'неизвестный элемент: ' + item.elementType[0]).yellow);
            } else {
                parameters = item.parameters;
                console.log((tabs + item.description[0] + '\t== Элемент ' + idList[item.elementType[0]] + ' ==').green);
                el[idEl].desc = item.description[0];
                el[idEl].elementType = idList[item.elementType[0]];
                el[idEl].parentID = parentID;
                el[idEl].id = idEl;

                if (parameters && parameters.length && (item.elementType[0] !== '0ec11e6a-54c6-4309-bef7-56ea62130d4d')) {
                    // перебор свойст всех элементов кроме каталогов
                    eachParameters(parameters, tabs, idEl);
                }

                if (item.items) {
                    items = item.items;
                    for (var i = 0; i < items.length; i++) {
                        parse_item(items[i], tabs, ++counter, idEl);
                    }
                }
            }

        } catch (err) {
            console.log((tabs + "Произошла ошибка " + err).red);
        }
    }


    /**
     * Функция для рекурсивного извлечения значений параметров элемента
     *
     * parameters   - массив параметров (объекты содержащие наименование параметра, значение, и др.)
     * tabs         - строка из символов табуляции для наглядного вывода в консоль
     */
    function eachParametersItem(parameters, tabs, id) {
        var i, description;
        for ( i = 0; i < parameters.length; i++) {

            if (!parameters[i].property) {
                // property не имеют группы свойств (группы: "Общие", "Количественные", "Физические свойства")
                eachParametersItem(parameters[i].parameters, tabs, id);
                continue;
            }

            description = parameters[i].description[0];

            if (parametersList.hasOwnProperty(description)) {
                parametersList[description] = parameters[i].value["0"]._;
                el[id].props[description] = parameters[i].value["0"]._;
            }
        }
        parametersList.id = id;
    }

    /**
     * Функция для очистки объекта свойств текущего элемента
     */
    function clearPropertyList() {
        for (prop in parametersList) {
            parametersList[prop] = '';
        }
    }

    /**
     * Функция для печати свойств элемента в консоль
     */
    function printPropertyList(tabs){
        for (prop in parametersList){
            if (parametersList[prop] !== '') {
                console.log(tabs + '|- ' +  prop + ': ' + parametersList[prop]);
            }
        }
    }

    /**
     * Функция для подготовки массива свойств элемента и печати этих данных в консоль
     */
    function eachParameters(parameters, tabs, id){
        eachParametersItem(parameters, tabs, id);
        printPropertyList(tabs);
        clearPropertyList();
    }

    function printAllElementsSB() {
        var allSB = {}, allDT = {};
        var idEl;
        el.forEach( function logArrayElements(element) {
            //console.dir(element);
            idEl = element.id;

            if (element.elementType == 'Узел/Сборка'){

                allSB[idEl] = {};
                allSB[idEl].el = element;
                allSB[idEl].sb = el.filter( function(element) {
                    return (element.parentID === idEl &&
                        (element.elementType === 'Деталь' ||
                            element.elementType === 'Узел/Сборка' ||
                            element.elementType === 'Материал' ||
                            element.elementType === 'Прочее изделие' ||
                            element.elementType === 'Стандартное покупное изделие'));
                } );
            } else if (element.elementType == 'Деталь'){

                allDT[idEl] = {};
                allDT[idEl].el = element;
                allDT[idEl].sb = el.filter( function(element) {
                    return (element.parentID === idEl && element.elementType === 'Материал' );
                } );
            }
        } );

        //console.dir(allSB);

        for (var elSB in allSB) {
            console.log(allSB[elSB].el.props['Обозначение'] + '\t' + allSB[elSB].el.props['Наименование']);
            allSB[elSB].sb.forEach(function (element) {
                console.log('\t\t' + element.props['Обозначение'] + '\t' +
                    element.props['Наименование'] + '\t' +
                    element.props['Количество'] + '\t\t\t' +
                    element.elementType);
            })
        }

        for (var elDT in allDT) {
            if (allDT[elDT].sb[0]) {
                console.log(allDT[elDT].el.props['Обозначение'] + '\t' + allDT[elDT].el.props['Наименование'] + '\t' + allDT[elDT].sb[0].desc + '\t' + allDT[elDT].el.props['Масса']);
            }
            else {
                console.log(allDT[elDT].el.props['Обозначение'] + '\t' + allDT[elDT].el.props['Наименование'] + '\t' + "ОТСУТСТВУЕТ ОПИСАНИЕ" + '\t' + allDT[elDT].el.props['Масса']);
            }

        }

        //console.log(allDT); //вывод на печать массива всех деталей
    }

}


