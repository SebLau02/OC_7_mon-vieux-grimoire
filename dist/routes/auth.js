"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = __importDefault(require("../controllers/auth"));
const authorizeRequest_1 = __importDefault(require("../middlewares/authorizeRequest"));
const router = express_1.default.Router();
router.post('/signup', auth_1.default.signup);
router.get('/users', authorizeRequest_1.default, auth_1.default.getAllUser);
router.post('/login', auth_1.default.login);
exports.default = router;
//# sourceMappingURL=auth.js.map