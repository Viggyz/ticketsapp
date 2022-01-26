import { MongoMemoryServer } from "mongodb-memory-server";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../app";
import jwt from "jsonwebtoken";

declare global {
  var signin: (id?: string) => string[];
}

jest.mock("../nats-wrapper");

let mongo: any; //global so can be accessed later
beforeAll(async () => {
  process.env.JWT_KEY = "asdf";

  mongo = await MongoMemoryServer.create();
  const mongoUri = mongo.getUri();

  await mongoose.connect(mongoUri);
});

beforeEach(async () => {
  jest.clearAllMocks(); //To clear out natsWrapper count
  const collections = await mongoose.connection.db.collections();

  for (let collection of collections) {
    await collection.deleteMany({});
  }
});

afterAll(async () => {
  await mongoose.connection.close();
  await mongo.stop();
});

// global.signin = () => {
//   // Build a JWT payload. { id, email }
//   const payload = {
//     id: "1lkji12424l",
//     email: "test@test.com",
//   };

//   //Create the JWT!
//   const token = jwt.sign(payload, process.env.JWT_KEY!);

//   // Build session Object. {jwt: MY_JWT }
//   const session = { jwt: token };

//   // Turn that session into JSON
//   const sessionJSON = JSON.stringify(session);

//   // Take JSON and encode it as base64
//   const base64 = Buffer.from(sessionJSON).toString("base64");

//   // Return a string thats the cookie with the encoded data
//   // console.log(`express:sess=${base64}`);
//   return `express:sess=${base64}`;
// };

global.signin = (id?: string) => {
  // Build a JWT payload {id, email}
  const payload = {
    id: id || new mongoose.Types.ObjectId().toHexString(),
    email: "test10@test.com",
  };

  // Create the JWT
  const token = jwt.sign(payload, process.env.JWT_KEY!);

  // Build session Object {jwt: MY_JWT}
  const session = { jwt: token };

  // Turn session into JSON
  const sessionJSON = JSON.stringify(session);

  // Encode JSON as base64
  const base64 = Buffer.from(sessionJSON).toString("base64");

  // return cookie with encoded data
  // console.log(`session=${base64}`);
  return [`session=${base64}`];
};
