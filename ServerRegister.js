const http = require("http")

var PORT_CLIENTONE = 8090;
var PORT_CLIENTTWO = 8001;



var HOST_1 = "localhost";
var HOST_2 = "localhost";

const PORT_SERVER_REGISTER = 7000

let users = []



const UsernameCheck = (username) => {

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
    users = users.filter(user => user.port != 8081);
    
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
    users = users.filter(user => user.port != 8090);
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
          const isUsernameExist = UsernameCheck(user.username)

          if (isUsernameExist) {
            res.end(JSON.stringify({ message: "username does exist" }));
          }
          else {
        
            users.push(user)
            res.end(JSON.stringify(user));
          }
        }
        else {
          res.end(JSON.stringify({ message: "error data  type " }));

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
