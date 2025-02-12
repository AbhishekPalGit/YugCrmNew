import { Frontconstants, InputObj } from "./Frontconstants.js";
import { RoleConstant } from "./Frontconstants.js";
import Apicall from "./Apicall.js";

export const EditModal = (editData, tabName) => {
  let inputArr = InputObj[tabName];
  console.log(inputArr,editData, "Input Array for Edit Modal");

  const inputFields = inputArr.map((input) => {
    const value = editData[input.id] || editData[input.val] || ""; // Get the value from editData or default to empty string

    return `
      ${input.type !== "dropdown" ? `
        <div class="col-md-12">
          <label for="${input.label}" class="form-label">${input.label}</label>
          <input 
            type="${input.type}" 
            class="form-control" 
            id="${input.id}"
            placeholder="${input.placeholder || ''}" 
            ${input.required ? 'required' : ''}
            value="${value}" 
          >
          ${input.required ? '<div class="invalid-feedback">This field is required.</div>' : ''}
        </div>` : 
        `<div class="col-12">
          <label class="form-label" for="validationCustom04">${input.label}</label>
          <select id=${input.id} class="form-select" required="true">

         ${setTimeout(()=>{
              getDropdownVal(input.id)
         },1000)
      }
      </select>
          <div class="invalid-feedback">Please select a valid state.</div>
          <div class="valid-feedback">Looks's Good!</div>
        </div>`
      }
    `;
  }).join('');

  return `
    <div class="modal fade show customModall" id="exampleModalgetbootstrap" tabindex="-1" aria-labelledby="exampleModalgetbootstrap" aria-modal="true" role="dialog" style="display: block;">
      <div class="modal-dialog" role="document">
        <div class="modal-content">
          ${localStorage.getItem('mode') == "light" ? `
            <div class="modal-header" style="background-color:#CCCCCC">
              <h3 class="modal-title fs-5 upperCaseLbl" id="exampleModalLongTitle">Edit ${tabName}</h3>
              <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>` : `
            <div class="modal-header" style="background-color:#CCCCCC">
              <h3 class="modal-title fs-5 upperCaseLbl" id="exampleModalLongTitle">Edit ${tabName}</h3>
              <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>`
          }
          <div class="modal-toggle-wrapper social-profile text-start dark-sign-up">
            <div class="modal-body">
              <form id="editForm" class="row g-3 needs-validation" novalidate>
                ${inputFields}
                <div class="col-md-12" style="text-align: center;">
                  <div id="EditModalResp" style="margin-bottom:10px"></div>   
                  <button type="submit" class="btn btn-primary upperCaseLbl">Update ${tabName}</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>`;
};

// Function to populate dropdowns
async function populateDropdowns(inputArr, editData) {
  for (const input of inputArr) {
    if (input.type === "dropdown") {
      await getDropdownVal(input.id, editData[input.id]);
    }
  }
}

// Function to validate email format
function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(String(email).toLowerCase());
}

// Event listener for form submission
document.addEventListener("DOMContentLoaded", () => {
  const observer = new MutationObserver((mutationsList, observer) => {
    const editForm = document.getElementById('editForm');
    if (editForm) {
      console.log("editForm", editForm);

      // Add event listener for form submission
      editForm.addEventListener('submit', function (event) {
        event.preventDefault(); // Prevent the form from submitting

        // Validate required fields
        const requiredFields = editForm.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
          if (!field.value.trim()) {
            isValid = false;
            field.classList.add('is-invalid');
          } else {
            field.classList.remove('is-invalid');
          }
        });

        // Validate email fields
        const emailFields = editForm.querySelectorAll('input[type="email"]');
        emailFields.forEach(emailField => {
          const emailValue = emailField.value.trim();
          if (emailValue && !validateEmail(emailValue)) {
            isValid = false;
            emailField.classList.add('is-invalid');
          } else {
            emailField.classList.remove('is-invalid');
          }
        });

        // If all validations pass, submit the form
        if (isValid) {
          console.log('Form is valid. Submitting...');
          // Perform your form submission logic here
          // editForm.submit(); // Uncomment this line to actually submit the form
        } else {
          console.log('Form is invalid. Please correct the errors.');
        }
      });

      observer.disconnect();
    }
  });

  observer.observe(document.body, { childList: true, subtree: true });
});

// Function to get dropdown values
async function getDropdownVal(inputid, selectedValue) {
    console.log(inputid,'inputidddddddd')
  if (inputid === "companyId") {
    const payload = {
      api_name: Frontconstants["company"].getApiName,
    };
    try {
      const Apidata = await Apicall(Frontconstants["company"].getApiUrl, "POST", payload);
      console.log(Apidata, "ApidataApidata");

      let companyId = document.getElementById("companyId");
      if (!companyId) {
        console.error("Dropdown element not found!");
        return;
      }

      if (Apidata.status === "success") {
        companyId.innerHTML = `<option value="" disabled>Choose...</option>`;
        Apidata.data.forEach((data) => {
          let option = document.createElement("option");
          option.value = data.ccid;
          option.textContent = data.ccname;
          if (data.ccid === selectedValue) {
            option.selected = true; // Pre-select the value from editData
          }
          companyId.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Error fetching company list:", error);
    }
  }
  if (inputid === "roleId") {
    let rollIdArr = RoleConstant;
    console.log(rollIdArr, "rollIdArr");
    let roleId = document.getElementById("roleId");
    if (!roleId) {
      console.error("Dropdown element not found!");
      return;
    }
    roleId.innerHTML = `<option value="" disabled>Choose...</option>`;
    rollIdArr.forEach((data) => {
      let option = document.createElement("option");
      option.value = data.roleId;
      option.textContent = data.roleName;
      if (data.roleId === selectedValue) {
        option.selected = true; // Pre-select the value from editData
      }
      roleId.appendChild(option);
    });
  }
  if (inputid === "siteId") {
    const payload = {
      api_name: Frontconstants["site"].getApiName,
    };
    try {
      const Apidata = await Apicall(Frontconstants["site"].getApiUrl, "POST", payload);
      console.log(Apidata, "ApidataApidata");

      let siteId = document.getElementById("siteId");
      if (!siteId) {
        console.error("Dropdown element not found!");
        return;
      }

      if (Apidata.status === "success") {
        siteId.innerHTML = `<option value="" disabled>Choose...</option>`;
        Apidata.data.forEach((data) => {
          let option = document.createElement("option");
          option.value = data.siteId;
          option.textContent = data.siteName;
          if (data.siteId === selectedValue) {
            option.selected = true; // Pre-select the value from editData
          }
          siteId.appendChild(option);
        });
      }
    } catch (error) {
      console.error("Error fetching site list:", error);
    }
  }
}