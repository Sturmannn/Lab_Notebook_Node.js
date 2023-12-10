const search_field = document.getElementById("search_field");
const search_button = document.getElementById("search_button");
search_button.addEventListener("click", (event)=>
{
    const data = {
        data: search_field.value
    }
    console.log(JSON.stringify(data))
    fetch(search_field.dataset.action, 
        {
            method: "POST",
            headers: {
                'Content-Type': 'application/json;charset=utf-8'
            },
            body: JSON.stringify(data)
        })
        .then(responce => responce.json())
        .then(json => console.log(json));
        
})