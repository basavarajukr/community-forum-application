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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const passport_1 = __importDefault(require("passport"));
const passport_jwt_1 = require("passport-jwt");
const prisma_1 = __importDefault(require("../prisma")); // your prisma client
// Define options for the JWT Strategy
const opts = {
    jwtFromRequest: passport_jwt_1.ExtractJwt.fromAuthHeaderAsBearerToken(),
    secretOrKey: process.env.JWT_SECRET || 'secretkey', // fallback to default if not set in .env
};
// Passport JWT Strategy
passport_1.default.use(new passport_jwt_1.Strategy(opts, (jwt_payload, done) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Fetch user from DB using the ID from the JWT payload
        const user = yield prisma_1.default.user.findUnique({
            where: { id: jwt_payload.id },
        });
        // If user exists, pass the user to the next middleware/handler
        if (user) {
            console.log(`User found: ${user.name}`);
            return done(null, user);
        }
        // If no user found, return false
        console.log('User not found');
        return done(null, false);
    }
    catch (err) {
        // Return any errors encountered during the process
        console.error('Error during JWT authentication:', err);
        return done(err, false);
    }
})));
exports.default = passport_1.default;
