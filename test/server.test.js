var mocha = require('mocha'),
    chai = require('chai'),
    chaiHttp = require('chai-http'),
    server = require('../dist/server/server.js'),
    expect = chai.expect;

    var io = require('socket.io-client');
    
   describe("Server", function () {
    
       var server,
           options ={
               transports: ['websocket'],
               'force new connection': true,
               username: 'test'
           };
       it("Sends out new message", function (done,client) {
        var client = io.connect('http://localhost:3000', options);
        client.on("new message",function(data){
            expect(data.msg).to.equal('testing123');
            client.close()
            done();
        });
        client.emit("send message","testing123");
    });
    it("Successfully creates new user",function(done){
        var client = io.connect('http://localhost:3000', options);
        client.emit("new user","test_user",function(status){
            expect(status).to.be.true;
            done();
        });
        
    });
    
    });