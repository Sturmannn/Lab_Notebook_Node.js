// Создание таблицы
const table = document.createElement("table");
table.setAttribute("id", "Table");
table.setAttribute("border", 1);

//Создание заголовка таблицы
const headerRow = document.createElement("tr");
const namesHeader = ["Номер", "Комплектующие", "Цена, $"];
for (let i = 0; i < namesHeader.length; i++) {
    const header = document.createElement("th");
    header.setAttribute("onclick", "sortTable(this)");
    header.textContent = namesHeader[i];
    headerRow.appendChild(header);
}
table.appendChild(headerRow);

//Элементы таблицы
const hardware = [
    ["Процессор Intel Core i9-11900K", "550"],
    ["Видеокарта NVIDIA GeForce RTX 3080", "1000"],
    ["Материнская плата ASUS ROG Maximus XIII Hero", "500"],
    ["Оперативная память Corsair Vengeance RGB Pro DDR4 32 ГБ", "200"],
    ["SSD-накопитель Samsung 970 EVO Plus 1 ТБ", "200"],
    ["Блок питания Corsair RM850x", "150"]
];

const confirmDeleteRow = row => {
    if (confirm("Удалить строку таблицы?")) {
        row.parentNode.removeChild(row);
    }
}

//Создание тела таблицы
for (let i = 0; i < hardware.length; i++) {
    const row = document.createElement("tr");
    row.setAttribute("onclick", "confirmDeleteRow(this)");

    const order = document.createElement("td");
    order.textContent = i + 1;

    row.appendChild(order);
    for (let j = 0; j < hardware[i].length; j++) {
        const cell = document.createElement("td");
        cell.textContent = hardware[i][j];
        row.appendChild(cell);
    }
    table.appendChild(row);
}

const add = document.getElementById("Create_Table");
add.appendChild(table);

//Сортировка таблицы по указанному заголовку
const sortTable = col => {
    const length = table.childNodes.length;
    if (length <= 1) return;
    let greater = (a, b) => {};

    col = col.cellIndex;
    let checkType = table.rows[1].getElementsByTagName("td")[col];

    //============Реализация компаратора============
    if (isNaN(checkType.innerText) === true) {
        greater = (a, b) => a.localeCompare(b) > 0; //Лексикографический порядок
    } else {
        greater = (a, b) => Number(a) > Number(b);
    }
    //==============================================
    for (let i = 1; i < length - 1; i++) {
        const x = table.rows[i];
        for (let j = i + 1; j < length; j++) {
            const y = table.rows[j];
            if (greater(x.childNodes[col].innerText, y.childNodes[col].innerText)) {
                const tmp = x.innerHTML;
                x.innerHTML = y.innerHTML;
                y.innerHTML = tmp;
            }
        }
    }
}