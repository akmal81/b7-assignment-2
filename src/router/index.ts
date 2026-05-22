import { Router } from "express";
import { authRouter } from "../modules/auth/auth.router";
import { issuesRouter } from "../modules/issues/issues.router";


const router = Router();

router.use('/auth', authRouter);
router.use('/issues', issuesRouter)

export const IndexRoutes = router; 