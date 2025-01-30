const express = require("express");
const router = express.Router();
const skillsController = require("../controller/skillsController");

router.post("/", skillsController.createSkill);

router.get("/", skillsController.getAllSkills);

router.get("/:skillId", skillsController.getSkillById);

router.put("/:skillId", skillsController.updateSkill);

router.delete("/:skillId", skillsController.deleteSkill);

module.exports = router;
