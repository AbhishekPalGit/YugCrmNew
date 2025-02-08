import Apicall from "./Apicall.js";
import { AddModal } from "./AddModal.js";
import { Frontconstants, InputObj, UserMenus } from "./Frontconstants.js";
import {getSiteSuperData} from "./SiteSupervisor.js"
import { saveCart } from "./SiteSupervisor.js";
import {getPMData} from "./ProductManager.js";
import {getHOData} from "./HeadOffice.js";
import { concent } from "./concent.js";
import { EditModal } from "./EditModal.js";


let Profile = document.querySelector('.user-content');
let userInfo = JSON.parse(localStorage.getItem("UserInfo"))
console.log(userInfo,"Profile",Profile)
Profile.children[0].innerHTML = userInfo.fname +" "+ userInfo.lname
Profile.children[1].innerHTML = userInfo.roleName 

let Addbutton = document.getElementById("addButton");
let dashboardHeading = document.getElementById("dashHead");
let companyTab = document.getElementById("companyTab");
let siteTab = document.getElementById("siteTab");
let usersTab = document.getElementById("usersTab");
let productTab = document.getElementById("productTab");

let ActiveTab = "";

let cartIcon = document.getElementById("gotocart")
cartIcon?.addEventListener('click',()=>{
  setActiveTab("Cart" , 2)
})

if(localStorage.getItem("UserSpec") !== "SS"){
  cartIcon.style.display ="none"
}
export async function setActiveTab(data , i){
    localStorage.setItem("ActiveTabIndex", i)
 

    Addbutton.innerHTML = `<i class="fa-solid fa-plus"></i>Add ${data}`;
    dashboardHeading.innerHTML = `${data} List`;
    ActiveTab = data;
    let SideMenuTabs = document.querySelectorAll(".sidebar-list");
    SideMenuTabs.forEach(tab => {
      tab.classList.remove("active");
    });
    SideMenuTabs[i].classList.add("active");
    if(localStorage.getItem("UserSpec") === "SA" || localStorage.getItem("UserSpec") === "ADM"){
      getProduct(data)
     }else if(localStorage.getItem("UserSpec") === "SS" ){

        console.log("dbhcbhdbcd111")
        await saveCart("saveCart","save")
        console.log(saveCart,"1111savecart")
      
  
       getSiteSuperData(data)
    
     }else if(localStorage.getItem("UserSpec") === "PM" ){
     
       getPMData(data)
     }else if(localStorage.getItem("UserSpec") === "HO" ){
     
       getHOData(data)
     }
}

async function getMenulist() {
  const userType = localStorage.getItem("UserSpec");
  const mainMenu = document.getElementById("MainMenuSideBar");
  const MenuArr = UserMenus[userType]
  
  if (mainMenu && MenuArr) {
    mainMenu.innerHTML = MenuArr.map((data)=>
      `<li class="sidebar-list" >
        <a class="sidebar-link">
          <svg class="stroke-icon">
            <use href="../assets/svg/iconly-sprite.svg#Paper"></use>
          </svg>
          <h6 class="f-w-600 upperCaseLbl">${data}</h6>
        </a>
      </li>`
    ).join('')
    const listItems = mainMenu.querySelectorAll(".sidebar-list");
    listItems.forEach((item, index) => {
      item.addEventListener("click", () => setActiveTab(MenuArr[index], index));
    });
  } else {
    console.error("MainMenuSideBar element not found!");
  }
}

window.onload =  function () {
  getMenulist()
  changeTab()
};

function changeTab() {
  let SideMenuTabs = document.querySelectorAll(".sidebar-list");
  let MenuArr = UserMenus[localStorage.getItem("UserSpec")];
  const ActiveTabIndex = parseInt(localStorage.getItem("ActiveTabIndex"));

  if (SideMenuTabs.length > 0 && MenuArr) {
    // Clear any existing 'active' class
    SideMenuTabs.forEach((tab) => tab.classList.remove("active"));

    // Check if ActiveTabIndex exists in localStorage
    if (!isNaN(ActiveTabIndex) && ActiveTabIndex >= 0 && ActiveTabIndex < SideMenuTabs.length) {
      // Set the active tab based on the saved index
      SideMenuTabs[ActiveTabIndex].classList.add("active");
      setActiveTab(MenuArr[ActiveTabIndex], ActiveTabIndex);
    } else {
      // Default to the first tab if no valid index is found
      SideMenuTabs[0].classList.add("active");
      setActiveTab(MenuArr[0], 0);
      localStorage.setItem("ActiveTabIndex", 0);
    }
  } else {
    console.error("SideMenuTabs or MenuArr is invalid!");
  }
}
function convertImageToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(',')[1]); // Remove the data URL prefix
    reader.onerror = error => reject(error);
  });
}
Addbutton.addEventListener("click", () => {
  const addPopup = AddModal(InputObj[ActiveTab], ActiveTab);
  const mainWrapper = document.getElementById("mainWrapper");

  // Remove existing modals before adding a new one
  document.querySelectorAll(".modal").forEach((modal) => modal.remove());

  let webloader = document.querySelector(".loader-wrapper");
  if (webloader && ActiveTab !== "company") {
    webloader.style.display = "flex"; // Show loader
  }

  mainWrapper.innerHTML += addPopup;
  const addForm = document.getElementById("addForm");

  addForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    let isValid = true;
    let formData = [];

    for (const el of addForm.elements) {
      if (el.required && !el.value.trim()) {
        el.classList.add("is-invalid");
        isValid = false;
      } else {
        el.classList.remove("is-invalid");
      }

      if (el.type === "file" && el.files.length > 0) {
        formData.push({
          name: el.id,
          value: await convertImageToBase64(el.files[0]), // Convert file to Base64
        });
      } else if (el.type !== "submit") {
        formData.push({
          name: el.id,
          value: el.type === "number" ? parseInt(el.value) : el.value,
        });
      }
    }

    if (!isValid) {
      console.log("Form is invalid. Please fill all required fields.");
      return; 
    }

    console.log("Form is valid. Proceeding with API call...");
    console.log("Filtered Data:", formData);

    // ✅ Call API only if form is valid
    AddProduct(ActiveTab, formData);
  });

  const modal = document.querySelector(".btn-close");
  modal?.addEventListener("click", () => {
    window.location.reload();
  });
});





/// getItem
async function getProduct(tabName) {
  const payload = {
    api_name: Frontconstants[tabName].getApiName,
  };
  try {
    const Apidata = await Apicall(
      Frontconstants[tabName].getApiUrl,
      "POST",
      payload
    );
    console.log("Response company:", Apidata);
    if (Apidata["status"] === "success") {
      let dataArr = Apidata["data"];
      let colArr = Object.keys(dataArr[0]);
      colArr.splice(0,1)
      // colArr.push('Action')
      let tableCol = document.getElementById("tab-col");
      let tableBody = document.getElementById("product-removes");
      tableCol.innerHTML = "";
      // tableCol.innerHTML = `<th >
      //                       <div class="form-check">
      //                         <input class="form-check-input checkbox-primary" type="checkbox" />
      //                       </div>
      //                     </th>`;
      colArr.map((data) => {
        var collName = Frontconstants['cardNames'][localStorage.getItem("UserSpec")][data];
        if (collName != undefined) {
          tableCol.innerHTML += `
                <th> <span class="f-light f-w-600">${collName}</span></th>
            `;
        }
      });
      tableCol.innerHTML += `
                <th> <span class="f-light f-w-600">Action</span></th>
            `;
      tableBody.innerHTML = dataArr
      .map((data) => `
      ${colArr
        .map((colData) =>
          colData !== "ccid" 
            ? `<td>
                ${
                  colData === "image"
                    ? `<img src="${data[colData] || ''}" width="100px" height="100px" alt="${data[colData] || 'Image'}"></img>`
                    : colData === "isactive" || colData === "userActive"
                    ? ( data[colData] == 1 ? `<span class="badge badge-success">Active</span>` :`<span class="badge badge-danger">Inactive</span>`)
                    : `<p class="f-light">${data[colData] || ''}</p>`
                }
              </td>`
            : `<p></p>`
        )
        .join("")}
      <td>
        <div class="product-action">
          <svg class="EditItem" tabName=${tabName}>
            <use href="../assets/svg/icon-sprite.svg#edit-content"></use>
          </svg>
          <svg class="deleteItem" tabName=${tabName}>
            <use href="../assets/svg/icon-sprite.svg#trash1"></use>
          </svg>
        </div>
      </td>
    </tr>
    `)
    
        .join("");
    }

    let deleteItems = document.querySelectorAll(".deleteItem");
    console.log(deleteItems, "deleteItemmm");
    
    deleteItems.forEach((item, index) => {
      console.log(item, "tabbbbbbindex");
    
      item.addEventListener("click", () => {
        console.log(Apidata['data'][index],"something gotcha")
            concent(Apidata['data'][index], tabName)
  
       
      });
    });
   /////
   let EditItems = document.querySelectorAll(".EditItem");
console.log(EditItems, "EditItems");

EditItems.forEach((item, index) => {
  console.log(item, "tabbbbbbindex");

  item.addEventListener("click", () => {
    if (!Apidata || !Apidata['data'] || !Apidata['data'][index]) {
      console.error("Apidata is not available or index is out of range.");
      return;
    }

    console.log(Apidata['data'][index], "something gotcha");

    // Remove existing modals before adding a new one
    document.querySelectorAll(".modal").forEach((modal) => modal.remove());

    const EditModall = EditModal(Apidata['data'][index], tabName);
    const mainWrapper = document.getElementById("mainWrapper");
    let webloader = document.querySelector(".loader-wrapper");
  if (webloader && ActiveTab !== "company") {
    webloader.style.display = "flex"; // Show loader
  }
    mainWrapper.innerHTML += EditModall;

    const editForm = document.getElementById("editForm");
    if (!editForm) {
      console.error("Edit form not found!");
      return;
    }

    editForm.addEventListener("submit", (e) => {
      e.preventDefault();

      let formData = [...editForm.elements].map((el) => ({
        name: el.id,
        value: el.type === "number" ? parseInt(el.value) : el.value,
      }));

      const filteredData = formData.filter((item) => item.name.trim() !== "");
      console.log(filteredData, "filteredDatafilteredData");

      // Perform update logic here instead of recalling EditModal
    });

    const modal = document.querySelector(".btn-close");
    modal?.addEventListener("click", () => {
      location.reload() // Close modal without reloading
    });
  });
});

   /////
  } catch (error) {
    console.error("Error fetching company list:", error);
  }
}
/// delete Item
let deleteIdKey = {
  company: "companyId",
  site: "siteId",
  product: "productId"
};


export async function deleteProduct(obj, tabName) {
  console.log((obj),"hbxhdcbdhcbdhcbdcd", tabName)
  
  const payload = {
    api_name: Frontconstants[tabName].delApiName,
    [deleteIdKey[tabName]]: obj.pid || obj.usrId || obj.siteId || obj.ccid || ""
  }
  try {
    const response = await Apicall(
      Frontconstants[tabName].delApiUrl,
      "POST",
      payload
    );
    if (response.status === "success") {
      console.log("Company deleted successfully");
      alert("Company deleted successfully");
      location.reload();
    } else {
      console.error("Error deleting company:", response.message);
    }
  } catch (error) {
    console.error("Error calling delete API:", error);
  }
}
///add Item
export const AddProduct = async (selectedTab, payloadArr) => {
  console.log(selectedTab, "AddProduct", payloadArr);
  let payload = {
    api_name: Frontconstants[selectedTab].addApiName,
  };
  payloadArr.map((data) => {
    payload[data.name] = data.value;
  });
  console.log("payloadvpayload", payload);
  try {
    const response = await Apicall(Frontconstants[selectedTab].addApiUrl, "POST", payload);
    if (response.status === "success") {
      console.log("Company Added successfully");
      const AddModalResp = document.getElementById("AddModalResp")
      console.log("AddModalRespAddModalResp",AddModalResp)
      AddModalResp.innerHTML += ` <div class="alert alert-light-success" role="alert">
                          <p class="text-success">
                             <a class="alert-link text-success" href="#"></a>${response.message}</p>
                        </div>`
      setTimeout(()=>{
        location.reload()
      },1500)                  
      // alert("Company Added successfully");
      // location.reload();
    } else {
      console.error("Error deleting company:", response.message);
    }
  } catch (error) {
    console.error("Error calling delete API:", error);
  }
};


let LogoutUser = document.getElementById('LogoutUser')
LogoutUser.addEventListener('click',async()=>{
  if(localStorage.getItem("UserSpec") == "SS"){
     await saveCart("saveCart","save", true)
  }else{
    localStorage.setItem('__pledge',null)
    window.location.href = '/'; 
  }
 
})