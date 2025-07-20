import express from "express"
import { CreateTransaction, DeleteTransaction, GetTransactionById, GetTransactionSummary } from "../controllers/transactionControllers.js";

const router = express.Router();

router.get("/:userId",GetTransactionById)

router.post("/",CreateTransaction)

router.delete("/:id",DeleteTransaction)

router.get("/summary/:userId",GetTransactionSummary)

export default router