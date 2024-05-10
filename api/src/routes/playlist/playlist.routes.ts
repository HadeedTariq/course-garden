import { Router } from "express";
import { checkAuth } from "../../middlewares";
import {
  createPlaylist,
  getMyPlaylists,
  updatePlaylist,
} from "./playlist.controller";

const router = Router();

router.use(checkAuth);

router.post("/create", createPlaylist);
router.get("/myPlaylists", getMyPlaylists);
router.put("/update", updatePlaylist);

export { router as playlisRouter };
