const Web3 = require('web3');

const express = require('express');
var cors = require('cors')
const app = express();

var multer = require('multer');
var upload = multer();

app.use(cors())
app.use(express.json() );
app.use(upload.array()); 
app.use(express.static('public'));
 

const auth = require("./helpers/auth");
// app.use(auth);

app.get('/', (req, res)=> {
    console.log('hi');
    res.send('ping ponsg')
})

app.use('/test', require('./routes/testRouter'))
app.use('/user', require('./routes/userRouter'))



// for killing port on restart and exit
process.once('SIGUSR2', function () {
    process.kill(process.pid, 'SIGUSR2');
});

process.on('SIGINT', function () {
  // this is only called on ctrl+c, not restart
    process.kill(process.pid, 'SIGINT');
});

process.on('uncaughtException', function (err) {
    console.log('Caught exception: ', err);
});


// for local
// app.listen(process.env.PORT || 3536,'localhost',()=>{
//     console.log("Server is listening on port 3536");
// });


const PORT = process.env.PORT;
app.listen(PORT, '0.0.0.0',()=>{
    console.log("Server is listening on ", PORT);
});

