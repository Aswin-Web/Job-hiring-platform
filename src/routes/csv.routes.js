const express=require('express');
const router = express.Router()
const {createCSVUsers}=require('../controllers/csv.controller')

router.get("/create", createCSVUsers);

module.exports=router;