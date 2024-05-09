import { Router } from "express";
import { checkAuth } from "../../middlewares";
import { createPlaylist } from "./playlist.controller";

const router = Router();

router.use(checkAuth);

router.post("/create", createPlaylist);

export { router as playlisRouter };
