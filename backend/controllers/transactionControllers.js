import { sql } from "../config/db.js"
export async function GetTransactionById(req,res){
    try {
        const {userId} = req.params;
        const transaction = await sql`
        SELECT * FROM transactions WHERE user_id = ${userId} ORDER BY created_at DESC
        `
        res.status(201).json(transaction)
    } catch (error) {
        console.log("Error getting transactions",error);
        res.status(500).json({message:"Internal server error"})
    }
}

export async function CreateTransaction(req,res){
    //title,amount,category,user_id
    try {
        const {title,amount,category,user_id} = req.body;
        if(!title || !user_id || !category || amount===undefined){
            return res.status(400).json({message:"All fields are required"});
        }

        const transaction = await sql`
        INSERT INTO transactions(user_id,title,amount,category)
        VALUES(${user_id},${title},${amount},${category})
        RETURNING *
        `
        console.log(transaction);
        res.status(201).json(transaction[0])
    } catch (error) {
        console.log("Error creating transactions",error);
        res.status(500).json({message:"Internal server error"})  
    }
}

export async function DeleteTransaction(req,res) {
    try {
        const {id} = req.params;
        if(isNaN(parseInt(id))) return res.status(400).json({message:"Invalid Id"});
        const result = await sql`DELETE FROM transactions WHERE id = ${id} RETURNING *`
        if(result.length == 0) return res.status(404).json({message:"Transaction not found"})
        
        res.status(200).json({message:"Transaction deleted succesfully"})
    } catch (error) {
        console.log("transaction cannot be deleted",error);
        res.status(500).json({message:"Internal server error"}) 
    }
}

export async function GetTransactionSummary(req,res) {
    try {
        const {userId} = req.params;
        console.log("userIDBackend: ",userId);
        
        const balanceResult = await sql`
        SELECT COALESCE(SUM(amount),0) as balance FROM transactions WHERE user_id = ${userId}
        `
        const incomeResult = await sql`
        SELECT COALESCE(SUM(amount),0) as income FROM transactions   WHERE user_id = ${userId} AND amount > 0
        `
        const expenseResult = await sql`
        SELECT COALESCE(SUM(amount),0) as expenses FROM transactions WHERE user_id = ${userId} AND amount < 0
        `
        res.status(200).json({
            balance:balanceResult[0].balance,
            income:incomeResult[0].income,
            expense:expenseResult[0].expenses
        })
    } catch (error) {
        console.log("cannot get the transaction summary",error);
        res.status(500).json({message:"Internal server error"})
    }
}

export async function CreateTransactionFromSMS(req, res) {
    try {
        const { user_id, amount, date, type } = req.body;
        if (!user_id || amount === undefined || !date || !type) {
            return res.status(400).json({ message: "All fields are required (user_id, amount, date, type)" });
        }

        // Prevent duplicate: check if a transaction with same user_id, amount, date, and category exists
        const category = type === 'income' ? 'income' : 'expense';
        const finalAmount = type === 'expense' ? -Math.abs(amount) : Math.abs(amount);
        const duplicate = await sql`
            SELECT * FROM transactions WHERE user_id = ${user_id} AND amount = ${finalAmount} AND category = ${category} AND created_at = ${date}
        `;
        if (duplicate.length > 0) {
            return res.status(409).json({ message: "Duplicate transaction detected" });
        }

        const transaction = await sql`
            INSERT INTO transactions(user_id, title, amount, category, created_at)
            VALUES(${user_id}, ${category}, ${finalAmount}, ${category}, ${date})
            RETURNING *
        `;
        res.status(201).json(transaction[0]);
    } catch (error) {
        console.log("Error creating transaction from SMS", error);
        res.status(500).json({ message: "Internal server error" });
    }
}