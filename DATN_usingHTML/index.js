//-----------------------khai báo thư viện và các biến-----------------

// require sử dụng để import một module (hoặc một file) vào trong file hiện tại
const express = require('express'); 
const path = require('path');
const mqtt = require('mqtt');  
const mongoose = require('mongoose');
const shortId = require('shortid');

const Event1  = require('./models/data1_model');
const Event2  = require('./models/data2_model');
const Event3  = require('./models/data3_model');

const client = mqtt.connect('mqtt://broker.hivemq.com:1883');  // tạo client kết nối tới mqtt broker
const app = express();  // sử dụng module express để tạo một đối tượng ứng dụng web, từ đó ta có thể sử dụng được các thuộc tính và phương thức của express 
const port = 3000;

var server = require("http").Server(app); // khởi tạo server, triển khai giao thức HTTP 
var io = require("socket.io")(server);  // khởi tạo bien io với thư viện Socket.io dùng để truyền nhận dữ liệu trong nội bộ server

app.use(express.static("public")); // link thư mục chứa các file tĩnh, các file trong đây khách hàng truy cập đc hết, mọi request từ client đều truy cập vào public để tìm

//-----------------------gửi html đến client----------------------------

app.get('/', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/about_us.html'));
  });
app.get('/dashboard', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/dashboard.html'));
  });
app.get('/weather', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/weather.html'));
});
  
//-----------------------server nhận thông báo--------------------------

server.listen(port, function() {
    console.log("Server listening on port " + port);
});
io.on("connection", function(socket){
    console.log("Co nguoi ket not");

    socket.on('get-latest-data1', async () => {
      sendLatestData1ToClient(); // Gửi dữ liệu mới nhất cho client yêu cầu
    });

    socket.on('get-latest-data2', async () => {
      sendLatestData2ToClient(); // Gửi dữ liệu mới nhất cho client yêu cầu
    });

    socket.on('get-latest-data3', async () => {
      sendLatestData3ToClient(); // Gửi dữ liệu mới nhất cho client yêu cầu
    });
});

//-----------------------MQTT--------------------------------------------

const topic = "trung_temperature_test";

// MongoDb connection success 
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

// MongoDB connection fail
mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB', err);
});

client.on('connect', async () => {

  await mongoose.connect('mongodb+srv://trung2109:trung2109@atlascluster.wzvif6o.mongodb.net/test_database?retryWrites=true&w=majority');

  console.log('MQTT connected');
  try {
    client.subscribe(topic);
  } 
  catch (err)
  {
    console.log("Error while subscribe: " + err.message);
  };
});

client.on('message', async (topic, message) => {

    console.log("MQTT received Topic: ", topic.toString(), "Message: ", message.toString());

    try {
      let data =  '{' + message.toString() + '}';
      data = JSON.parse(data);
      data._id = shortId.generate();
    
      switch (data.node) {
        case 1:
          await saveData1(data);
          break;
        case 2:
          await saveData2(data);
          break;
        case 3:
          await saveData3(data);
          break;
        default:
          console.log("Chưa có tên node");
          break;
      }
    }
    catch (err) {
      console.log('Err: ' + err.message);
    };
    
    // const data = message.toString().split(' ');

    // const [temp_1, hum_1, co2_1, uv_1] = data;

    // console.log("Temperature_1: ", temp_1);
    // console.log("Humidity_1: ", hum_1);
    // console.log("CO2_1: ", co2_1);
    // console.log("UV_1: ", uv_1);

    // io.emit('temp-1-update', temp_1);
    // io.emit('hum-1-update', hum_1);
    // io.emit('co2-1-update', co2_1);
    // io.emit('uv-1-update', uv_1);
});

//-----------------------database--------------------------------------

saveData1 = async (data1) => {
  data1 = new Event1(data1);
  data1 = await data1.save();
  console.log('Saved data1:', data1);

  const temp_1 = data1.temperature;
  io.emit('temp-1-update', temp_1);
};

saveData2 = async (data2) => {
  data2 = new Event2(data2);
  data2 = await data2.save();
  console.log('Saved data2:', data2);

  const temp_2 = data2.temperature;
  io.emit('temp-2-update', temp_2);
};

saveData3 = async (data3) => {
  data3 = new Event3(data3);
  data3 = await data3.save();
  console.log('Saved data3:', data3);

  const temp_3 = data3.temperature;
  io.emit('temp-3-update', temp_3);
};

// lấy dữ liệu từ database gửi lên client khi load trang
const sendLatestData1ToClient = async () => {
  try {
    const latestData1 = await Event1.findOne().sort({ $natural: -1 }).lean();
    if (latestData1) {
      const { temperature } = latestData1;
      io.emit('temp-1-update', temperature);
    }
  } catch (err) {
    console.log('Error sending latest data1 to client:', err.message);
  }
};

const sendLatestData2ToClient = async () => {
  try {
    const latestData2 = await Event2.findOne().sort({ $natural: -1 }).lean();
    if (latestData2) {
      const { temperature } = latestData2;
      io.emit('temp-2-update', temperature);
    }
  } catch (err) {
    console.log('Error sending latest data2 to client:', err.message);
  }
};

const sendLatestData3ToClient = async () => {
  try {
    const latestData3 = await Event3.findOne().sort({ $natural: -1 }).lean();
    if (latestData3) {
      const { temperature } = latestData3;
      io.emit('temp-3-update', temperature);
    }
  } catch (err) {
    console.log('Error sending latest data3 to client:', err.message);
  }
};