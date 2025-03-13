import { Frontconstants } from "./Frontconstants.js";
import { RoleConstant } from "./Frontconstants.js";
import Apicall from "./Apicall.js"

export const AddModal = (inputArr, tabName) => {
  console.log("inputtARr", inputArr);
  const inputFields = inputArr.map((input) => {
    if (input.type === "file") {
      return `
        <div class="col-md-12">
          <label for="${input.label}" class="form-label">${input.label}</label>
          <input 
            type="${input.type}" 
            class="form-control" 
            id="${input.id}"
            accept=".xls,.xlsx,application/vnd.ms-excel,application/vnd.openxmlformats-officedocument.spreadsheetml.sheet,
               .png,.jpg,.jpeg,image/png,image/jpeg"
            ${input.required ? 'required' : ''}
          >
          ${input.required ? '<div class="invalid-feedback">This field is required.</div>' : ''}
        </div>
      `;
    } else if (input.type !== "dropdown") {
      return `
        <div class="col-md-12">
          <label for="${input.label}" class="form-label">${input.label}</label>
          <input 
            type="${input.type}" 
            class="form-control" 
            id="${input.id}"
            placeholder="${input.placeholder || ''}" 
            ${input.required ? 'required' : ''}
          >
          ${input.required ? '<div class="invalid-feedback">This field is required.</div>' : ''}
        </div>
      `;
    } else {
      return `
        <div class="col-12">
          <label class="form-label" for="validationCustom04">${input.label}</label>
          <select id=${input.id} class="form-select" required="true">
            ${setTimeout(() => {
              getDropdownVal(input.id);
            }, 100)}
          </select>
          <div class="invalid-feedback">Please select a valid state.</div>
          <div class="valid-feedback">Looks's Good!</div>
        </div>
      `;
    }
  }).join('');

  return (`
    <div class="modal fade show customModall" id="exampleModalgetbootstrap" tabindex="-1" aria-labelledby="exampleModalgetbootstrap" aria-modal="true" role="dialog" style="display: block;">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          ${localStorage.getItem('mode') == "light" ? `
            <div class="modal-header" style="background-color:#CCCCCC">
              <h3 class="modal-title fs-5 upperCaseLbl" id="exampleModalLongTitle">Add ${tabName}</h3>
              <button class="btn-close " type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>` : `
            <div class="modal-header" style="background-color:#CCCCCC">
              <h3 class="modal-title fs-5 upperCaseLbl" id="exampleModalLongTitle">Add ${tabName}</h3>
              <button class="btn-close " type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>`
          }
          <div class="modal-toggle-wrapper social-profile text-start dark-sign-up">
            <div class="modal-body">
              <form id="addForm" class="row g-3 needs-validation" novalidate>
                ${inputFields}
                <div class="col-md-12" style="text-align: center;">
                  <div id="AddModalResp" style="margin-bottom:10px"></div>   
                  <button type="submit" class="btn btn-primary upperCaseLbl">Add ${tabName}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  `);
};

document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver((mutationsList, observer) => {
    const addForm = document.getElementById('addForm');
    if (addForm) {
      console.log("addForm", addForm);

      addForm.addEventListener('submit', async function (event) {
        event.preventDefault();

        const requiredFields = addForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.classList.add('is-invalid');
          } else {
            field.classList.remove('is-invalid');
          }
        });

        const emailFields = addForm.querySelectorAll('input[type="email"]');
        emailFields.forEach(emailField => {
          const emailValue = emailField.value.trim();
          if (emailValue && !validateEmail(emailValue)) {
            isValid = false;
            emailField.classList.add('is-invalid');
          } else {
            emailField.classList.remove('is-invalid');
          }
        });

        // Handle image upload
        const imageInput = addForm.querySelector('input[type="file"]');
        let base64Image = null;

        if (imageInput && imageInput.files.length > 0) {
          const file = imageInput.files[0];
          base64Image = await convertImageToBase64(file);
        }

        if (isValid) {
          console.log('Form is valid. Submitting...');

          // Prepare payload
          const payload = {
            // Add other form fields here
            image: base64Image, // Include the Base64 image in the payload
          };

         
        } else {
          console.log('Form is invalid. Please correct the errors.');
        }
      });

      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});

// Function to validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Function to convert image to Base64
function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); // Remove the data URL prefix
    reader.onerror = error => reject(error);
  });
}

// Rest of your existing code...

// Rest of your existing code...

async function getDropdownVal(inputid) {

  if (inputid === "companyId") {
    const payload = {
      api_name: Frontconstants["company"].getApiName,
    };
    try {
      const Apidata = await Apicall(Frontconstants["company"].getApiUrl, "POST", payload,"",true);
      console.log(Apidata, "ApidataApidata");

      let companyId = document.getElementById("companyId"); 
      if (!companyId) {
        console.error("Dropdown element not found!");
        return;
      }

      if (Apidata.status === "success") {
        // Clear existing options except the first "Choose..." option
        companyId.innerHTML = `<option id="comapnyid" selected disabled value="">Choose...</option>`;

        Apidata.data.forEach((data) => {
          let option = document.createElement("option");
          option.value = data.ccid;
          option.textContent = data.ccname;
          companyId.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Error fetching company list:", error);
    }
  }
  if(inputid == "roleId"){
    let rollIdArr = RoleConstant;
    console.log(rollIdArr,"rollIdArr")
    let roleId = document.getElementById("roleId"); 
    if (!roleId) {
      console.error("Dropdown element not found!");
      return;
    }
    roleId.innerHTML = `<option id="roleId" selected disabled value="">Choose...</option>`;
    rollIdArr.forEach((data)=>{
      let option = document.createElement("option");
      option.value = data.roleId;
      option.textContent = data.roleName;
      roleId.appendChild(option);
    })
  }
  if (inputid === "siteId") {
    const payload = {
      api_name: Frontconstants["site"].getApiName,
    };
    try {
      const Apidata = await Apicall(Frontconstants["site"].getApiUrl, "POST", payload,true);
      console.log(Apidata, "ApidataApidata");

      let siteId = document.getElementById("siteId"); 
      if (!siteId) {
        console.error("Dropdown element not found!");
        return;
      }

      if (Apidata.status === "success") {
        // Clear existing options except the first "Choose..." option
        siteId.innerHTML = `<option id="comapnyid" selected disabled value="">Choose...</option>`;

        Apidata.data.forEach((data) => {
          let option = document.createElement("option");
          option.value = data.siteId;
          option.textContent = data.siteName;
          siteId.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Error fetching company list:", error);
    }
  }
}






