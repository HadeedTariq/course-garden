"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.playlisRouter = void 0;
const express_1 = require("express");
const middlewares_1 = require("../../middlewares");
const playlist_controller_1 = require("./playlist.controller");
const router = (0, express_1.Router)();
exports.playlisRouter = router;
router.use(middlewares_1.checkAuth);
router.post("/create", playlist_controller_1.createPlaylist);
router.get("/myPlaylists", playlist_controller_1.getMyPlaylists);
router.put("/update", playlist_controller_1.updatePlaylist);
//# sourceMappingURL=playlist.routes.js.map