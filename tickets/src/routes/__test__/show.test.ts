import { response } from "express";
import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it("return a 404 if the ticket is not found", async () => {
  const id = new mongoose.Types.ObjectId().toHexString(); //Necessayr else error
  await request(app).get(`/api/tickets/${id}`).send().expect(404);
});

it("returns the ticket if the found", async () => {
  const title = "concert";
  const price = 20;

  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const ticketResponse = await request(app)
    .get(`/api/tickets/${response.body.id}`)
    .send()
    .expect(200);

  expect(ticketResponse.body.title).toEqual(title);
  expect(ticketResponse.body.price).toEqual(price);
});
