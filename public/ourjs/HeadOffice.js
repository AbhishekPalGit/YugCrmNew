import { Frontconstants } from "./Frontconstants.js";
import Apicall from "./Apicall.js";
import {purchaseOrder} from "./purchaseOrder.js"
const WholeMainContent = document.getElementById('WholeMainContent')
const cartBadge = document.getElementById('cartBadge')

const mainWrapper = document.getElementById("mainWrapper");
console.log(mainWrapper,"cdcdvgchdvcdc")
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

async function Hodashboard(tabName){
  
    console.log(Frontconstants[tabName].getApiName,Frontconstants[tabName].getApiUrl,tabName,"sdcdhvcdgvcdgvcdc")
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


let ProductListHtml =(ProductData)=>{
    WholeMainContent.innerHTML = `<div class="product-wrapper">
  <div class="product-grid">
    <div class="feature-products">
      <div class="row">
        <div class="col-md-6 products-total">
          <div class="square-product-setting d-inline-block"><a class="icon-grid grid-layout-view" href="#" data-original-title="" title=""><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-grid"><rect x="3" y="3" width="7" height="7"></rect><rect x="14" y="3" width="7" height="7"></rect><rect x="14" y="14" width="7" height="7"></rect><rect x="3" y="14" width="7" height="7"></rect></svg></a></div>
          <div class="square-product-setting d-inline-block"><a class="icon-grid m-0 list-layout-view" href="#" data-original-title="" title=""><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-list"><line x1="8" y1="6" x2="21" y2="6"></line><line x1="8" y1="12" x2="21" y2="12"></line><line x1="8" y1="18" x2="21" y2="18"></line><line x1="3" y1="6" x2="3.01" y2="6"></line><line x1="3" y1="12" x2="3.01" y2="12"></line><line x1="3" y1="18" x2="3.01" y2="18"></line></svg></a></div><span class="d-none-productlist filter-toggle">
                Filters<span class="ms-2"><svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-chevron-down toggle-data"><polyline points="6 9 12 15 18 9"></polyline></svg></span></span>
          <div class="grid-options d-inline-block">
            <ul>
              <li><a class="product-2-layout-view" href="#" data-original-title="" title=""><span class="line-grid line-grid-1 bg-primary"></span><span class="line-grid line-grid-2 bg-primary"></span></a></li>
              <li><a class="product-3-layout-view" href="#" data-original-title="" title=""><span class="line-grid line-grid-3 bg-primary"></span><span class="line-grid line-grid-4 bg-primary"></span><span class="line-grid line-grid-5 bg-primary"></span></a></li>
              <li><a class="product-4-layout-view" href="#" data-original-title="" title=""><span class="line-grid line-grid-6 bg-primary"></span><span class="line-grid line-grid-7 bg-primary"></span><span class="line-grid line-grid-8 bg-primary"></span><span class="line-grid line-grid-9 bg-primary"></span></a></li>
              <li><a class="product-6-layout-view" href="#" data-original-title="" title=""><span class="line-grid line-grid-10 bg-primary"></span><span class="line-grid line-grid-11 bg-primary"></span><span class="line-grid line-grid-12 bg-primary"></span><span class="line-grid line-grid-13 bg-primary"></span><span class="line-grid line-grid-14 bg-primary"></span><span class="line-grid line-grid-15 bg-primary"></span></a></li>
            </ul>
          </div>
        </div>
        <div class="col-md-6 text-sm-end"><span class="f-w-600 m-r-5">Showing Products 1 - 24 Of 200 Results</span>
          <div class="select2-drpdwn-product select-options d-inline-block">
            <select class="form-control btn-square" name="select">
              <option value="opt1">Featured</option>
              <option value="opt2">Lowest Prices</option>
              <option value="opt3">Highest Prices</option>
            </select>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-3">
          <div class="product-sidebar">
            <div class="filter-section">
              <div class="card">
                <div class="card-header">
                  <h6 class="mb-0 f-w-600">Filters<span class="pull-right"><i class="fa-solid fa-angle-down toggle-data"></i></span></h6>
                </div>
                <div class="left-filter">
                  <div class="card-body filter-cards-view animate-chk">
                    <div class="product-filter">
                      <h6 class="f-w-700">Category</h6>
                      <div class="checkbox-animated mt-0">
                        <label class="d-block" for="edo-ani5">
                          <input class="checkbox_animated" id="edo-ani5" type="checkbox" data-original-title="" title="">Man Shirt
                        </label>
                        <label class="d-block" for="edo-ani6">
                          <input class="checkbox_animated" id="edo-ani6" type="checkbox" data-original-title="" title="">Man Jeans
                        </label>
                        <label class="d-block" for="edo-ani7">
                          <input class="checkbox_animated" id="edo-ani7" type="checkbox" data-original-title="" title="">Woman Top
                        </label>
                        <label class="d-block" for="edo-ani8">
                          <input class="checkbox_animated" id="edo-ani8" type="checkbox" data-original-title="" title="">Woman Jeans
                        </label>
                        <label class="d-block" for="edo-ani9">
                          <input class="checkbox_animated" id="edo-ani9" type="checkbox" data-original-title="" title="">Man T-shirt
                        </label>
                      </div>
                    </div>
                    <div class="product-filter">
                      <h6 class="f-w-700">Brand</h6>
                      <div class="checkbox-animated mt-0">
                        <label class="d-block" for="chk-ani">
                          <input class="checkbox_animated" id="chk-ani" type="checkbox" data-original-title="" title=""> Levi's
                        </label>
                        <label class="d-block" for="chk-ani1">
                          <input class="checkbox_animated" id="chk-ani1" type="checkbox" data-original-title="" title="">Diesel
                        </label>
                        <label class="d-block" for="chk-ani2">
                          <input class="checkbox_animated" id="chk-ani2" type="checkbox" data-original-title="" title="">Lee
                        </label>
                        <label class="d-block" for="chk-ani3">
                          <input class="checkbox_animated" id="chk-ani3" type="checkbox" data-original-title="" title="">Hudson
                        </label>
                        <label class="d-block" for="chk-ani4">
                          <input class="checkbox_animated" id="chk-ani4" type="checkbox" data-original-title="" title="">Denizen
                        </label>
                        <label class="d-block" for="chk-ani5">
                          <input class="checkbox_animated" id="chk-ani5" type="checkbox" data-original-title="" title="">Spykar
                        </label>
                      </div>
                    </div>
                    <div class="product-filter slider-product">
                      <h6 class="f-w-700">Colors</h6>
                      <div class="color-selector">
                        <ul>
                          <li class="white"></li>
                          <li class="gray"></li>
                          <li class="black"></li>
                          <li class="orange"></li>
                          <li class="green"></li>
                          <li class="pink"></li>
                          <li class="yellow"></li>
                          <li class="blue"></li>
                          <li class="red"></li>
                        </ul>
                      </div>
                    </div>
                    <div class="product-filter pb-0">
                      <h6 class="f-w-700">Price</h6>
                      <div class="slider-container">
                        <input class="slider" id="slider6" type="text" style="display: none;"><div class="rs-container"><div class="rs-bg"></div><div class="rs-selected" style="width: 180px; left: 36px;"></div><div class="rs-scale"><span style="width: 36px;"><ins style="margin-left: -5.5px;">10</ins></span><span style="width: 36px;"><ins style="margin-left: -5.5px;">20</ins></span><span style="width: 36px;"><ins style="margin-left: -5.5px;">30</ins></span><span style="width: 36px;"><ins style="margin-left: -5.5px;">40</ins></span><span style="width: 36px;"><ins style="margin-left: -5.5px;">50</ins></span><span style="width: 36px;"><ins style="margin-left: -5.5px;">60</ins></span><span style="width: 36px;"><ins style="margin-left: -5.5px;">70</ins></span><span style="width: 36px;"><ins style="margin-left: -5.5px;">80</ins></span></div><div class="rs-pointer" data-dir="left" style="left: 30.5px;"></div><div class="rs-pointer" data-dir="right" style="left: 210.5px;"></div></div>
                      </div>
                    </div>
                    <div class="product-filter pb-0 product-page">
                      <h6 class="f-w-700">New Products</h6>
                      <div class="swiper-container swiper-initialized swiper-horizontal swiper-backface-hidden">
                        <div class="swiper-wrapper" id="testimonial" aria-live="polite">
                          <div class="swiper-slide swiper-slide-active" role="group" aria-label="1 / 2" data-swiper-slide-index="0" style="width: 280px; margin-right: 10px;">
                            <div class="product-box row">
                              <div class="product-img col-md-5"><img class="img-fluid img-100" src="../assets/images/ecommerce/01.jpg" alt="" data-original-title="" title=""></div>
                              <div class="product-details col-md-7 text-start"><span><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning"></i></span>
                                <p class="mb-0">Woman T-shirt</p>
                                <div class="product-price">$100.00</div>
                              </div>
                            </div>
                            <div class="product-box row">
                              <div class="product-img col-md-5"><img class="img-fluid img-100" src="../assets/images/ecommerce/02.jpg" alt="" data-original-title="" title=""></div>
                              <div class="product-details col-md-7 text-start"><span><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning"></i></span>
                                <p class="mb-0">Beauty Fashion</p>
                                <div class="product-price">$150.00</div>
                              </div>
                            </div>
                            <div class="product-box row">
                              <div class="product-img col-md-5"><img class="img-fluid img-100" src="../assets/images/ecommerce/03.jpg" alt="" data-original-title="" title=""></div>
                              <div class="product-details col-md-7 text-start"><span><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning"></i></span>
                                <p class="mb-0">VOXATI</p>
                                <div class="product-price">$200.00</div>
                              </div>
                            </div>
                          </div>
                          <div class="swiper-slide swiper-slide-next" role="group" aria-label="2 / 2" data-swiper-slide-index="1" style="width: 280px; margin-right: 10px;">
                            <div class="product-box row">
                              <div class="product-img col-md-5"><img class="img-fluid img-100" src="../assets/images/ecommerce/04.jpg" alt="" data-original-title="" title=""></div>
                              <div class="product-details col-md-7 text-start"><span><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning"></i></span>
                                <p class="mb-0">Fancy Shirt</p>
                                <div class="product-price">$100.00</div>
                              </div>
                            </div>
                            <div class="product-box row">
                              <div class="product-img col-md-5"><img class="img-fluid img-100" src="../assets/images/ecommerce/05.jpg" alt="" data-original-title="" title=""></div>
                              <div class="product-details col-md-7 text-start"><span><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning"></i></span>
                                <p class="mb-0">Fancy Shirt</p>
                                <div class="product-price">$100.00</div>
                              </div>
                            </div>
                            <div class="product-box row">
                              <div class="product-img col-md-5"><img class="img-fluid img-100" src="../assets/images/ecommerce/06.jpg" alt="" data-original-title="" title=""></div>
                              <div class="product-details col-md-7 text-start"><span><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning me-1"></i><i class="fa-solid fa-star font-warning"></i></span>
                                <p class="mb-0">Fancy Shirt</p>
                                <div class="product-price">$100.00  </div>
                              </div>
                            </div>
                          </div>
                        </div>
                        <div class="swiper-button-next" tabindex="0" role="button" aria-label="Next slide" aria-controls="testimonial"></div>
                        <div class="swiper-button-prev" tabindex="0" role="button" aria-label="Previous slide" aria-controls="testimonial"></div>
                      <span class="swiper-notification" aria-live="assertive" aria-atomic="true"></span></div>
                    </div>
                    <div class="product-filter text-center"><img class="img-fluid banner-product" src="../assets/images/ecommerce/banner.jpg" alt="" data-original-title="" title=""></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-md-9 col-sm-12">
          <form>
            <div class="form-group m-0"> 
              <input class="form-control" type="search" placeholder="Search.." data-original-title="" title=""><i class="fa-solid fa-magnifying-glass"></i>
            </div>
          </form>
        </div>
      </div>
    </div>
    <div class="product-wrapper-grid" style="opacity: 1;">
      <div class="row list-collection" id="productTray">
       kkk
       
      </div>
    </div>
     </div></div>`
const productTray = document.getElementById('productTray')
if(productTray){
    productTray.innerHTML = ProductData.map((data)=>(
        `<div class="col-xl-2">
  <div class="card">
    <div class="product-box">
      <div class="product-img"><img class="img-fluid" src="../assets/images/ecommerce/01.jpg" alt="">
        <div class="product-hover">
          <ul>
            <li class="cartClick"><i class="icon-shopping-cart"></i></li>
            <li>
              <button class="btn" type="button" data-bs-toggle="modal" data-bs-target="#exampleModalCenter"><i class="icon-eye"></i></button>
            </li>
          </ul>
        </div>
      </div>
      <div class="modal fade" id="exampleModalCenter" tabindex="-1" role="dialog" aria-labelledby="exampleModalCenter" aria-hidden="true">
        <div class="modal-dialog modal-lg modal-dialog-centered" role="document">
          <div class="modal-content">
            <div class="modal-header border-bottom-0">
              <div class="product-box row">
                <div class="product-img col-lg-6"><img class="img-fluid" src="../assets/images/ecommerce/01.jpg" alt=""></div>
                <div class="product-details col-lg-6 text-start">
                  <h4>${data.productname}</h4>
                  <div class="product-view">
                    <h6 class="f-w-700">Product Details</h6>
                    
                  </div>
                  <div class="product-size">
                    <ul>
                      <li> 
                        <button class="btn btn-outline-light" type="button">M</button>
                      </li>
                      <li> 
                        <button class="btn btn-outline-light" type="button">L</button>
                      </li>
                      <li> 
                        <button class="btn btn-outline-light" type="button">Xl</button>
                      </li>
                    </ul>
                  </div>
                  <div class="product-qnty">
                    <h6 class="f-w-700">Quantity</h6>
                    <fieldset>
                      <div class="input-group bootstrap-touchspin">
                        <button class="btn btn-primary btn-square bootstrap-touchspin-down" type="button"><i class="fa-solid fa-minus"></i></button><span class="input-group-text bootstrap-touchspin-prefix" style="display: none;"></span><input class="touchspin text-center form-control" type="text" value="5" style="display: block;"><span class="input-group-text bootstrap-touchspin-postfix" style="display: none;"></span><button class="btn btn-primary btn-square bootstrap-touchspin-up" type="button"><i class="fa-solid fa-plus"></i></button>
                      </div>
                    </fieldset>
                    <div class="addcart-btn"><a class="btn btn-primary" href="cart.html">Add to Cart</a><a class="btn btn-primary ms-2" href="product-page.html">View Details</a></div>
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
                                <input class="form-control bg-light-primary input-touchspin cartInut" type="text" pid=${data.pid} value="0" style="padding: 1px;text-align: center;width: 20px;border-radius:0"><span style="border-radius:0"  class="input-group-text  increment-touchspin Cartincrement"> 
                                  <svg class="svg-color" style="width:10px;height:10px">
                                    <use href="../assets/svg/iconly-sprite.svg#plus"></use>
                                  </svg></span>
                           <div data-bs-toggle="modal" data-bs-target="#exampleModalCenter" style="margin-left: 10px;margin-top: 4px;"><i class="icon-eye"></i></div>

                              </div>

       
      </div>
    </div>
  </div>
</div>`
    )).join('')

    const cartClick = productTray.querySelectorAll(".cartClick");
    const cartIncrement = productTray.querySelectorAll(".Cartincrement")
    const cartDecrement = productTray.querySelectorAll('.Cartdecrement')
    const cartInput = productTray.querySelectorAll('.cartInut');
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

    
    cartClick.forEach((item, index) => {
      item.addEventListener("click", () => addtoCart(ProductData[index]));
    });

    cartIncrement.forEach((item, index)=>{
      item.addEventListener("click", () => inCrementClick(ProductData[index], index));
    })
    cartDecrement.forEach((item, index)=>{
        item.addEventListener("click", () => decrementClick(ProductData[index], index));
      })

    
   
}



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

export async function getHOData(data){
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
                      <tbody id="cartTablebody"></tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>`;
        
        let cartTablehead = document.getElementById('cartTablehead');
        let cartTablebody = document.getElementById('cartTablebody');
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
                              <td class="text-end" colspan="9"><a class="btn btn-success cart-btn-transform"  id="submitCart">submit</a></td>
                              
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
        };
        
        // Add to cart logic
        const addCartPage = (data, index) => {
            cartPageInput[index].value = parseInt(cartPageInput[index].value) + 1;
            cartData[index].quantity = parseInt(cartPageInput[index].value);
            updateLocalStorage();
        };
        
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
                    <div>
                    <ul class="align-center justify-content-center gap-3 " id="cartTraker" style="
    display: flex;
    justify-content: space-around;
    flex-direction: column;
"> 
                      
                    </ul>
                    </div>
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
                    <div class="table-responsive theme-scrollbar" style="max-height:465px">
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
        let getHodashboard = await Hodashboard("getHodashboard")
        console.log(getHodashboard,"getHodashboard")
        const cartTraker = document.getElementById("cartTraker")
        if(getHodashboard){
            let summary = getHodashboard.data.summary
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

                console.log("ggggghhhjjjkkkk",getHodashboard.data.detailed[sumArr[index]],sumArr[index])
                
                let cartStatus = priviewCartstatus(getHodashboard.data.detailed[sumArr[index]])
                let cartBody = document.getElementById("cartStatusBody")
                cartBody.innerHTML= cartStatus;
            });
            })



        }


    }
}


export async function saveCart(tabName,type) {
    console.log(Frontconstants[tabName].getApiName,"svaeAPAPPAPA")
    const payload = {
        api_name: Frontconstants[tabName].getApiName,
        action: type,
        siteId: 1,
        items:JSON.parse(localStorage.getItem('cartArr'))
    };
    try {
      const Apidata = await Apicall(
        Frontconstants[tabName].getApiUrl,
        "POST",
        payload
      );
      console.log("Response company:", Apidata);
      if (Apidata["status"] === "success") {
        // alert(`data ${type} succesfully`)
        cartBadge.innerHTML = JSON.parse(localStorage.getItem("cartArr")).length
        return true
      }
    } catch (error) {
      console.error("Error fetching company list:", error);
    }
}

async function callApproveCart(data, type){
    let tabName = "approveCart"
    const payload = {
        api_name: Frontconstants[tabName].getApiName,
        action: type,
        cartId: data.cartid,
        items: data.items
    };
    try {
      const Apidata = await Apicall(
        Frontconstants[tabName].getApiUrl,
        "POST",
        payload
      );
      console.log("Response company:", Apidata);
      if (Apidata["status"] === "success") {
        alert(`data ${type} succesfully`)
    let pageBody = document.querySelector(".appendCart");
    pageBody.innerHTML= `data ${type} succesfully`
    setTimeout(() => {
        location.reload();
      }, 600);
        return true
      }
    } catch (error) {
      console.error("Error fetching company list:", error);
    }
}
window.viewSpecificCartHo = function (gotdata, index) {
  console.log("Viewing specific cart:", gotdata, index);
  let statusBtn = document.querySelectorAll(".viewSpecificCartHo");
  
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
  let tableBodyRowsHo = data.map((item, index) => {
    return `<tr>
              ${tableHeaders.map((key) => {
                // Check if the key is hsncode and hide it initially
                if (key === 'hsncode') {
                  return `
                    <td>
                      <span id="hsn-${index}" style="display:none">${item[key]}</span>
                      <i class="eye-icon" onclick="toggleHsnVisibility(${index})" style="cursor:pointer;">👁️</i>
                    </td>`;
                } else {
                  return `<td>${item[key]}</td>`;
                }
              }).join("")}
            </tr>`;
  });

  // Append the cart table to the page
  let cartTable = `<table class="table table-bordered">
    <thead>
      <tr>${tableHeaders.map((header) => `<th>${header}</th>`).join("")}</tr>
    </thead>
    <tbody id ="specificCartBody">
      ${tableBodyRowsHo.join("")}
      ${gotdata.cartstage === "S" ? 
      `<tr>
                            <td class="text-end" colspan="5"><a class="btn btn-secondary cart-btn-transform" id="rejectButton" >Reject</a></td>
                            <td><a class="btn btn-success cart-btn-transform" id="approveButton"  >Approve</a></td>
                          </tr>` : `<p><p>`
}
                           <tr>
                              <td class="text-end" colspan="7"><a class="btn btn-success cart-btn-transform" id=confirmCart >Submit</a></td>
                            </tr>
    </tbody>
  </table>`;

  pageBody.innerHTML = `<div class="container-fluid">
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

  if (gotdata.cartstage === "S") {
      document.getElementById("rejectButton").addEventListener("click", () => {
        callApproveCart(gotdata, "reject");
      });
  
      document.getElementById("approveButton").addEventListener("click", () => {
        callApproveCart(gotdata, "approve");
      });
    }

  // Smooth scroll slightly up
  window.scrollTo({
    top: 500, // Scroll to 500px from the top
    behavior: "smooth" // Smooth scrolling animation
  });
  document.getElementById("confirmCart").addEventListener("click", () => {
    mainWrapper.innerHTML +=  purchaseOrder(gotdata);
   
  });
};




// Function to toggle visibility of the hsncode
window.toggleHsnVisibility=(id)=> {
  let hsnElement = document.getElementById(`hsn-${id}`);
  console.log(hsnElement,"sdshdgsgdsgdsds")
  if (hsnElement.style.display === "none") {
    hsnElement.style.display = "inline";
  } else {
    hsnElement.style.display = "none";
  }
}

const cartStatusObj={
  "P":"Pending",
  "A":"Approved",
  "R":"Rejected"
}
  
  

function priviewCartstatus(Cartdata) {
    console.log("Cart Data:", Cartdata);
    let cartBody = Cartdata.map((data, index) => {
        return `<tr role="row" class="odd">
                    <td>${data.cartid}</td>
                    <td>h</td>
                    <td class="text-success">${cartStatusObj[data.orderStage]}</td>
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
                            onClick='viewSpecificCartHo(${JSON.stringify(data)}, ${index})' 
                            class="btn bg-light-warning border-light-warning text-warning viewSpecificCartHo">
                            View Cart
                        </div>
                    </td>
                </tr>`;
    });

    return Cartdata.length > 0 ? cartBody.join("") : "<h3>No cart available</h3>"; // Combine all rows into a single string
}

