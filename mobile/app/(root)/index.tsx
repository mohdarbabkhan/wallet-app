import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, router, useRouter } from 'expo-router'
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransaction } from '@/Hooks/useTransaction'
import { useEffect,useState } from 'react'
import { styles } from '@/assets/styles/home.styles'
import PageLoader from '@/components/PageLoader'
import { Ionicons } from '@expo/vector-icons'
import BalanceCard from "../../components/BalanceCard"
import {TransactionItem} from '@/components/TransactionItem'
import NoTransactionsFound from '@/components/NoTransactionsFound'

export default function Page() {
  const { user } = useUser()
  const router = useRouter();
  const [refreshing,setRefreshing] = useState(false)
 
  if (!user?.id){
    return <Text>Loading user...</Text>
  }
  const {transaction,summary,loading,loadData,deleteTransaction} = useTransaction(user.id);
  const onRefresh = async() =>{
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  } 
  useEffect(() => {
    loadData();
  },[loadData]);

  if(loading && !refreshing) return <PageLoader/>

  const handleDelete = (id:string) => {
    Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?",[
      {text:"Cancel",style:"cancel"},
      {text:"Delete", style:"destructive", onPress: () => deleteTransaction(id)},
    ]);
  };
  
  return (
    <View style={styles.container}>
       <View style={styles.content}>
        {/* HEADER */}
        <View style={styles.header}>
          {/* LEFT */}
          <View style={styles.headerLeft}>
            <Image
              source={require("../../assets/images/logo.png")}
              style={styles.headerLogo}
              resizeMode="contain"
            />
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome,</Text>
              <Text style={styles.usernameText}>
                {user?.emailAddresses[0]?.emailAddress.split("@")[0]}
              </Text>
            </View>
          </View>
          {/* RIGHT */}
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.addButton} onPress={() => router.push("/CreateScreen")}>
              <Ionicons name="add" size={20} color="#FFF"/>
              <Text style={styles.addButtonText}>Add</Text>
            </TouchableOpacity>
            <SignOutButton/>
          </View>
        </View>

        {/* BALANCE CARD */}
        <BalanceCard summary={summary}/>

        <View style={styles.transactionsHeaderContainer}>
          <Text style={styles.sectionTitle}>Recent Transactions</Text>
        </View>
       </View>

       <FlatList
        style={styles.transactionsList}
        contentContainerStyle={styles.transactionsListContent}
        data={transaction}
        renderItem={({item}) => (
          <TransactionItem item={item} onDelete={handleDelete} />
        )}
        ListEmptyComponent={<NoTransactionsFound/>}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh}/>}
       />
    </View>
  )
}