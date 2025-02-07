import { Frontconstants } from "./Frontconstants.js";
import Apicall from "./Apicall.js";



export const purchaseOrder = (purchaseData) => {
    console.log(purchaseData, "purchaseDataaaaaaaa");

    document.body.innerHTML += `
      <div class="modal fade show customModall"  id="exampleModalgetbootstrap" tabindex="-1" aria-labelledby="exampleModalgetbootstrap" aria-modal="true" role="dialog" style="display: block;">
        <div class="modal-dialog" role="document">
          <div class="modal-content">
          <div class="modal-header" style="background-color:black">
                            <h3 class="modal-title fs-5" id="exampleModalLongTitle">Purchase Order</h3>
                            <button class="btn-close " type="button" data-bs-dismiss="modal" aria-label="Close"></button>
                          </div>
            <div class="modal-toggle-wrapper social-profile text-start dark-sign-up">
              <div class="modal-body">
                <form id="addForm" class="row g-3 needs-validation" novalidate>
                  <div class="col-md-12">
                    <label for="PurchaseNo" class="form-label">Purchase Order No</label>
                    <input 
                      type="text" 
                      class="form-control" 
                      id="PurchaseNo"
                      placeholder="Enter Purchase Order No"
                      required
                    >
                    <div class="invalid-feedback">This field is required.</div>
                  </div>
                  <div class="col-md-12">
                    <label for="UploadPDF" class="form-label">Upload PDF</label>
                    <input 
                      type="file" 
                      class="form-control" 
                      id="UploadPDF"
                      accept=".pdf"
                      required
                    >
                    <div class="invalid-feedback">Please upload a valid PDF file.</div>
                  </div>
                  <div class="col-md-12">
                    <button type="submit" class="btn btn-primary">Submit</button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;

    const form = document.getElementById("addForm");
    const fileInput = document.getElementById("UploadPDF");
    const purchaseNoInput = document.getElementById("PurchaseNo");
    const modal = document.querySelector(".btn-close");
  
  

    if (!form) {
        console.error("Form not found!");
        return;
    }

    form.addEventListener("submit", function(event) {
        if (!form.checkValidity()) {
            event.preventDefault();
            event.stopPropagation();
        } else {
            event.preventDefault(); 

            const file = fileInput.files[0]; 
            const purchaseNo = purchaseNoInput.value;

            if (file) {
                const reader = new FileReader();
                reader.readAsDataURL(file); 

                reader.onload = function() {
                    if (reader.result) {
                        Confirmcart({
                            purchaseNo: purchaseNo,
                            pdfBase64: reader.result,
                            ...purchaseData
                        });
                    }
                };

                reader.onerror = function(error) {
                    console.error("Error reading file:", error);
                };
            }
        }

        form.classList.add("was-validated");
    });
    modal.addEventListener('click',()=>{
        window.location.reload()
    })
};

async function Confirmcart(data) {
    console.log(data,"abcdefgh")
    let tabName = "Confirmcart";
    const payload = {
        api_name: Frontconstants[tabName].getApiName,
        action: "approve",  
        orderId: data.orderId,
        poNumber: data.purchaseNo,
        poLink: data.pdfBase64,
      
    };
    console.log(payload,"sdhcvhdgcvhdcdc")

    try {
        const Apidata = await Apicall(
            Frontconstants[tabName].getApiUrl,
            "POST",
            payload
        );
        console.log("Response company:", Apidata);
        if (Apidata["status"] === "success") {
            alert(`Data submitted successfully`);
            let pageBody = document.querySelector(".appendCart");
            pageBody.innerHTML = `Data submitted successfully`;
            setTimeout(() => {
                location.reload();
            }, 600);
            return true;
        }
    } catch (error) {
        console.error("Error fetching company list:", error);
    }
}
