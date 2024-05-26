const express = require("express")
const router =  express.Router()
const transactionController = require("../controllers/transactioncontroller")

router.get("init",transactionController.init);
router.get("/transactions",transactionController.transaction);
router.get("/statistics",transactionController.statistics);
router.get("/bar-chart",transactionController.barChart)
router.get("/pie-chart",transactionController.pieChart);
router.get("/combined-data",transactionController.combinedData)


module.exports = router