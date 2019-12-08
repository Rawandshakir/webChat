var express = require('express');
var app = express();
var mongoose = require('mongoose');
var bodyParser = require('body-parser');
var http = require('http').Server(app);
var io = require('socket.io')(http);
app.use(express.static(__dirname));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended :false}));

var Message = mongoose.model('Message', {
    name:String,
    message : String
});

var messages = [];
var dburl = 'mongodb+srv://stage:1234@cluster0-dyxcy.mongodb.net/test?retryWrites=true&w=majority';

app.get('/messages' , (req , res)=>{
    Message.find({} , (err , messages)=>{
        res.send(messages);
    });

});
app.post('/messages' , (req , res)=>{
    var message = new Message(req.body);

    message.save((err)=>{
        if (err){
            sendStatus(500)

        }
        messages.push(req.body);
        io.emit('message' , req.body);
        res.sendStatus(200);
    })
});

io.on('connection' ,(socket) =>{

});

mongoose.connect(dburl ,{useNewUrlParser: true}, (err)=>{
    console.log("mongodb connected" , "  err", err);
    }
)

var server = http.listen(3000, ()=>
{
    console.log('server is listening on port' , server.address().port)
}
);