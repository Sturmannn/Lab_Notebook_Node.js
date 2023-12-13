// const search_field = document.getElementById("search_field");
// const search_button = document.getElementById("search_button");
// console.log(search_field)
// search_button.addEventListener("click", (event) => {
//   const data = {
//     text: search_field.value,
//   };
//   console.log("Мы здесь!")
//   console.log(event)
//   console.log(data);
//   console.log(JSON.stringify(data));
//   fetch(search_field.dataset.action, {
//     method: "POST",
//     headers: {
//       "Content-Type": "application/json;charset=utf-8",
//     },
//     body: JSON.stringify(data),
//   })
//     .then((responce) => responce.json())
//     .then((json) => console.log(json));
// });

const search_field = document.getElementById("search_field");
const search_button = document.getElementById("search_button");

search_button.addEventListener("click", (event) => {
  const data = {
    text: search_field.value,
    searchType: document.querySelector('input[name="searchType"]:checked')
      .value,
  };
  fetch("/search", {
    method: "POST",
    headers: {
      "Content-Type": "application/json;charset=utf-8",
    },
    body: JSON.stringify(data),
  })
    //   .then(console.log("Привееет!"))
    .then((response) => response.json())
    .then((json) => {
      console.log(json.rowCount);

      const table = document.getElementById("Create_Table");
      table.innerHTML = "";
      if (json.rowCount == 0) return;
      const tableElement = document.createElement("table");
      const headerRow = document.createElement("tr");
      const namesHeader = ["id", "Заголовок", "Заметка", "Метки", "Файлы"];
      for (let i = 0; i < namesHeader.length; i++) {
        const header = document.createElement("th");
        header.textContent = namesHeader[i];
        headerRow.appendChild(header);
      }
      tableElement.appendChild(headerRow);
      const tableBody = document.createElement("tbody");

      json.rows.forEach((row) => {
        const rowElement = document.createElement("tr");
        console.log("Мы здесь!!", row);
        for (const key in row) {
          console.log("Это ключ", key);
          if (key == "paths_to_files" && typeof row[key] == "string") {
            const fileNames = row[key].split(";");
            console.log("Вот здесь уже данные", fileNames, row[key]);
            const cellElement = document.createElement("td");
            for (let i = 0; i < fileNames.length; i++) {
              const link = document.createElement("a");
              link.href = "/file_storage/" + fileNames[i];
              link.download = fileNames[i];
              link.textContent = fileNames[i] + " ";
              cellElement.appendChild(link);
              rowElement.appendChild(cellElement);
            }
          } else {
            const cellElement = document.createElement("td");
            cellElement.textContent = row[key];
            rowElement.appendChild(cellElement);
          }
        }

        tableBody.appendChild(rowElement);
      });
      tableElement.appendChild(tableBody);
      table.appendChild(tableElement);
    });
});
