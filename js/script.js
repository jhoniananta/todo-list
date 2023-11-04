document.addEventListener("DOMContentLoaded", function () {
  const todos = [];
  const RENDER_EVENT = "render-todo";

  const submitForm = document.getElementById("form");
  submitForm.addEventListener("submit", function (event) {
    // agar website tidak memuat ulang saat disubmit
    event.preventDefault();
    addTodo();
  });

  function addTodo() {
    const textTodo = document.getElementById("title").value;
    const timestamp = document.getElementById("date").value;

    const generateID = generateId();
    // membuat object baru
    const todoObject = generateTodoObject(
      generateId,
      textTodo,
      timestamp,
      false
    );
    // object disimpan pada array todos menggunakan push
    todos.push(todoObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
  }

  // berfungsi untuk menghasilkan identitas unik pada setiap item todo.
  function generateId() {
    return +new Date();
  }

  // berfungsi untuk membuat object baru dari data yang sudah disediakan dari inputan
  function generateTodoObject(id, task, timestamp, isCompleted) {
    return {
      id,
      task,
      timestamp,
      isCompleted,
    };
  }

  // function untuk men-render to-do list
  document.addEventListener(RENDER_EVENT, function () {
    const uncompletedTODOList = document.getElementById("todos");
    uncompletedTODOList.innerHTML = "";

    const completedTODOList = document.getElementById('completed-todos');
    completedTODOList.innerHTML ='';

    for (const todoItem of todos) {
      const todoElement = makeTodo(todoItem);
      if(!todoItem.isCompleted){
        uncompletedTODOList.append(todoElement);
      } else {
        completedTODOList.append(todoElement);
      }
    }
  });

  // membuat function makeTodo
  function makeTodo(todoObject) {
    const textTitle = document.createElement("h2");
    textTitle.innerText = todoObject.task;

    const textTimeStamp = document.createElement("p");
    textTimeStamp.innerText = todoObject.timestamp;

    const textContainer = document.createElement("div");
    textContainer.classList.add("inner");
    textContainer.append(textTitle, textTimeStamp);

    const container = document.createElement("div");
    container.classList.add("item", "shadow");
    container.append(textContainer);
    container.setAttribute("id", `todo-${todoObject.id}`);

    // make button
    if(todoObject.isCompleted) {
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function () {
            undoTaskFromCompleted(todoObject.id);
        });

        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function() {
            removeTaskFromCompleted(todoObject.id);
        });

        container.append(undoButton, trashButton);
    } else{
        const checkButton = document.createElement('button');
        checkButton.classList.add('check-button');

        checkButton.addEventListener('click', function() {
            addTaskToCompleted(todoObject.id);
        });

        container.append(checkButton);
    }

    function addTaskToCompleted(todoId) {
        const todoTarget = findTodo(todoId);

        if(todoTarget == null) return;

        todoTarget.isCompleted = true;
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function removeTaskFromCompleted(todoId) {
        const todoTarget = findTodoIndex(todoId);

        if(todoTarget === -1) return;

        todos.splice(todoTarget, 1);
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    function undoTaskFromCompleted(todoId) {
        const todoTarget = findTodo(todoId);

        if(todoTarget == null) return;

        todoTarget.isCompleted = false;
        document.dispatchEvent(new Event(RENDER_EVENT));
    }

    // function untuk mencari todo dengan ID yang sesuai pada array todos.
    function findTodo(todoId){
        for(const todoItem of todos) {
            if(todoItem.id == todoId) {
                return todoItem;
            }
        }

        return null;
    }

    // function untuk mencari indeks dari todoId
    function findTodoIndex(todoId) {
        for(const index in todos){
            if(todos[index].id === todoId){
                return index;
            }
        }

        return -1;
    }    

    return container;
  }
});
