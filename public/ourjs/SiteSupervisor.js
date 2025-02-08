import { Frontconstants } from "./Frontconstants.js";
import Apicall from "./Apicall.js";
const WholeMainContent = document.getElementById('WholeMainContent')
const cartBadge = document.getElementById('cartBadge')
import { setActiveTab } from "./dashboard.js";

const getFormattedDate = () => {
    const date = new Date();

    const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    const dayName = days[date.getDay()];
    const day = date.getDate();
    const month = months[date.getMonth()];
    const year = date.getFullYear();

    return `${dayName} ${day}, ${month} ${year}`;
};

console.log(getFormattedDate()); // Example: "Wednesday 6, Dec 2022"

async function SiteSupervisor(tabName){
    console.log(Frontconstants[tabName].getApiName)
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
        let cartStatus = priviewCartstatus(Apidata.data.detailed.pending)
        let cartBody = document.getElementById("cartStatusBody")
        cartBody.innerHTML= cartStatus;

        console.log("cartttttttttt222",document.getElementById("cartStatusBody"))
        return Apidata
      }
    } catch (error) {
      console.error("Error fetching company list:", error);
    }
}
function inCrementClick(obj, index){
    let pendingCartArr = localStorage.getItem("cartArr");
    console.log("sgvcgdxvc",obj)
    let tempCartArr = pendingCartArr ? JSON.parse(pendingCartArr) : []
    const isPresent = tempCartArr.some(item => item.pid === obj.pid);
    console.log(isPresent,'isPresent')

    const productTray = document.getElementById('productTray')
    const cartInut = productTray.querySelectorAll('.cartInut');
    cartInut[index].value = parseInt(cartInut[index].value) + 1;
    console.log("cartInutcartInut", cartInut[index].value)

    if(isPresent){
        const index = tempCartArr.findIndex(item => item.pid === obj.pid);
        tempCartArr[index].quantity = tempCartArr[index].quantity + 1;
    }else{
        obj.quantity = 1;
        tempCartArr.push(obj)
    }

    console.log(tempCartArr,"tempCartArrtempCartArr")
    cartBadge.innerHTML = tempCartArr.length
    localStorage.setItem("cartArr", JSON.stringify(tempCartArr))
    // console.log(cartBadge,"cartBadge")
    // const productImg = productTray.querySelectorAll('.product-img');
    // let addedTag = `<div class="ribbon ribbon-success ribbon-right">Added</div>`
    // if(cartInut[index].value > 0){
    //     productImg[index].innerHTML += addedTag
    // }
}
function inCrementClickOnchange(obj, index){
  let pendingCartArr = localStorage.getItem("cartArr");
  console.log("sgvcgdxvc",obj)
  let tempCartArr = pendingCartArr ? JSON.parse(pendingCartArr) : []
  const isPresent = tempCartArr.some(item => item.pid === obj.pid);
  console.log(isPresent,'isPresent')


  const productTray = document.getElementById('productTray')
  const cartInut = productTray.querySelectorAll('.cartInut');
  let inputValue = parseInt(cartInut[index].value);
  console.log("dcdcvdcvdcvdvcdgvcdcdc",typeof(inputValue))
  if (isNaN(inputValue) ) {
    console.log("dbcgcfghcvdfc")
    inputValue = 0;
  }
  cartInut[index].value = parseInt(inputValue);

  
  console.log("tempCartArrtempCartArr2", cartInut[index].value)

  if(isPresent){
      const index = tempCartArr.findIndex(item => item.pid === obj.pid);
      tempCartArr[index].quantity = parseInt(cartInut[index].value) ;
      if(tempCartArr[index].quantity === 0){
        tempCartArr.splice(index, 1);
      }
  }else{
      console.log("abcdddd",parseInt(cartInut[index].value))
      obj.quantity = parseInt(cartInut[index].value);
      tempCartArr.push(obj)
  }

  console.log(tempCartArr,"tempCartArrtempCartArr2222")
  cartBadge.innerHTML = tempCartArr.length
  localStorage.setItem("cartArr", JSON.stringify(tempCartArr))
  // console.log(cartBadge,"cartBadge")
  // const productImg = productTray.querySelectorAll('.product-img');
  // let addedTag = `<div class="ribbon ribbon-success ribbon-right">Added</div>`
  // if(cartInut[index].value > 0){
  //     productImg[index].innerHTML += addedTag
  // }
}


function decrementClick(obj, index){
    let pendingCartArr = localStorage.getItem("cartArr");
    console.log("sgvcgdxvc",obj)
    let tempCartArr = pendingCartArr ? JSON.parse(pendingCartArr) : []
    const isPresent = tempCartArr.some(item => item.pid === obj.pid);
    console.log(isPresent,'isPresent')

    const productTray = document.getElementById('productTray')
    const cartInut = productTray.querySelectorAll('.cartInut');
    cartInut[index].value =cartInut[index].value != 0  ? parseInt(cartInut[index].value) - 1 : 0;
    console.log("cartInutcartInut", cartInut[index].value)

    if(isPresent){
        const index = tempCartArr.findIndex(item => item.pid === obj.pid);
        tempCartArr[index].quantity =tempCartArr[index].quantity > 0 ? tempCartArr[index].quantity - 1 : 0;
        if(tempCartArr[index].quantity === 0){
            tempCartArr.splice(index, 1);
        }
    }

    console.log(tempCartArr,"tempCartArrtempCartArr")
    cartBadge.innerHTML = tempCartArr.length
    localStorage.setItem("cartArr", JSON.stringify(tempCartArr))
}
function addtoCart(data){
    console.log(data,"datatattata")
    // let cartObj= data
    // let cartArr = localStorage.getItem("cartArr") ? localStorage.getItem("cartArr") : [] ;
    // cartArr.push(cartObj)
    // console.log(cartArr,"cartArr")
    // localStorage.setItem("cartArr",cartArr)
}
window.addEventListener('load', () => {
  });

function setcartDetail(data, i){
 console.log(data,"setcartDetail", i)
 let viewProddet = document.getElementById("viewProddet");
 let viewProddesc = document.getElementById("viewProddesc");
 let proddetImg = document.getElementById("proddetImg");
 proddetImg.innerHTML= `<img class="img-fluid" src=${data.imagelink} alt="">`
 viewProddet.innerHTML = data.productname;
 viewProddesc.innerHTML = data.productdesc;
}
let ProductListHtml =(ProductData)=>{
    WholeMainContent.innerHTML = `<div class="product-wrapper">
    
    <div class="search-container" style="margin-bottom: 20px">
        <input type="text" id="searchProduct" class="form-control" placeholder="Search products...">
      </div>
  <div class="product-grid">

    <div class="product-wrapper-grid" style="opacity: 1;">
      <div class="row list-collection" id="productTray">
       kkk

      </div>
      <div style="padding:20px;text-align: right;"><a class="btn btn-success cart-btn-transform" id="gotocart2"> Proceed</a></div>
    </div>
     </div></div>`


let cartIcon2 = document.getElementById("gotocart2")
cartIcon2?.addEventListener('click',()=>{
  setActiveTab("Cart" , 2)
})
const productTray = document.getElementById('productTray')
const renderProducts = (filteredData) => {
  productTray.innerHTML = filteredData.map((data)=>(
    `<div class="col-xl-2">
<div class="card">
<div class="product-box">
  <div class="product-img"><img class="img-fluid" src=${data.imagelink} alt="">
    <div class="product-hover">
      <ul>
        <li class="cartClick"><i class="icon-shopping-cart"></i></li>
        <li>
          <button class="btn" type="button" data-bs-toggle="modal" data-bs-target="#exampleModalCenter"><i class="icon-eye cartEye2"></i></button>
        </li>
      </ul>
    </div>
  </div>
  <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenter" aria-hidden="true">
    <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
     <div class="modal-content" style="background-color:${localStorage.getItem("mode") == "light" ? "#cccccc":"black"}">
        <div class="modal-header border-bottom-0">
          <div class="product-box row">
            <div class="product-img col-lg-6" id=proddetImg></div>
            <div class="product-details col-lg-6 text-start">
                <h4 id="viewProddet">${data.productname}</h4>
              <div class="product-view">
                <h6 class="f-w-700" id="viewProddesc">${data.productdesc}</h6>

              </div>
              
              
            </div>
          </div>
          <button class="btn-close" type="button" data-bs-dismiss="modal" aria-label="Close"></button>
        </div>
      </div>
    </div>
  </div>
  <div class="product-details">
      <p>${data.productname}</p>
  <div class="input-group" style="width:100%;margin-top:10px"> <span style="border-radius:0" class="input-group-text decrement-touchspin Cartdecrement">
                              <svg class="svg-color" style="width:10px;height:10px">
                                <use href="../assets/svg/iconly-sprite.svg#minus"></use>
                              </svg></span>
                            <input class="form-control bg-light-primary input-touchspin cartInut" type="text" pid=${data.pid} value="0" style="padding: 1px;text-align: center;width: 20px;border-radius:0;color:#9C9999 !important"><span style="border-radius:0"  class="input-group-text  increment-touchspin Cartincrement">
                              <svg class="svg-color" style="width:10px;height:10px">
                                <use href="../assets/svg/iconly-sprite.svg#plus"></use>
                              </svg></span>
                          </div>


  </div>
</div>
</div>
</div>`
)).join('')

const cartClick = productTray.querySelectorAll(".cartClick");
const cartIncrement = productTray.querySelectorAll(".Cartincrement")
const cartIncrement2 = productTray.querySelectorAll(".cartClick")
const cartDecrement = productTray.querySelectorAll('.Cartdecrement')
const cartInput = productTray.querySelectorAll('.cartInut');
const viewCart = productTray.querySelectorAll('.cartEye');
const viewCart2 = productTray.querySelectorAll('.cartEye2');
console.log(viewCart,"viewCartviewCart")
let cartArr = JSON.parse(localStorage.getItem('cartArr')) || []

   cartInput.forEach((item, index) => {
    console.log(item, "dcvdhcvhd")
    if(cartArr.length > 0){
        cartArr.map((data)=>{
            if(data.pid == item.getAttribute("pid")){
                item.value = data.quantity
            }
        })
    }
  });

viewCart.forEach((item , i) =>{
  item.addEventListener("click", () => setcartDetail(ProductData[i] , i));
});
viewCart2.forEach((item , i) =>{
    item.addEventListener("click", () => setcartDetail(ProductData[i] , i));
});
cartClick.forEach((item, index) => {
  item.addEventListener("click", () => addtoCart(ProductData[index]));
});

cartIncrement.forEach((item, index)=>{
  item.addEventListener("click", () => inCrementClick(ProductData[index], index));
})
cartIncrement2.forEach((item, index)=>{
    item.addEventListener("click", () => inCrementClick(ProductData[index], index));
  })
cartDecrement.forEach((item, index)=>{
    item.addEventListener("click", () => decrementClick(ProductData[index], index));
  })

  cartInput.forEach((item, index) => {
    item.addEventListener("change", (e) => {
      console.log("Change detected on index:", index,e.target.value);
       inCrementClickOnchange(ProductData[index], index);
    });
  });
}

renderProducts(ProductData);

  const searchInput = document.getElementById("searchProduct");

  searchInput.addEventListener("input", (event) => {
    const query = event.target.value.toLowerCase();
    const filteredProducts = ProductData.filter((item) =>
      item.productname.toLowerCase().includes(query)
    );
    renderProducts(filteredProducts);
  });

   // let removeContainer = document.getElementById('removeContainer')
    // removeContainer.remove();
}


async function getProduct(tabName) {
    console.log(Frontconstants[tabName].getApiName)
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
        let dataArr = Apidata['data']

        let cartArr = []
        dataArr.map((data)=>{
            if(data.quantity > 0){
                cartArr.push(data)
                localStorage.setItem("cartArr", JSON.stringify(cartArr))
                // cartBadge.innerHTML(cartArr.length)
            }
        })
        return dataArr
      }
    } catch (error) {
      console.error("Error fetching company list:", error);
    }
  }

export async function getSiteSuperData(data){
    const WholeMainContent = document.getElementById('WholeMainContent')
    if(data == 'Raise Cart'){
        let ProductData = await getProduct("pendingCart")
        console.log(ProductData, "ProductDataProductDataProductData")
        if(ProductData){
            ProductListHtml(ProductData)
        }
    }else if(data == 'Cart'){
        WholeMainContent.innerHTML = `
        <div class="row">
          <div class="col-sm-12">
            <div class="card">
              <div class="card-header card-no-border pb-0">
                <h3>Cart</h3>
              </div>
              <div class="card-body">
                <div class="row">
                  <div class="order-history table-responsive wishlist">
                    <table class="table table-bordered" id="cartTable">
                      <thead id="cartTablehead"></thead>
                      <tbody id="cartTablebodySS"></tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;

        let cartTablehead = document.getElementById('cartTablehead');
        let cartTablebody = document.getElementById('cartTablebodySS');
        let cartData = JSON.parse(localStorage.getItem('cartArr')); // Retrieve cart data from localStorage

        if (cartData && cartData.length > 0) {
          // Extract table headers from the first object
          let tableHeadArr = Object.keys(cartData[0]);
          // Render table headers
          cartTablehead.innerHTML = `
            <tr>
              ${tableHeadArr.map((key) => `<th>${key}</th>`).join('')}
              <th>Action</th>
            </tr>
          `;

          // Render table body
          cartTablebody.innerHTML = cartData
            .map(
              (item) => `
              <tr calss="cartTableRow">
                ${tableHeadArr.map((key) => {
                    if(key == "quantity"){
                       return `<td>
                       <fieldset class="qty-box">
                                  <div class="input-group bootstrap-touchspin">
                                    <button class="btn btn-primary btn-square bootstrap-touchspin-down cartPageMinus" type="button"><i class="fa-solid fa-minus"></i></button>
                                    <span class="input-group-text bootstrap-touchspin-prefix" style="display: none;"></span>
                                    <input class="touchspin text-center form-control cartPageInput" type="text"   value=${item[key]} style="display: block;">
                                    <span class="input-group-text bootstrap-touchspin-postfix" style="display: none;"></span>
                                    <button class="btn btn-primary btn-square bootstrap-touchspin-up cartPagePlus" type="button"><i class="fa-solid fa-plus"></i></button>
                                  </div>
                                </fieldset>
                       </td>`
                    }else if(key == "imagelink"){
                        return `<td>
                        <img src=${item[key]} width="100px" height="100px" alt="product">
                      </td>`
                    }else{
                       return `<td>${item[key]}</td>`
                    }
                }

                ).join('')}
              <td><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x-circle removeProductCartPage"><circle cx="12" cy="12" r="10"></circle><line x1="15" y1="9" x2="9" y2="15"></line><line x1="9" y1="9" x2="15" y2="15"></line></svg></td>

              </tr>
            `
            )
            .join('');

            cartTablebody.innerHTML += `<tr>
                              <td class="text-end" colspan="10"><a class="btn btn-success cart-btn-transform"  id="submitCart">submit</a></td>

                            </tr>`

        }else{
            cartTablebody.innerHTML =`<h3>Your Cart Is Empty !</h3>`
        }

        const cartPageInput = cartTablebody.querySelectorAll(".cartPageInput");
        const cartPageMinus = cartTablebody.querySelectorAll(".cartPageMinus");
        const cartPagePlus = cartTablebody.querySelectorAll(".cartPagePlus");
        const removeProductCartPage = cartTablebody.querySelectorAll(".removeProductCartPage");
        const updateLocalStorage = () => {
            localStorage.setItem("cartArr", JSON.stringify(cartData));
            cartBadge.innerHTML= JSON.parse(localStorage.getItem("cartArr")).length
        };

        // Remove from cart logic
        const removeCartPage = (data, index) => {
            console.log(`Removing product at index: ${index}`, data);

            if (parseInt(data.quantity) === 1) {
                // Remove item from DOM and array
                cartTablebody.removeChild(cartTablebody.children[index]);
                cartData.splice(index, 1);
                updateLocalStorage();
                setTimeout(() => {
                    location.reload();
                  }, 600);
            } else {
                // Decrease quantity
                cartPageInput[index].value = parseInt(cartPageInput[index].value) - 1;
                cartData[index].quantity = parseInt(cartData[index].quantity) - 1;
            }
            updateLocalStorage();
        };

        // Completely remove product from cart
        const removeProduct = (data, index) => {
            cartTablebody.removeChild(cartTablebody.children[index]);
            cartData.splice(index, 1);
            updateLocalStorage();
            setTimeout(() => {
                location.reload();
              }, 100);
        };

        // Add to cart logic
        const addCartPage = (data, index) => {
            cartPageInput[index].value = parseInt(cartPageInput[index].value) + 1;
            cartData[index].quantity = parseInt(cartPageInput[index].value);
            updateLocalStorage();
        };
        const addCartPageOnchange = (data , index)=>{
          console.log("addCartPageOnchange", cartPageInput[index].value)
          if ( !cartPageInput[index].value) {  // ✅ Correct way to check for NaN
            console.log("Input is NaN, setting to 0");
            cartPageInput[index].value = 0;
          }
          cartData[index].quantity = parseInt(cartPageInput[index].value);
          updateLocalStorage();
        }

        // Attach event listeners
        removeProductCartPage.forEach((item, index) => {
            item.addEventListener("click", () => removeProduct(cartData[index], index));
        });
        cartPageMinus.forEach((item, index) => {
            item.addEventListener("click", () => removeCartPage(cartData[index], index));
        });
        cartPagePlus.forEach((item, index) => {
            item.addEventListener("click", () => addCartPage(cartData[index], index));
        });
        cartPageInput.forEach((item, index) => {
          item.addEventListener("change", () => addCartPageOnchange(cartData[index], index));
      });
        const submitCart = document.getElementById('submitCart')

        if(submitCart != null){
            submitCart.addEventListener('click', async () => {
                try {
                  const response = await saveCart("saveCart", "submit");
                  console.log("API Response:", response);

                  // Clear localStorage after a successful API call
                  localStorage.setItem("cartArr", JSON.stringify([]));
                  cartTablehead.innerHTML= ""
                  cartTablebody.innerHTML = `<h6> Yor Cart Submitted Succesfully </h6>`
                } catch (error) {
                  console.error("Error in saveCart:", error);
                }
              });
        }



}
    else if(data == 'Home'){
        WholeMainContent.innerHTML=`<div class="container-fluid default-dashboard">
            <div class="row">
              <div class="col-xxl-4 col-xl-4 proorder-xxl-7 col-lg-12 box-col-12">
                <div class="card job-card">
                  <div class="card-header pb-0 card-no-border">
                    <div class="header-top">
                      <h3>Cart Tracker</h3>
                      <div>
                        <p id="dash-currDate">Wednesday 6, <span>Dec 2022</span></p>
                      </div>
                    </div>
                  </div>
                  <div class="card-body pt-2">
                    <ul class="align-center justify-content-center gap-3 " id="cartTraker" style="
    display: flex;
    justify-content: space-around;
    flex-direction: column;
">

                    </ul>
                    <div class="table-responsive theme-scrollbar" >

                    </div>
                  </div>
                </div>
              </div>
              <div class="col-xxl-8 col-xl-10 proorder-xxl-8 col-lg-12 col-md-6 box-col-7">
                <div class="card">
                  <div class="card-header card-no-border pb-0">
                    <h3>Cart History</h3>
                  </div>
                  <div class="card-body transaction-history pt-0">
                    <div class="table-responsive theme-scrollbar" style="max-height:380px">
                      <div id="transaction_wrapper" class="dataTables_wrapper no-footer"><div id="transaction_filter" class="dataTables_filter"><label>Search:<input type="search" class="" placeholder="" aria-controls="transaction"></label></div><table class="table display table-bordernone dataTable no-footer" id="transaction" style="width: 100%;" role="grid">

   <thead>
    <tr role="row">
     <th class="sorting_disabled" rowspan="1" colspan="1" >Id</th>
     <th class="sorting_disabled" rowspan="1" colspan="1" >Status</th>
     <th class="sorting_disabled" rowspan="1" colspan="1" >Status</th>
     <th class="sorting_disabled" rowspan="1" colspan="1" >Created By</th>
     <th class="sorting_disabled" rowspan="1" colspan="1" >Date</th>
     <th class="sorting_disabled" rowspan="1" colspan="1" >Site Name</th>
     <th class="text-center sorting_disabled" rowspan="1" colspan="1" >View</th>
   </tr>
 </thead>
                        <tbody id="cartStatusBody">






                        </tbody>
                      </table></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="appendCart"></div>
          </div>`
        let currentdate = getFormattedDate()
        let currDateDashboard = document.getElementById("dash-currDate")
        if(currDateDashboard){
            currDateDashboard.innerHTML = currentdate
        }
        let SiteSupervisorData = await SiteSupervisor("SiteSupervisor")
        console.log(SiteSupervisorData,"SiteSupervisorData")
        const cartTraker = document.getElementById("cartTraker")
        if(SiteSupervisorData){
            let summary = SiteSupervisorData.data.summary
            let sumArr = Object.keys(summary)
            cartTraker.innerHTML = sumArr.map((data)=>{
                return ` <li>
                        <div class="d-flex gap-2">
                          <div class="flex-shrink-0 bg-light-warning">
                            <svg class="stroke-icon">
                              <use href="../assets/svg/icon-sprite.svg#hours-work"></use>
                            </svg>
                          </div>
                          <div class="flex-grow-1">
                            <h3>${summary[data]}</h3>
                            <p>${data} Cart </p>
                          </div>
                        </div>
                      </li>`
            }).join('')


            console.log(cartTraker.children[0],"edeeededede")
            cartTraker.children[0].classList.add('activecartTab');
            let tabs = cartTraker.children;

            tabs.forEach((item, index)=>{
             item.addEventListener("click", () => {
                Array.from(cartTraker.children).forEach((child) => {
                    child.classList.remove('activecartTab');
                });
                cartTraker.children[index].classList.add('activecartTab');

                console.log("ggggghhhjjjkkkk",SiteSupervisorData.data.detailed[sumArr[index]],sumArr[index])

                let cartStatus = priviewCartstatus(SiteSupervisorData.data.detailed[sumArr[index]])
                let cartBody = document.getElementById("cartStatusBody")
                cartBody.innerHTML= cartStatus;
            });
            })



        }


    }
}


export async function saveCart(tabName,type ,logout) {
    console.log("svaeAPAPPAPA", JSON.parse(localStorage.getItem('cartArr')))
    const payload = {
        api_name: Frontconstants[tabName].getApiName,
        action: type,
        siteId: 1,
        items:JSON.parse(localStorage.getItem('cartArr'))
    };
    try {
        if (JSON.parse(localStorage.getItem('cartArr')).length > -1) {
          const Apidata = await Apicall(
            Frontconstants[tabName].getApiUrl,
            "POST",
            payload
          );
          console.log("Response company:", Apidata);
          if (Apidata["status"] === "success") {
            // alert(`data ${type} succesfully`)
            if(logout){
                localStorage.setItem('__pledge',null)
                window.location.href = '/'; 
            }
            cartBadge.innerHTML = JSON.parse(localStorage.getItem("cartArr")).length
            return true
          } 
        }
        if(logout){
            localStorage.setItem('__pledge',null)
            window.location.href = '/'; 
        }
    } catch (error) {
      console.error("Error fetching company list:", error);
    }
}
window.viewSpecificCartSS = function (gotdata, index) {
    console.log("Viewing specific cart:", gotdata);
    let statusBtn = document.querySelectorAll(".viewSpecificCartSS");

  statusBtn.forEach((btn) => {
    btn.innerHTML = "View Cart";
    console.log("Class List:", btn.classList);

    // Corrected class check using .contains()
    if (btn.classList.contains('text-success')) {
      btn.classList.remove("bg-light-success", "border-light-success", "text-success");
      btn.classList.add("bg-light-warning", "border-light-warning", "text-warning"); // Changed last class for clarity
    }
  });

  if (index >= 0 && index < statusBtn.length) {
    statusBtn[index].innerHTML = "Viewing";
    statusBtn[index].classList.remove("bg-light-warning", "border-light-warning", "text-warning");
    statusBtn[index].classList.add("bg-light-success", "border-light-success", "text-success");
  }
    let pageBody = document.querySelector(".appendCart");
    let data = gotdata.items;

    // Handle empty data
    if (!data || data.length === 0) {
      pageBody.innerHTML = `<div class="container-fluid">
        <div class="row">
          <div class="col-sm-12">
            <div class="card">
              <div class="card-header card-no-border pb-0">
                <h3>Cart</h3>
              </div>
              <div class="card-body text-center">
                <p>Your cart is empty.</p>
              </div>
            </div>
          </div>
        </div>
      </div>`;
      return;
    }

    // Generate table headers and rows
    let tableHeaders = Object.keys(data[0]);
    // gotdata.cartstage === "S" && tableHeaders.push("Action")
    console.log(gotdata,"dcbdgcvdgcvdgcvgdcvgdcvgdc")
    let tableBodyRows = data.map((item) => {
        return `<tr>${tableHeaders
          .map((key) => {
            if (key === "qty" && gotdata.cartstage =="S" ) {
              return `
                <td>
                  <fieldset class="qty-box">
                    <div class="input-group bootstrap-touchspin">
                      <button class="btn btn-primary btn-square bootstrap-touchspin-down cartPageMinus" type="button">
                        <i class="fa-solid fa-minus"></i>
                      </button>
                      <span class="input-group-text bootstrap-touchspin-prefix" style="display: none;"></span>
                      <input class="touchspin text-center form-control cartPageInput" type="text" value="${item[key] ?? 1}" style="display: block;">
                      <span class="input-group-text bootstrap-touchspin-postfix" style="display: none;"></span>
                      <button class="btn btn-primary btn-square bootstrap-touchspin-up cartPagePlus" type="button">
                        <i class="fa-solid fa-plus"></i>
                      </button>
                    </div>
                  </fieldset>
                </td>`;
            } else {
              return `<td>${item[key] ?? ""}</td>`; // Handle undefined/null values safely
            }
          })
          .join("")}
          </tr>`;
      });


    // Append the cart table to the page
    let cartTable = `<table class="table table-bordered">
      <thead>
        <tr>${tableHeaders.map((header) => `<th>${header}</th>`).join("")}</tr>
      </thead>
      <tbody id ="specificCartBody">
        ${tableBodyRows.join("")}
       
      </tbody>
    </table>`;



    pageBody.innerHTML = `<div class="container-fluid id="cartSpec">
      <div class="row">
        <div class="col-sm-12">
          <div class="card">
            <div class="card-header card-no-border pb-0">
              <h3>Cart</h3>
            </div>
            <div class="card-body">
              <div class="row">
                <div class="order-history table-responsive wishlist">
                  ${cartTable}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>`;
    window.scrollTo({
      top: 1000, // Scroll to 500px from the top
      behavior: "smooth" // Smooth scrolling animation
    });

    if (gotdata.cartstage === "S") {
        document.getElementById("rejectButton").addEventListener("click", () => {
          callApproveCart(gotdata, "reject");
        });

        document.getElementById("approveButton").addEventListener("click", () => {
          callApproveCart(gotdata, "approve");
        });
      }
    // Smooth scroll slightly up
   
  };
  const cartStatusObj={
    "P":"Pending",
    "A":"Approved",
    "R":"Rejected",
    "S":"Task"
  }



  function priviewCartstatus(Cartdata) {

    console.log("Cart Data:", Cartdata);
    let cartBody = Cartdata.map((data, index) => {
        return `<tr role="row" class="odd">
                    <td>${data.cartid}</td>
                    <td>h</td>
                    <td class="text-success">${cartStatusObj[data.cartstage]}</td>
                    <td >${data.createdby}</td>
                    <td>
                        <div class="d-flex">
                            <div class="flex-grow-1">
                                <h6>${data.createddt}</h6>
                            </div>
                        </div>
                    </td>
                    <td>${data.csname}</td>
                    <td class="text-end">
                        <div
                            onClick='viewSpecificCartSS(${JSON.stringify(data)}, ${index})'
                            class="btn bg-light-warning border-light-warning text-warning viewSpecificCartSS">
                            View Cart
                        </div>
                    </td>
                </tr>`;
    });

    return Cartdata.length > 0 ? cartBody.join("") : "<h3>No cart available</h3>"; // Combine all rows into a single string
}

