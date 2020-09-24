/*
 *
 * Copyright 2015 gRPC authors.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 *
 */

// var PROTO_PATH = __dirname + '/../../protos/helloworld.proto';
var PROTO_PATH = '/Users/macintosh/Desktop/projects/TestGRPC/TestGRPC/protos/helloworld.proto';

var grpc = require('grpc');
var protoLoader = require('@grpc/proto-loader');
var packageDefinition = protoLoader.loadSync(
    PROTO_PATH,
    {keepCase: true,
     longs: String,
     enums: String,
     defaults: true,
     oneofs: true
    });
var hello_proto = grpc.loadPackageDefinition(packageDefinition).helloworld;

/**
 * Implements the SayHello RPC method.
 */
function sayHello(call, callback) {
  callback(null, {message: 'Custom Hello ' + call.request.name});
}

/**
 * Implements the SayHelloAgain RPC method.
 */
function sayHelloAgain(call, callback){
  callback(null, {message: 'Custom Hello ' + call.request.name + ' Again!'});
}

/**
 * Implements the SayHelloAgain RPC method.
 */
function customHelloWorld(call, callback){
  callback(null, {message: 'Custom Hello ' + call.request.name + ' Again With data: ' + call.request.moreText});
}

/**
 * Implements the SayHelloAgain RPC method.
 */
function streamHelloWorld(call){
  for (var i = 0; i < 10 ; i++){
    call.write({message: i + '. Streaming back hello reply to ' + call.request.name + ', and your more text: ' + call.request.moreText})
  }
  call.end();
}

/**
 * Starts an RPC server that receives requests for the Greeter service at the
 * sample server port
 */
function main() {
  var server = new grpc.Server();
  server.addService(hello_proto.Greeter.service, {sayHello: sayHello, sayHelloAgain: sayHelloAgain});
  server.addService(hello_proto.CustomGreeter.service, {helloAgain: customHelloWorld, helloAgainStream: streamHelloWorld});
  server.bind('0.0.0.0:50051', grpc.ServerCredentials.createInsecure());
  server.start();
}

main();
