const BASE_URL = "https://jsonplaceholder.typicode.com";
const Todos_Endpoint = "/todos";
const loadTodosButton = document.getElementById("loadTodos");
const pagination = document.getElementById("pagination");
const PageSelect = document.getElementById("PageSelect")

const box = document.querySelector(".box");
const search = document.getElementById("search");
let loadedData = [];
let pageNumber = 0;
let limit = parseInt(PageSelect.value);


loadTodosButton.addEventListener("click", async() => {
    await loadTodosFromApi(pageNumber, limit);
    loadTodosButton.setAttribute("disabled", true);
});
search.addEventListener("change", ({ target }) => {
    const { value } = target;
    if (value !== "") {
        const filtered = loadedData.filter((item) => {
            return item.title.toLowerCase().includes(value.toLowerCase());
        });

        addTodoList(filtered, { empty: true });
    } else {
        addTodoList(loadedData, { empty: true });
    }
});

PageSelect.addEventListener("change", ({ target }) => {
    limit = parseInt(target.value);
    pageNumber = 0;
    loadTodosFromApi(pageNumber, limit, {
        empty: true,
    });
});

pagination.addEventListener("click", async({ target }) => {
    const { pageAction } = target.dataset;
    if (pageAction === "nextPage") {
        pageNumber += 1;
    } else if (pageAction === "prevPage") {
        if (pageNumber > 0) {
            pageNumber -= 1;
        }
    }

    const start = pageNumber * limit;
    await loadTodosFromApi(start, limit);
});

async function FetchBuilder(url, options = {}) {
    try {
        const response = await fetch(url);
        const result = response.json();
        return result;
    } catch (err) {}
}

async function loadTodosFromApi(start, limit, options) {
    const todoList = await FetchBuilder(
        `${BASE_URL}${Todos_Endpoint}?_start=${start}&_limit=${limit}`
    );
    loadedData = [...loadedData, ...todoList];
    addTodoList(todoList, options);
}

function addTodoList(list, options = {}) {
    const todoListDiv = document.querySelector(".todoList");
    const h3 = document.createElement("h3");
    h3.textContent = `loaded - ${loadedData.length}`;
    if (options["empty"]) {
        todoListDiv.innerHTML = null;
    }
    const div = document.createElement("div");
    div.className = "flex3";

    list.forEach((todo) => {
        const p = document.createElement("p");
        p.textContent = `${todo.title}, ${todo.completed},  Id - ${todo.id}`;
        div.appendChild(p);
        if (todo.completed === false) {
            p.style.color = "red";
        } else if (todo.completed === true) {
            p.style.color = "green";
        }
    });

    todoListDiv.appendChild(div);
    todoListDiv.appendChild(document.createElement("br"));
    todoListDiv.appendChild(h3);
}