import { Router } from "express";
import auth from "../../middleware/auth";
import { UserRoles } from "../../constant/userRole";
import { issueController } from "./issues.controller";

const router = Router();

router.get('/',
    issueController.getAllIssue,
);

router.get('/:id',
    issueController.getSingleIssue
);

router.post('/',
    auth(UserRoles.contributor, UserRoles.maintainer),
    issueController.createIssue
);

router.put('/:id',
    auth(UserRoles.contributor, UserRoles.maintainer),
    issueController.updateIssue
);

router.delete('/:id',
    auth(UserRoles.maintainer), 
    issueController.deleteIssue
);


export const issuesRouter = router;