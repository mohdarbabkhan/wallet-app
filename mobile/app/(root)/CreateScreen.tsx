import { View, Text, Alert, TouchableOpacity,TextInput, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { API_URL } from '@/constants/api';
import { useUser } from '@clerk/clerk-expo';
import { useRouter } from 'expo-router';
import { styles } from '@/assets/styles/create.styles';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '@/constants/colors';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
const CreateScreen = () => {
  const {user} = useUser();
  const router = useRouter();
  const [title,setTitle] = useState("");
  const [amount,setAmount] = useState("");
  const [selectedCategory,setSelectedCategory] = useState("")
  const [isExpense,setIsExpense] = useState(true);
  const [isLoading,setIsLoading] = useState(false)

  const CATEGORIES = [
  { id: "food", name: "Food & Drinks", icon: "fast-food" },
  { id: "shopping", name: "Shopping", icon: "cart" },
  { id: "transportation", name: "Transportation", icon: "car" },
  { id: "entertainment", name: "Entertainment", icon: "film" },
  { id: "bills", name: "Bills", icon: "receipt" },
  { id: "income", name: "Income", icon: "cash" },
  { id: "other", name: "Other", icon: "ellipsis-horizontal" },
];

  const handleSave = async() => {
    // validations check
    if(!title.trim()) return Alert.alert("Error", "Please enter a transaction title");
    if(!amount || isNaN(parseFloat(amount)) || parseFloat(amount) <= 0){
      Alert.alert("Error","Please enter a valid amount");
      return;
    }

    if(!selectedCategory) return Alert.alert("Error","Please select a category");

    setIsLoading(true);
    try{
      // Format the amount (negative for expense, positive for income)
      const formattedAmount = isExpense
       ? -Math.abs(parseFloat(amount))
       : Math.abs(parseFloat(amount));
      
      const response = await fetch(`${API_URL}/transactions`,{
        method:"POST",
        headers:{
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          user_id: user?.id,
          title,
          amount:formattedAmount,
          category:selectedCategory
        })
      });

      if(!response.ok){
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create transaction");
      }

      Alert.alert("Success", "Transactio created successfully");
      router.back();

    }catch(error:any){
      Alert.alert("Error",error.message || "Failed to create transaction")
    }finally{
      setIsLoading(false);
    }
  }
  return (
    <View style={styles.container}>
      {/* HEADER */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color={COLORS.text}/>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>New Transaction</Text>
        <TouchableOpacity
        style={[styles.saveButtonContainer, isLoading && styles.saveButtonDisabled]}
        onPress={handleSave}
        disabled={isLoading}
        >
          <Text style={styles.saveButton}>{isLoading ? "Saving..." : "Save"}</Text>
          {!isLoading && <Ionicons name="checkmark" size={18} color={COLORS.primary}/>}
        </TouchableOpacity>
      </View>

      {/* Card */}
      <View style={styles.card}>
        <View style={styles.typeSelector}>
         {/* EXPENSE SELECTOR */}
        <TouchableOpacity
          style={[styles.typeButton, isExpense && styles.typeButtonActive]}
          onPress={() => setIsExpense(true)}
        >
          <Ionicons
              name="arrow-down-circle"
              size={22}
              color={isExpense ? COLORS.white : COLORS.expense}
              style={styles.typeIcon}
            />
          <Text style={[styles.typeButtonText, isExpense && styles.typeButtonActive]}>
            Expense
          </Text>
        </TouchableOpacity>

        {/* INCOME SELECTOR */}
        <TouchableOpacity
            style={[styles.typeButton, !isExpense && styles.typeButtonActive]}
            onPress={() => setIsExpense(false)}
          >
            <Ionicons
              name="arrow-up-circle"
              size={22}
              color={!isExpense ? COLORS.white : COLORS.income}
              style={styles.typeIcon}
            />
            <Text style={[styles.typeButtonText, !isExpense && styles.typeButtonTextActive]}>
              Income
            </Text>
          </TouchableOpacity>
      </View>

      {/* AMOUNT CONTAINER */}
       <View style={styles.amountContainer}>
          <Text style={styles.currencySymbol}>₹</Text>
          <TextInput
            style={styles.amountInput}
            placeholder="0.00"
            placeholderTextColor={COLORS.shadow}
            value={amount}
            onChangeText={setAmount}
            keyboardType="numeric"
          />
        </View>

       {/* INPUT CONTAINER */}
        <View style={styles.inputContainer}>
          <Ionicons
            name="create-outline"
            size={22}
            color={COLORS.textLight}
            style={styles.inputIcon}
          />
          <TextInput
            style={styles.input}
            placeholder="Transaction Title"
            placeholderTextColor={COLORS.text}
            value={title}
            onChangeText={setTitle}
          />
        </View>

       {/* TITLE */}
        <Text style={styles.sectionTitle}>
          <Ionicons name="pricetag-outline" size={16} color={COLORS.text} /> Category
        </Text>
      {/* CATEGORY GRID */}
       <View style={styles.categoryGrid}>
          {CATEGORIES.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.categoryButton,
                selectedCategory === category.name && styles.categoryButtonActive,
              ]}
              onPress={() => setSelectedCategory(category.name)}
            >
              <Ionicons
                name={category.icon as any}
                size={20}
                color={selectedCategory === category.name ? COLORS.white : COLORS.text}
                style={styles.categoryIcon}
              />
              <Text
                style={[
                  styles.categoryButtonText,
                  selectedCategory === category.name && styles.categoryButtonTextActive,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

    {/* LOADING */}
    {isLoading && (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary}/>
      </View>
    )}
    </View>
  )
}
  
export default CreateScreen