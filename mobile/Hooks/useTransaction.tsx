import { useCallback, useState } from "react"
import { Alert } from "react-native";
import { API_URL } from "@/constants/api";


interface SummaryType {
    balance: string,
    income: string,
    expense: string,
}

export const useTransaction = (userId:String) => {
    
    const [transaction,setTransaction] = useState([]);
    const [summary,setSummary] = useState<SummaryType>({
        balance:"",
        income:"",
        expense:""
    })
    const [loading,setLoading] = useState(true);
    //useCallback functions only runs when userId changes it does not run for every re-render
    const fetchTransactions = useCallback(async () => {
        try {
            const response = await fetch(`${API_URL}/transactions/${userId}`)
            const data = await response.json();
            
            setTransaction(data)
        } catch (error) {
            console.error("Error fetching the transactions:",error);
        }
    },[userId])

    const fetchSummary = useCallback(async() => {
        try {
            const response = await fetch(`${API_URL}/transactions/summary/${userId}`)
            const data = await response.json();
            setSummary(data);
        } catch (error) {
            console.error("Error fetching Summary:",error);
            
        }
    },[userId])

    const loadData = useCallback(async() => {
        if(!userId) return;
        
        setLoading(true);
        try {
            // functions can be run in parallel
            await Promise.all([fetchTransactions(),fetchSummary()]);
        } catch (error) {
            console.error("Error loading data:",error);
        }finally{
            setLoading(false);
        }
    },[fetchSummary,fetchTransactions,userId]);

    const deleteTransaction = async(id:string) => {
        try {
            const response = await fetch(`${API_URL}/transactions/${id}`, {method:"DELETE"});
            if(!response.ok) throw new Error("Failed to delete transaction");
            //refresh data after deletion
            loadData();
            Alert.alert("Success", "Transaction deleted successfully")
        } catch (error:any) {
            console.error("Error deleting transaction",error);
            Alert.alert("Error",error.message)
        }
    }

    return {transaction,summary,loading,loadData,deleteTransaction};
}