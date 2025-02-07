import Apicall from './Apicall.js';

document.getElementById('login-form').addEventListener('submit', async function (e) {
  e.preventDefault(); // Prevent the default form submission behavior
    console.log("cvdgcvdh")
  // Get the values of username and password
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;

  // API endpoint URL
  const apiUrl = 'https://chachret.com/crm/api/v1/auth/login'; // Replace with your actual API URL

  // Payload for the API request
  const payload = {
    "api_name": "login",
    "emailId": username,
    "password": password,
  };

  try {
    const data = await Apicall(apiUrl, 'POST', payload);
    console.log('Response:', data);
    if(data.status === "success"){
      localStorage.setItem("UserSpec",data.data.roleType)
      localStorage.setItem("UserInfo",JSON.stringify(data.data))
      localStorage.setItem("cartArr",JSON.stringify([]))

    setTimeout(()=>{
    window.location.href = '/dashboard'; 
    },100)
  

    }else{
      let loginerror = document.getElementById("loginerror");
      loginerror.innerHTML = data.message
      let webloader = document.querySelector('.loader-wrapper');
      if (webloader) {
        webloader.style.display = "none"; // Show loader
      }
    }
    // if (data.token) {
    //   localStorage.setItem('authToken', data.token);
    // }
    console.log(window.location.href,"bxhbsxhsbh")
  } catch (error) {
    // Handle error
    document.getElementById('error-message').style.display = 'block';
    document.getElementById('error-message').innerText = error.message || 'An error occurred. Please try again.';
  }
});
