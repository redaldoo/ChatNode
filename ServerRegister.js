const http = require("http")

var PORT_CLIENTONE = 8090;
var PORT_CLIENTTWO = 8001;



var HOST_1 = "localhost";
var HOST_2 = "localhost";

const PORT_SERVER_REGISTER = 7000

const users = []

var optionClient1 = {
  port: PORT_CLIENTONE,
  hostname: HOST_1,
  host: HOST_1 + ":" + PORT_CLIENTONE,
  path: "",
  method: "",
};

var optionClient2 = {
  port: PORT_CLIENTTWO,
  hostname: HOST_2,
  host: HOST_2 + ":" + PORT_CLIENTTWO,
  path: "",
  method: "",
};

const checkUsername = (username) => {

  const user = users.find(element => element.username == username)

  if (user) return true

  return false;
}

setInterval(function () {
  console.log("pinging...")
  var req;
  req = http.request({ host: '127.0.0.1', port: 8081, method: 'POST', path: '/ping' },

    (res) => {
      res.resume();
      res.on('end', () => {
        console.log(users)
      });


    });
  req.on('error', function (error) {
    delete users;
  });
  req.end();

  req = http.request({ host: '127.0.0.1', port: 8090, method: 'POST', path: '/ping' },

    (res) => {
      res.resume();
      res.on('end', () => {
        console.log(users)
      });


    });
  req.on('error', function (error) {
    delete users;
  });
  req.end();

}, 2000);


var RegisterServerRequestHandler = function (req, res) {

  var path = req.url.split("?")[0];
  if (!path || path == "/") {
    res.writeHead(404, { "Content-type": "application/json" });
    res.end('{message : "page not found"}');
  } else {

    if (req.method == "GET") {


      res.end(JSON.stringify(users))

    }
    else if (req.method == "POST") {

      var body = "";
      res.writeHead(200, { "Content-type": "application/json" });
      req.on("data", function (data) {
        body += data.toString();
      });
      req.on("end", function () {

        const user = JSON.parse(body)
        if (user instanceof Object) {
          const isUsernameExist = checkUsername(user.username)

          if (isUsernameExist) {
            res.end(JSON.stringify({ message: "username existe dèja" }));
          }
          else {
        
            users.push(user)
            res.end(JSON.stringify(user));
          }
        }
        else {
          res.end(JSON.stringify({ message: "error data  type " }));
          //   }if(req.url == "/ping"){
          //       if (users == 0){
          //         console.log("no users found");
          //       }else{
          //       for (i =0 ; i > users.length ; i++){

          //       setInterval(function(){ 
          //           optionClient1.path = path;
          //           optionClient1.method = req.method;

          //           const request = http.request(optionClient1, function (response) {
          //             var body = "";
          //             response.on("error", function (e) {
          //               console.log(e);
          //               res.writeHead(500, {
          //                 "Content-type": "application/json",
          //               });
          //               res.end(e);
          //             });
          //              response.on("end", function () {
          //               res.writeHead(200, {
          //                 "Content-type": "application/json",
          //               });
          //             });
          //           });
          //       }, 2000);
          //   }


          // }
        }
      });


    } else {
      res.writeHead(404, { "Content-type": "application/json" });
      res.end('{message : "page not found"}');
    }
  }
};

const server = http.createServer(RegisterServerRequestHandler)


server.listen(PORT_SERVER_REGISTER)
