/* DOM Elements */
const studentNameInput = document.getElementById("studentNameInput");
const studentIdInput = document.getElementById("studentIdInput");
const emailInput = document.getElementById("emailInput");
const contactNumberInput = document.getElementById("contactNumberInput");
const btnSubmit = document.getElementById("btnSubmit");
const contentTable = document.getElementById("contentTable");

/* State Variables */
let isEditing = false;
let editingRow = null;

/* Event Listeners and Handlers */
const submitForm = () => {
  const data = {
    studentName: studentNameInput.value,
    studentId: studentIdInput.value,
    email: emailInput.value,
    contactNumber: contactNumberInput.value,
  };

  if (isEditing && editingRow) {
    // Update the existing row's cells with new values
    editingRow.innerHTML = `
      <td class="px-4 py-2">${data.studentName}</td>
      <td class="px-4 py-2">${data.studentId}</td>
      <td class="px-4 py-2">${data.email}</td>
      <td class="px-4 py-2">${data.contactNumber}</td>
      <td class="px-4 py-2 text-center">
        <i class="fa-solid fa-pen-to-square edit-btn text-blue-500 hover:text-blue-700 cursor-pointer"></i>
      </td>
      <td class="px-4 py-2 text-center">
        <i class="fa-solid fa-trash delete-btn text-red-500 hover:text-red-700 cursor-pointer"></i>
      </td>
    `;

    // Reattach event listeners
    editingRow.querySelector(".edit-btn").addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      const rowData = getRowData(row);
      handleEdit(rowData, row);
    });

    editingRow.querySelector(".delete-btn").addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      handleDelete(row);
    });

    // update localStorage
    saveTableToLocalStorage();

    // Reset editing mode
    isEditing = false;
    editingRow = null;
    clearForm();
  } else {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("hover:bg-gray-100", "transition");
    tableRow.setAttribute("data-rowId", data.studentId);

    tableRow.innerHTML = `
      <td class="px-4 py-2">${data.studentName}</td>
      <td class="px-4 py-2">${data.studentId}</td>
      <td class="px-4 py-2">${data.email}</td>
      <td class="px-4 py-2">${data.contactNumber}</td>
      <td class="px-4 py-2 text-center">
        <i class="fa-solid fa-pen-to-square edit-btn text-blue-500 hover:text-blue-700 cursor-pointer"></i>
      </td>
      <td class="px-4 py-2 text-center">
        <i class="fa-solid fa-trash delete-btn text-red-500 hover:text-red-700 cursor-pointer"></i>
      </td>
    `;

    const tableBody = contentTable.querySelector("tbody");
    tableBody.appendChild(tableRow);

    tableRow.querySelector(".edit-btn").addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      const rowData = getRowData(row);
      handleEdit(rowData, row);
    });

    tableRow.querySelector(".delete-btn").addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      handleDelete(row);
    });

    // update localStorage
    saveTableToLocalStorage();

    clearForm();
  }
  
};

btnSubmit.addEventListener("click", (event) => {
  event.preventDefault();
  submitForm();

});

const handleEdit = (data, row) => {
  isEditing = true;
  editingRow = row;
  fillForm(data);
};

const handleDelete = (row) => {
  row.remove();
  saveTableToLocalStorage(); // update after delete
};

const clearForm = () => {
  studentNameInput.value = "";
  studentIdInput.value = "";
  emailInput.value = "";
  contactNumberInput.value = "";
};

const fillForm = (data) => {
  studentNameInput.value = data.studentName;
  studentIdInput.value = data.studentId;
  emailInput.value = data.email;
  contactNumberInput.value = data.contactNumber;
};

const getRowData = (row) => {
  const cells = row.querySelectorAll("td");
  return {
    studentName: cells[0].textContent,
    studentId: cells[1].textContent,
    email: cells[2].textContent,
    contactNumber: cells[3].textContent,
  };
};

/* Local Storage Functions */
const saveTableToLocalStorage = () => {
  const tableBody = contentTable.querySelector("tbody");
  const rows = tableBody.querySelectorAll("tr");
  let dataArr = [];

  rows.forEach((row) => {
    const rowData = getRowData(row);
    dataArr.push(rowData);
  });

  localStorage.setItem("studentsData", JSON.stringify(dataArr));
};

const loadTableFromLocalStorage = () => {
  const dataArr = JSON.parse(localStorage.getItem("studentsData")) || [];
  const tableBody = contentTable.querySelector("tbody");
  tableBody.innerHTML = "";

  dataArr.forEach((data) => {
    const tableRow = document.createElement("tr");
    tableRow.classList.add("hover:bg-gray-100", "transition");
    tableRow.setAttribute("data-rowId", data.studentId);

    tableRow.innerHTML = `
      <td class="px-4 py-2">${data.studentName}</td>
      <td class="px-4 py-2">${data.studentId}</td>
      <td class="px-4 py-2">${data.email}</td>
      <td class="px-4 py-2">${data.contactNumber}</td>
      <td class="px-4 py-2 text-center">
        <i class="fa-solid fa-pen-to-square edit-btn text-blue-500 hover:text-blue-700 cursor-pointer"></i>
      </td>
      <td class="px-4 py-2 text-center">
        <i class="fa-solid fa-trash delete-btn text-red-500 hover:text-red-700 cursor-pointer"></i>
      </td>
    `;

    tableRow.querySelector(".edit-btn").addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      const rowData = getRowData(row);
      handleEdit(rowData, row);
    });

    tableRow.querySelector(".delete-btn").addEventListener("click", (e) => {
      const row = e.target.closest("tr");
      handleDelete(row);
    });

    tableBody.appendChild(tableRow);
  });
};

// Load data on page refresh
window.addEventListener("DOMContentLoaded", loadTableFromLocalStorage);
