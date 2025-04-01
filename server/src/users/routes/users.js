import express from "express";
import { Login, deleteCode, getUser } from "../controllers/users.js";

const AuthRoute = express.Router();

AuthRoute.post("/login", Login);
AuthRoute.get("/get-user", getUser);
AuthRoute.post("/delete/:userid", deleteCode);

export default AuthRoute;
