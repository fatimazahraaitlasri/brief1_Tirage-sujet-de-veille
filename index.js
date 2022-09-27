import { addBusinessDays, format } from "date-fns";


const holidays = {
    "2022-01-01": 1,
    "2022-01-11": 1,
    "2022-10-07": 1,
    "2022-11-06": 1,
    "2022-11-18": 1,
}

// DOM elements
const studentsListEl = document.querySelector("#student .list")
const assignedStudentsEl = document.querySelector("#selected .list")

//  global state
const students = []
const assignedStudents = [];
const studentsByName = {};



//  helper functions
function renderListAtElement(element, list, render) {
    element.innerHTML = list.map(render ?? (item => `<div class="student">
    <p>Name: ${item.name}</p>
    </div>`)).join("");
}







// Random choice handler
const randomBtnEl = document.querySelector("#choose")
randomBtnEl.addEventListener("click", chooseRandomly)


function chooseRandomly() {
    if (!students.length) return;
    const randomIndex = Math.floor(Math.random() * students.length)

    const randomStudent = students.splice(randomIndex, 1)[0];

    let date = addBusinessDays(new Date("2022-10-06"), assignedStudents.length + 1);
    const holiday = holidays[date.toJSON().slice(0,10)]
    if(holiday){
        date = addBusinessDays(date, holiday);
    }
    randomStudent.date = date;
    assignedStudents.push(randomStudent);
    renderListAtElement(assignedStudentsEl, assignedStudents, item => `<div class="student">
    <p><b>Name:</b> ${item.name} <b>Date:</b> ${format(item.date, "PPP")}</p>
    </div>`);

    renderListAtElement(studentsListEl, students)

    if (!students.length) {
        randomBtnEl.style.display = "none";
    }
}


// listen to form submit and add student to list of students
const formEl = document.querySelector("#form")
const inputEl = formEl.querySelector("input")

formEl.addEventListener("submit", e => {
    e.preventDefault()
    addStudent();
})


function addStudent() {
    const name = inputEl.value.trim();
    if (!name || studentsByName[name]) return;

    students.push({ name })
    studentsByName[name] = true;

    inputEl.value = "";
    if (students.length === 1) {
        randomBtnEl.style.display = "revert";
    }
    renderListAtElement(studentsListEl, students);
}