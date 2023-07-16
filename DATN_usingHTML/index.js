//-----------------------khai báo thư viện và các biến-----------------

// require sử dụng để import một module (hoặc một file) vào trong file hiện tại
const express = require('express'); 
const path = require('path');
const mqtt = require('mqtt');  
const mongoose = require('mongoose');
const moment = require('moment');
const shortId = require('shortid');
const xlsx = require('xlsx');
const fs = require('fs');
// const { dialog } = require('electron'); // chỉ đích danh phần tử muốn sử dụng trong module electron sử dụng destructuring 

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
app.get('/about_us', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/about_us.html'));
});
app.get('/dashboard', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/dashboard.html'));
  });
app.get('/weather', function(req, res) {
    res.sendFile(path.join(__dirname, '/public/weather.html'));
});
app.get('/map', function(req, res) {
  res.sendFile(path.join(__dirname, '/public/map.html'));
});
//-----------------------server nhận thông báo--------------------------

server.listen(port, function() {
    console.log("Server listening on port " + port);
});
io.on("connection", function(socket){
    // console.log("Co nguoi ket not");

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

const topic = "environment_node_DATNHUST";

// MongoDb connection success 
mongoose.connection.on('connected', () => {
  console.log('MongoDB connected');
});

// MongoDB connection fail
mongoose.connection.on('error', (err) => {
  console.log('Error connecting to MongoDB', err);
});

client.on('connect', async () => {

  await mongoose.connect('mongodb+srv://trung2109:trung2109@atlascluster.wzvif6o.mongodb.net/Environment_DATNHUST?retryWrites=true&w=majority');

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
      data.created = moment().utc().add(7, 'hours');
    
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
          console.log("Chưa có ten node");
          break;
      }
    }
    catch (err) {
      console.log('Err: ' + err.message);
    };
    
});

//-----------------------database--------------------------------------

saveData1 = async (data1) => {
  data1 = new Event1(data1);
  data1 = await data1.save();
  console.log('Saved data1: ', data1);

  const temp_1 = data1.temperature;
  const hum_1 = data1.humidity;
  const co2_1 = data1.co2;
  const uv_1 = data1.uv;
  const pm25_1 = data1.pm25;
  const time_1 = data1.time;

  const listTime1 = data1.time.split(' ');
  const date_1 = listTime1[0]; // "7-6-23"
  const hour_1 = listTime1[1]; // "21:35:3"

  io.emit('temp-1-update', temp_1);
  io.emit('hum-1-update', hum_1);
  io.emit('co2-1-update', co2_1);
  io.emit('uv-1-update', uv_1);
  io.emit('pm25-1-update', pm25_1);
  io.emit('date-1-update', date_1);
  io.emit('hour-1-update', hour_1);
};

saveData2 = async (data2) => {
  data2 = new Event2(data2);
  data2 = await data2.save();
  console.log('Saved data2: ', data2);

  const temp_2 = data2.temperature;
  const hum_2 = data2.humidity;
  const co2_2 = data2.co2;
  const uv_2 = data2.uv;
  const pm25_2 = data2.pm25;
  const time_2 = data2.time;

  const listTime2 = data2.time.split(' ');
  const date_2 = listTime2[0]; 
  const hour_2 = listTime2[1]; 

  io.emit('temp-2-update', temp_2);
  io.emit('hum-2-update', hum_2);
  io.emit('co2-2-update', co2_2);
  io.emit('uv-2-update', uv_2);
  io.emit('pm25-2-update', pm25_2);
  io.emit('date-2-update', date_2);
  io.emit('hour-2-update', hour_2);
};

saveData3 = async (data3) => {
  data3 = new Event3(data3);
  data3 = await data3.save();
  console.log('Saved data3: ', data3);

  const temp_3 = data3.temperature;
  const hum_3 = data3.humidity;
  const co2_3 = data3.co2;
  const uv_3 = data3.uv;
  const pm25_3 = data3.pm25;
  const time_3 = data3.time;

  const listTime3 = data3.time.split(' ');
  const date_3 = listTime3[0]; 
  const hour_3 = listTime3[1]; 

  io.emit('temp-3-update', temp_3);
  io.emit('hum-3-update', hum_3);
  io.emit('co2-3-update', co2_3);
  io.emit('uv-3-update', uv_3);
  io.emit('pm25-3-update', pm25_3);
  io.emit('date-3-update', date_3);
  io.emit('hour-3-update', hour_3);
};

// lấy dữ liệu từ database gửi lên client khi load trang
const sendLatestData1ToClient = async () => {
  try {
    const latestData1 = await Event1.findOne().sort({ $natural: -1 }).lean();
    if (latestData1) {
      const { time, temperature, humidity, co2, uv, pm25 } = latestData1;
      // kiểm tra có dữ liệu không
      if (time) {
        const listTime1 = time.split(' ');
        const date_1 = listTime1[0]; // "7-6-23"
        const hour_1 = listTime1[1]; // "21:35:3"
        io.emit('date-1-update', date_1);
        io.emit('hour-1-update', hour_1);
      }
      if (temperature) {
        io.emit('temp-1-update', temperature);
      }
      if (humidity) {
        io.emit('hum-1-update', humidity);
      }
      if (co2) {
        io.emit('co2-1-update', co2);
      }
      if (uv) {
        io.emit('uv-1-update', uv);
      }
      if (pm25) {
        io.emit('pm25-1-update', pm25);
      }
    }
  } catch (err) {
    console.log('Error sending latest data1 to client:', err.message);
  }
};

const sendLatestData2ToClient = async () => {
  try {
    const latestData2 = await Event2.findOne().sort({ $natural: -1 }).lean();
    if (latestData2) {
      const { time, temperature, humidity, co2, uv, pm25 } = latestData2;
      // kiểm tra có dữ liệu không
      if (time) {
        const listTime2 = time.split(' ');
        const date_2 = listTime2[0]; 
        const hour_2 = listTime2[1]; 
        io.emit('date-2-update', date_2);
        io.emit('hour-2-update', hour_2);
      }
      if (temperature) {
        io.emit('temp-2-update', temperature);
      }
      if (humidity) {
        io.emit('hum-2-update', humidity);
      }
      if (co2) {
        io.emit('co2-2-update', co2);
      }
      if (uv) {
        io.emit('uv-2-update', uv);
      }
      if (pm25) {
        io.emit('pm25-2-update', pm25);
      }
    }
  } catch (err) {
    console.log('Error sending latest data2 to client:', err.message);
  }
};

const sendLatestData3ToClient = async () => {
  try {
    const latestData3 = await Event3.findOne().sort({ $natural: -1 }).lean();
    if (latestData3) {
      const { time, temperature, humidity, co2, uv, pm25 } = latestData3;
      // kiểm tra có dữ liệu không
      if (time) {
        const listTime3 = time.split(' ');
        const date_3 = listTime3[0]; // "7-6-23"
        const hour_3 = listTime3[1]; // "21:35:3"
        io.emit('date-3-update', date_3);
        io.emit('hour-3-update', hour_3);
      }
      if (temperature) {
        io.emit('temp-3-update', temperature);
      }
      if (humidity) {
        io.emit('hum-3-update', humidity);
      }
      if (co2) {
        io.emit('co2-3-update', co2);
      }
      if (uv) {
        io.emit('uv-3-update', uv);
      }
      if (pm25) {
        io.emit('pm25-3-update', pm25);
      }
    }
  } catch (err) {
    console.log('Error sending latest data3 to client:', err.message);
  }
};

//-----------------------export excel-------------------------------
app.post('/exportdata', async function (req,res) {
  try {
    const data1 = await Event1.find().lean().exec();
    const data2 = await Event2.find().lean().exec();
    const data3 = await Event3.find().lean().exec();

    const workbook = xlsx.utils.book_new();

    // Tạo sheet cho data1
    const data1Sheet = xlsx.utils.json_to_sheet(data1);
    xlsx.utils.book_append_sheet(workbook, data1Sheet, 'Data1');

    // Tạo sheet cho data2
    const data2Sheet = xlsx.utils.json_to_sheet(data2);
    xlsx.utils.book_append_sheet(workbook, data2Sheet, 'Data2');

    // Tạo sheet cho data3
    const data3Sheet = xlsx.utils.json_to_sheet(data3);
    xlsx.utils.book_append_sheet(workbook, data3Sheet, 'Data3');

    // Tạo file Excel và ghi dữ liệu
    const excelFilePath = path.join(__dirname, '/public/export.xlsx');
    xlsx.writeFile(workbook, excelFilePath);

    // Gửi file Excel về client
    res.download(excelFilePath, 'export.xlsx', function(err) {
      if (err) {
        console.error('Error sending file:', err);
      } else {
        console.log('File sent successfully');
        // Xóa file Excel sau khi đã gửi
        fs.unlinkSync(excelFilePath);
      }
    });
  } catch (error) {
    console.error('Error exporting data:', error);
    res.status(500).send('An error occurred while exporting data');
  }
});