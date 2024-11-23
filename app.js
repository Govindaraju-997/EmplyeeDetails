  // Theme Toggle
  const toggleIcon = document.querySelector("#icon");
  toggleIcon.addEventListener("click", ()=>{
    document.body.classList.toggle("dark-theme");
    if(document.body.classList.contains("dark-theme")){
      toggleIcon.src="./Assets/sun.png";
    }
    else{
      toggleIcon.src="./Assets/moon.png";
    }
  })

  


const form = document.querySelector("#employeeForm");
const addEmployeeButton = document.querySelector("#add-btn");

const URL = "http://localhost:3000/employee";

// Variable to track the operation (Add or Edit)
let currentEmployeeId = null;

// Show the form (for both add and edit)
addEmployeeButton.addEventListener("click", () => {
  currentEmployeeId = null; // Set to null for new employee
  form.reset(); // Clear form inputs
  form.style.display = "block";
});

// Handle form submission (Add or Update)
form.addEventListener("submit", async (e) => {
  e.preventDefault();
  form.style.display = "none";

  const formData = new FormData(e.target);
  const employeeData = {
    name: formData.get("name"),
    age: parseInt(formData.get("age")),
    department: formData.get("department"),
    position: formData.get("position"),
    salary: parseFloat(formData.get("salary")),
    phone: formData.get("phone"),
    email: formData.get("email"),
    address: formData.get("address"),
  };

  try {
    if (currentEmployeeId) {
      // Update existing employee
      const response = await fetch(`${URL}/${currentEmployeeId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        alert("Employee updated successfully!");
      } else {
        alert("Failed to update employee.");
      }
    } else {
      // Add new employee
      const response = await fetch(URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(employeeData),
      });

      if (response.ok) {
        alert("Employee added successfully!");
      } else {
        alert("Failed to add employee.");
      }
    }
    // Reload employee list
    getEmployee();
  } catch (error) {
    console.error("Error:", error);
  }
});

// Fetch and Display Employees (GET)
async function getEmployee() {
  try {
    const response = await fetch(URL);
    const employees = await response.json();
    display(employees);
  } catch (error) {
    console.error("Failed to fetch employees:", error);
  }
}
getEmployee();

// Display Employees
function display(employees) {
  const container = document.querySelector("#container");
  container.innerHTML = "";

  employees.map((employee) => {
    const employeeCard = document.createElement("div");
    employeeCard.className = "employee-card";

    const cardInner = document.createElement("div");
    cardInner.className = "card-inner";

    const cardFront = document.createElement("div");
    cardFront.className = "card-front";
    cardFront.innerHTML = `
      <p><strong>Employee ID:</strong> ${employee.id}</p>
      <p><strong>Name:</strong> ${employee.name}</p>
      <p><strong>Age:</strong> ${employee.age}</p>
      <p><strong>Position:</strong> ${employee.position}</p>
      <p><strong>Department:</strong> ${employee.department}</p>
      <p><strong>Salary:</strong> ${employee.salary}</p>
      <p><strong>Phone:</strong> ${employee.phone}</p>
      <p><strong>Email:</strong> ${employee.email}</p>
      <div class="btn-container">
        <button class="edt-btn" data-id="${employee.id}">EDIT</button>
        <button class="del-btn" data-id="${employee.id}">DELETE</button>
        <img src="./Assets/download.png" class="pdf-btn" data-id="${employee.id}"/>
      </div>
    `;

    const cardBack = document.createElement("div");
    cardBack.className = "card-back";
    cardBack.innerHTML = `
      <p><strong>Address:</strong> ${employee.address || "N/A"}</p>
    `;

    cardInner.appendChild(cardFront);
    cardInner.appendChild(cardBack);

    employeeCard.addEventListener("click", () => {
      cardInner.classList.toggle("flipped");
    });

    employeeCard.appendChild(cardInner);
    container.appendChild(employeeCard);
  });

  // Add event listeners for DELETE & EDIT buttons
  document.querySelectorAll(".del-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent flip on button click
      const id = e.target.getAttribute("data-id");
      deleteEmployee(id);
    });
  });

  document.querySelectorAll(".edt-btn").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent flip on button click
      const id = e.target.getAttribute("data-id");
      editEmployee(id);
    });
  });



// Add event listeners for PDF Download buttons
document.querySelectorAll(".pdf-btn").forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.stopPropagation(); // Prevent card flip
    const id = e.target.getAttribute("data-id");
    downloadEmployeePDF(id);
  });
});

// Function to download employee details as a PDF
async function downloadEmployeePDF(id) {
  try {
    const response = await fetch(`${URL}/${id}`);
    const employee = await response.json();

    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    // Add employee details to the PDF
    doc.setFontSize(16);
    doc.text("Employee Details", 10, 10);

    doc.setFontSize(12);
    doc.text(`Employee ID: ${employee.id}`, 10, 20);
    doc.text(`Name: ${employee.name}`, 10, 30);
    doc.text(`Age: ${employee.age}`, 10, 40);
    doc.text(`Position: ${employee.position}`, 10, 50);
    doc.text(`Department: ${employee.department}`, 10, 60);
    doc.text(`Salary: ${employee.salary}`, 10, 70);
    doc.text(`Phone: ${employee.phone}`, 10, 80);
    doc.text(`Email: ${employee.email}`, 10, 90);
    doc.text(`Address: ${employee.address || "N/A"}`, 10, 100);

    // Save the PDF with a meaningful file name
    doc.save(`Employee_${employee.name}_${employee.id}.pdf`);
  } catch (error) {
    console.error("Failed to download PDF:", error);
    alert("Failed to download employee details.");
  }
}



}


// Edit Employee
async function editEmployee(id) {
  try {
    const response = await fetch(`${URL}/${id}`);
    const employee = await response.json();

    // Populate form with employee details
    form.name.value = employee.name;
    form.age.value = employee.age;
    form.department.value = employee.department;
    form.position.value = employee.position;
    form.salary.value = employee.salary;
    form.phone.value = employee.phone;
    form.email.value = employee.email;
    form.address.value = employee.address;

    currentEmployeeId = id; // Set current employee ID for updating
    form.style.display = "block";
  } catch (error) {
    console.error("Failed to fetch employee for editing:", error);
  }
}


// Delete Employee
async function deleteEmployee(id) {
  try {
    const response = await fetch(`${URL}/${id}`, {
      method: "DELETE",
    });

    if (response.ok) {
      alert(`Employee with ID ${id} deleted successfully.`);
      getEmployee(); // Reload employees
    } else {
      alert("Failed to delete employee.");
    }
  } catch (error) {
    console.error("Error deleting employee:", error);
  }
}
  


