import express, { Router } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import path from "path";
import multer from "multer";
import nodemailer from "nodemailer";

dotenv.config();

const secretKey = process.env.JWT_SECRET;

const router = express.Router();