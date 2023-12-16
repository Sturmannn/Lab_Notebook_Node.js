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
    .then((response) => response.json())
    .then((json) => {
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
        for (const key in row) {
          if (key == "paths_to_files" && typeof row[key] == "string") {
            const fileNames = row[key].split(";");
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
