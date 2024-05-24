let addInput = document.getElementById("task");
let taskConatiner = document.querySelector(".tasks");
let button = document.querySelector(".icon-btn");
let editBtn = document.querySelector(".editing");
let allLInk = document.querySelector(".all");
let activeLink = document.querySelector(".allactive");
let competeLink = document.querySelector(".compete");
let TaskNameRegex = /[a-zA-Z0-9 _-]{2,}/;


let tasksList = [];
if (window.localStorage.getItem("taskList") != null) {
  tasksList = [...JSON.parse(window.localStorage.getItem("taskList"))];
  displayTasks(tasksList);
}

button.addEventListener("click", () => {
  if(TaskNameRegex.test(addInput.value)){
    let task = {
      taskName: addInput.value,
      isCompete: false,
    };
  
    tasksList.push(task);
    window.localStorage.setItem("taskList", JSON.stringify(tasksList));
    displayTasks(tasksList);
    clearInput();
  }
  else{
    Swal.fire({
      icon: "error",
      title: "Invaild Task Name ",
    });
  }
  
});
function displayTasks(arr) {
  let content = "";
  for (let i = arr.length - 1; i >= 0; i--) {
    content += `
  <div class="task${i} bg-white d-flex justify-content-between p-2 rounded-3 mb-2">
  <p class="taskcontent${i} fs-5 px-2" > ${arr[i].taskName}</p>
  <div class="task-icon d-flex  align-items-center px-2 "data-index=${i}>
    <div class="me-2 text-success  done${i} "><i class="fa-solid fa-check" onclick="taskIsCompelete(${i})"></i></div>
    <div class="me-2 text-info  edit${i}"><i class="fa-regular fa-pen-to-square  " onclick="editTaskName(${i})"></i></div>
    <div class="text-danger delete " ><i class="fa-solid fa-trash-can" onclick="deleteTask(${i})"></i></div>
  </div>
 </div>`;
  }

  taskConatiner.innerHTML = content;
  arr.forEach((value, index) => {
    if (value.isCompete == true) {
      document
        .querySelector(`.taskcontent${index}`)
        .classList.add("text-decoration-line-through");
      document.querySelector(`.done${index}`).classList.add("d-none");
      document.querySelector(`.edit${index}`).classList.add("d-none");
      removeActiveClassForAll();
      addActiveClassToNavLink(allLInk);
    }
  });
}
function clearInput() {
  addInput.value = "";
}

function deleteTask(index) {
  Swal.fire({
    title: "Delete Task",
    text: "Are you sure you want to delete this task?",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "OK",
  }).then((result) => {
    if (result.isConfirmed) {
      tasksList.splice(index, 1);
      $(`.task${index}`).slideUp(100, () => {
        displayTasks(tasksList);
      });

      window.localStorage.setItem("taskList", JSON.stringify(tasksList));
    }
  });
}
async function editTaskName(index) {
  const { value: newTaskName, isConfirmed } = await Swal.fire({
    title: "Edit your Task",
    input: "text",
    inputLabel: "Task Name",
    inputValue: tasksList[index].taskName,
    showCancelButton: true,
    inputValidator: (value) => {
      if (!value) {
        return "You need to write something!";
      }
    },
  });

  if (isConfirmed) {
    edit(index, newTaskName);
  }
}

function edit(index, value) {
  tasksList[index].taskName = value;
  displayTasks(tasksList);
  window.localStorage.setItem("taskList", JSON.stringify(tasksList));
}

function taskIsCompelete(index) {
  let p = document.querySelector(`.taskcontent${index}`);
  p.classList.add("text-decoration-line-through");
  window.localStorage.setItem("taskList", JSON.stringify(tasksList));
  if ($(`.taskcontent${index}`).hasClass("text-decoration-line-through")) {
    tasksList[index].isCompete = true;
    document.querySelector(`.done${index}`).classList.add("d-none");
    document.querySelector(`.edit${index}`).classList.add("d-none");
  } else {
    tasksList[index].isCompete = false;
  }
}

document.querySelector(".nav-menu ul").addEventListener("click", (e) => {
  CheckofLink(e.target);

  
});

function addActiveClassToNavLink(element) {
  element.classList.add("active");
}

function removeActiveClassForAll() {
  allLInk.classList.remove("active");
  activeLink.classList.remove("active");
  competeLink.classList.remove("active");
}
function CheckofLink(elment)
{

  if (elment == allLInk) {
    removeActiveClassForAll();
    addActiveClassToNavLink(elment);
    displayTasks(tasksList);
  }
  // Check if the clicked target is the 'activeLink' element
  else if (elment === activeLink) {
    removeActiveClassForAll();

    addActiveClassToNavLink(elment);

    // Filter tasks to get only the incomplete ones
    let notCompeleTask = tasksList.filter((value) => {
      return value.isCompete == false;
    });

    // If there are incomplete tasks, display them; otherwise, show a message
    if (notCompeleTask.length > 0) {
      displayTasks(notCompeleTask);
    } else {
      taskConatiner.innerHTML = `<p class="text-bold text-center p-2"> No Active Task is Exist </p>`;
    }
  }
  // Check if the clicked target is the 'competeLink' element
  else if (elment== competeLink) {
    removeActiveClassForAll();

    addActiveClassToNavLink(elment);
    // Filter tasks to get only the completed ones
    let compeleTask = tasksList.filter((value) => {
      return value.isCompete == true;
    });

    // If there are completed tasks, display them; otherwise, show a message
    if (compeleTask.length > 0) {
      displayTasks(compeleTask);
    } else {
      taskConatiner.innerHTML = `<p class="text-bold text-center p-2"> No Compelete Task is Exist </p>`;
    }
  }
}
