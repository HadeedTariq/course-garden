import { Router } from "express";
import { checkAuth } from "../../middlewares";
import { createPlaylist, getMyPlaylists } from "./playlist.controller";

const router = Router();

router.use(checkAuth);

router.post("/create", createPlaylist);
router.get("/myPlaylists", getMyPlaylists);

export { router as playlisRouter };
