const Apicall = async (url, method = 'POST', body = null, headers = {}, noloader) => {
  let webloader = document.querySelector('.loader-wrapper');
  if (webloader && !noloader) {
    webloader.style.display = "flex"; // Show loader
  }
  console.log(webloader, "webloaderwebloaderwebloader")
    try {
      const defaultHeaders = {
        'Content-Type': 'application/json',
        '__pledge':localStorage.getItem('__pledge') || ""
      };
      const mergedHeaders = { ...defaultHeaders, ...headers };
      const response = await fetch(url, {
        method,
        headers: mergedHeaders,
        body: body ? JSON.stringify(body) : null,
      });
      const data = await response.json();
      if (webloader && !url.includes('api/v1/auth/login')) {
        webloader.style.display = "none"; // Show loader
      }
      if (!response.ok) {
        if(data.message == "Unauthorized / Invalid token"){
          window.location.href= "/"
        }
        throw new Error(data.message || 'API Error');
      }else{
        if(url.includes('api/v1/auth/login')){
          const headerValue = response.headers.get('__pledge');
          console.log("headersssss",headerValue)
          localStorage.setItem("__pledge",headerValue)
        }
      }
      return data; 
    } catch (error) {
      console.error('API Call Error:', error);
      throw error; 
    }
  };
  
  export default Apicall;
  