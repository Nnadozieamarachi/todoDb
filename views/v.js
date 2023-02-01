// var i = [];

document.addEventListener("DOMContentLoaded", function () {
  // document.querySelector(".task").onClick = addTask;
  const checkboxes = document.getElementsByClassName("checkbox");
  const selectedIds = [];

  const newTaskInput = document.getElementById("newTaskInput");

  const todoList = document.getElementById("todo-list");

  function createUi(task, id) {
    const divNode = document.createElement("div");
    const inputNode = document.createElement("input");

    inputNode.setAttribute("type", "checkbox");
    if (id) {
      console.log({ id });
      inputNode.setAttribute("value", id);
    }

    inputNode.classList.add("task", "schedule", "checkbox");
    const labelNode = document.createElement("label");
    labelNode.classList.add("task");
    labelNode.textContent = String(task);
    // const textnode = document.createTextNode(String(task));
    // labelNode.appendChild(textnode);

    divNode.append(inputNode);
    divNode.appendChild(labelNode);

    return divNode;
  }

  // Fetch the list of tasks from the server
  fetch("http://localhost:3002/get-list")
    .then((response) => response.json())
    .then((tasks) => {
      // Iterate over the tasks and create a UI element for each
      tasks.forEach((task) => {
        const newTodoNode = createUi(task.task, task._id);
        todoList.appendChild(newTodoNode);
        console.log(task);

        // Create an array to store the selected ids
        // const task = { task };
      });
      // Iterate through all checkboxes
      for (let i = 0; i < checkboxes.length; i++) {
        checkboxes[i].addEventListener("change", function (e) {
          // If the checkbox is checked
          if (checkboxes[i].checked) {
            console.log({ check: checkboxes[i], e: e.target.value });
            // Add the id to the selectedIds array
            const id = e.target.value;
            selectedIds.push(id);
            console.log(selectedIds);
            // const id = checkboxes[i].getAttribute("data-id");
            if (!id) {
              console.log("Error: Invalid id - " + id);
              return;
            }
            // selectedIds.push(id);
          }
        });
      }
    })
    .catch((error) => console.log(error, "<<< error"));

  // const checkbox_jide = this.getElementsByClassName("checkbox");

  // console.log(checkbox_jide);

  // add new task from user to the database
  function addTask() {
    // event.preventDefault();
    const todo = newTaskInput.value;

    console.log(todo, "<<< todo");

    const newTodoNode = createUi(todo);
    todoList.appendChild(newTodoNode);

    // const result = document.querySelector(".newTask").value;
    // const schedule = document.querySelector(".schedule");
    // for (let i = 0; i < todo.length; i++) {}
    fetch("http://localhost:3002/save-data", {
      method: "POST",
      cors: "no-cors",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ task: todo }),
    })
      .then((response) => response.json())
      .then((response) => console.log(response))
      .catch((error) => console.log(error, "<<< error"));
  }

  const submitbtn = document.getElementById("submitbtn");
  submitbtn.addEventListener("click", addTask);

  function deleteSelected() {
    console.log("i got here");
    // Send DELETE request to the server for each selected id
    const promises = selectedIds.map((id) => {
      return fetch(`http://localhost:3002/activities/${id}`, {
        method: "DELETE",
      });
    });

    // Wait for all the promises to resolve and then update the view
    Promise.all(promises)
      .then((responses) => {
        // Check if all the requests were successful
        for (let response of responses) {
          if (!response.ok) {
            throw new Error("Error deleting data");
          }
        }
        // updateView();
      })
      .catch((error) => console.log(error));
  }

  // Add event listener for when the delete button is clicked
  const deleteBtn = document.getElementById("deleteBtn");
  deleteBtn.addEventListener("click", deleteSelected);

  function updateView() {
    // Iterate through all checkboxes
    for (let i = 0; i < checkboxes.length; i++) {
      // If the checkbox is checked
      if (checkboxes[i].checked) {
        // Get the id of the checkbox
        let id = checkboxes[i].id;
        // Get the div element containing the checkbox
        let div = checkboxes[i].parentNode;
        // Remove the div element from the page
        div.parentNode.removeChild(div);
      }
    }
    // Clear the selectedIds array
    selectedIds.length = 0;
  }
});
