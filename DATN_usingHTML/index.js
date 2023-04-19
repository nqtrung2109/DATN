//-----------------------khai báo thư viện và các biến----------------------------
// require sử dụng để import một module (hoặc một file) vào trong file hiện tại
// path, express là các module của nodejs
const express = require('express'); 
const path = require('path');

const app = express();  // sử dụng module express để tạo một đối tượng ứng dụng web, từ đó ta có thể sử dụng được các thuộc tính và phương thức của express 
var port = 3000;
var server = require("http").Server(app); // khởi tạo server, triển khai giao thức HTTP 
var io = require("socket.io")(server);  // khởi tạo bien io với thư viện Socket.io dùng để truyền nhận dữ liệu trong nội bộ server
app.use(express.static("public")); // link thư mục chứa các file tĩnh, các file trong đây khách hàng truy cập đc hết, mọi request từ client đều truy cập vào public để tìm

//-----------------------gửi html đến client----------------------------
app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/trangchu.html'));
  });
app.get('/dashboard', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/dashboard.html'));
  });
app.get('/weather', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/weather.html'));
});
  
//-----------------------Server nhận thông báo----------------------------
server.listen(port, function() {
    console.log('Server listening on port ' + port);
});
io.on("connection", function(socket){
    console.log("Co nguoi ket not");
});

