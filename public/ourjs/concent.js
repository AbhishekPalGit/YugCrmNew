import {callApproveCart} from './ProductManager.js'
import { deleteProduct } from './dashboard.js'
export function concent(data, type , updatedCart){
    
    let pageBody = document.querySelector('.page-body')
    pageBody.innerHTML += `<div class="modal fade show" id="consentPop" tabindex="-1" aria-labelledby="exampleModalCenter1" style="display: block;" aria-modal="true" role="dialog">
                      <div class="modal-dialog modal-dialog-centered" role="document">
                        <div class="modal-content">
                          <div class="modal-body"> 
                            <div class="modal-toggle-wrapper">  
                              <ul class="modal-img">
                                <li> <img src="../assets/images/gif/danger.gif" alt="error"></li>
                              </ul>
                              <h4 class="text-center pb-2">Are you sure!</h4>
                              <p class="text-center">  </p>
                           
                                <div style="display:flex;justify-content: space-around;">
                        <a class="btn btn-secondary cart-btn-transform" id="removePopup">No</a>
                        <a style="margin-left:20px" class="btn btn-success cart-btn-transform" id="consentOk">Yes</a>
                    </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>`

let consentOk = document.getElementById("consentOk")
consentOk.addEventListener('click',()=>{
    if(type == "reject" || type == "approve"){
      console.log("getting updated cart", updatedCart)
        callApproveCart(data,type, updatedCart)
    }else{
        deleteProduct(data, type);
    }
    document.getElementById('consentPop').remove()
})
let removePopup = document.getElementById("removePopup")
removePopup.addEventListener('click',()=>{
    location.reload()
})

}
