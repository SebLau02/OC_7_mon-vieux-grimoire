"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose = require('mongoose');
const app = (0, express_1.default)();
const auth_1 = __importDefault(require("./routes/auth"));
const book_1 = __importDefault(require("./routes/book"));
const dotenv_1 = __importDefault(require("dotenv"));
const path_1 = __importDefault(require("path"));
dotenv_1.default.config();
// mongoose.connect(
//   'mongodb+srv://OCR_P7:dSiBGFPe1bhVNMGY@cluster0.je84pvt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0',
// );
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log('Connexion à MongoDB réussie !'))
    .catch(() => console.log('Connexion à MongoDB échouée !'));
app.use(express_1.default.json());
app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS');
    next();
});
app.use('/api/auth', auth_1.default);
app.use('/api/books', book_1.default);
app.use('/images', express_1.default.static(path_1.default.join(__dirname, '../images')));
exports.default = app;
//# sourceMappingURL=app.js.map