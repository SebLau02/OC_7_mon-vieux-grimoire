"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const book_1 = __importDefault(require("../controllers/book"));
const authorizeRequest_1 = __importDefault(require("../middlewares/authorizeRequest"));
const multer_1 = require("../middlewares/multer");
const router = express_1.default.Router();
router.get('/', book_1.default.index);
router.get('/bestrating', book_1.default.bestRating);
router.post('/:id/rating', authorizeRequest_1.default, book_1.default.updateRating);
router.get('/:id', book_1.default.show);
router.post('/', authorizeRequest_1.default, multer_1.upload, multer_1.resizeAndUploadImage, book_1.default.create);
router.delete('/', authorizeRequest_1.default, book_1.default.destroy);
router.delete('/:id', authorizeRequest_1.default, book_1.default.destroyOne);
router.put('/:id', authorizeRequest_1.default, multer_1.upload, multer_1.resizeAndUploadImage, book_1.default.updateBook);
exports.default = router;
//# sourceMappingURL=book.js.map