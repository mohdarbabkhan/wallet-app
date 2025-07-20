import { SignedIn, SignedOut, useUser } from '@clerk/clerk-expo'
import { Link, router, useRouter } from 'expo-router'
import { Alert, FlatList, Image, RefreshControl, Text, TouchableOpacity, View, PermissionsAndroid, Platform } from 'react-native'
import { SignOutButton } from '@/components/SignOutButton'
import { useTransaction } from '@/Hooks/useTransaction'
import { useEffect,useState } from 'react'
import { styles } from '@/assets/styles/home.styles'
import PageLoader from '@/components/PageLoader'
import { Ionicons } from '@expo/vector-icons'
import BalanceCard from "../../components/BalanceCard"
import {TransactionItem} from '@/components/TransactionItem'
import NoTransactionsFound from '@/components/NoTransactionsFound'
// @ts-ignore: No types for 'react-native-get-sms-android'
import SmsAndroid from 'react-native-get-sms-android';
import axios from 'axios';
import { API_URL } from '@/constants/api';
import { parseTransactionSMS } from '@/lib/utils';

export default function Page() {
  const { user } = useUser()
  const router = useRouter();
  const [refreshing,setRefreshing] = useState(false)
  const [syncing, setSyncing] = useState(false);
 
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

  useEffect(() => {
    const timer = setTimeout(() => {
      async function requestSMSPermission() {
        if (Platform.OS === 'android') {
          try {
            const granted = await PermissionsAndroid.request(
              PermissionsAndroid.PERMISSIONS.READ_SMS,
              {
                title: 'SMS Permission',
                message: 'This app needs access to your SMS to track transactions.',
                buttonNeutral: 'Ask Me Later',
                buttonNegative: 'Cancel',
                buttonPositive: 'OK',
              },
            );
            if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
              Alert.alert('Permission Denied', 'SMS read permission is required to track transactions from SMS. Please enable it in Settings > Apps > [Your App] > Permissions.');
            }
          } catch (err) {
            console.warn(err);
          }
        }
      }
      requestSMSPermission();
    }, 2000); // Wait 2 seconds after mount
    return () => clearTimeout(timer);
  }, []);

  if(loading && !refreshing) return <PageLoader/>

  const handleDelete = (id:string) => {
    Alert.alert("Delete Transaction", "Are you sure you want to delete this transaction?",[
      {text:"Cancel",style:"cancel"},
      {text:"Delete", style:"destructive", onPress: () => deleteTransaction(id)},
    ]);
  };
  
  const handleSyncSMS = async () => {
    if (Platform.OS !== 'android' || !SmsAndroid) {
      Alert.alert('Not supported', 'SMS sync is only supported on Android devices with a custom build.');
      return;
    }
    setSyncing(true);
    try {
      SmsAndroid.list(
        JSON.stringify({
          box: 'inbox',
          maxCount: 100,
        }),
        (fail: any) => {
          setSyncing(false);
          console.log('Failed with this error: ' + fail);
          Alert.alert('Error', 'Failed to read SMS inbox.');
        },
        async (count: any, smsList: any) => {
          const messages = JSON.parse(smsList);
          const parsedTransactions = messages
            .map((msg: any) => {
              const parsed = parseTransactionSMS(msg.body);
              if (parsed) {
                return {
                  user_id: user.id,
                  amount: parsed.amount,
                  type: parsed.type,
                  date: new Date(msg.date).toISOString().slice(0, 10), // Only YYYY-MM-DD
                };
              }
              return null;
            })
            .filter(Boolean);
          if (parsedTransactions.length === 0) {
            setSyncing(false);
            Alert.alert('SMS Sync', 'No transactions found in your SMS inbox.');
            return;
          }
          let successCount = 0;
          let duplicateCount = 0;
          let errorCount = 0;
          for (const txn of parsedTransactions) {
            try {
              await axios.post(`${API_URL}/transactions/sms`, txn);
              successCount++;
            } catch (err: any) {
              if (err.response && err.response.status === 409) {
                duplicateCount++;
              } else {
                errorCount++;
              }
            }
          }
          setSyncing(false);
          Alert.alert('SMS Sync', `Added: ${successCount}, Duplicates: ${duplicateCount}, Errors: ${errorCount}`);
          loadData();
        }
      );
    } catch (error) {
      setSyncing(false);
      console.error(error);
      Alert.alert('Error', 'An error occurred while syncing SMS transactions.');
    }
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
        {/* SMS SYNC BUTTON */}
        <TouchableOpacity style={[styles.addButton, {marginVertical: 10, opacity: syncing ? 0.6 : 1}]} onPress={handleSyncSMS} disabled={syncing}>
          <Ionicons name="sync" size={20} color="#FFF"/>
          <Text style={styles.addButtonText}>{syncing ? 'Syncing...' : 'Sync SMS Transactions'}</Text>
        </TouchableOpacity>

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