"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createForum = void 0;
const client_1 = require("@prisma/client"); // Import PrismaClient
const prisma = new client_1.PrismaClient();
const createForum = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Destructure the title, description, and userId from request body
        const { title, description, userId } = req.body;
        // Check if any required field is missing
        if (!title || !description || !userId) {
            res.status(400).json({ error: "Title, description, and userId are required" });
            return;
        }
        // Create a new forum record in the database using Prisma
        const forum = yield prisma.forum.create({
            data: {
                title,
                description,
                userId,
            },
        });
        // Return the created forum as a JSON response
        res.status(201).json(forum);
    }
    catch (error) {
        console.error(error); // Log the error to the console for debugging
        res.status(500).json({ error: "Something went wrong" });
    }
});
exports.createForum = createForum;
