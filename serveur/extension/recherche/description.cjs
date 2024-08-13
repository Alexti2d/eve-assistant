const http = require('node:http');
const system = require('child_process');
module.exports.func = async function (information){
    var myHeaders = new Headers();
    myHeaders.append("Host", "api.wikimedia.org");
    
    var requestOptions = {
      method: 'GET',
      headers: myHeaders,
      redirect: 'follow'
    };
    
    fetch("https://api.wikimedia.org/core/v1/wikipedia/fr/search/page?q=Thomas%20pesquet&limit=1", requestOptions)
      .then(response => response.text())
      .then(result => console.log(result))
      .catch(error => console.log('error', error));
}