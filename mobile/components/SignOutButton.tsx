import { useClerk } from '@clerk/clerk-expo'
import { useRouter } from 'expo-router'
import { Alert, Text, TouchableOpacity } from 'react-native'
import { styles } from '@/assests/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors'
export const SignOutButton = () => {
  // Use `useClerk()` to access the `signOut()` function
  const { signOut } = useClerk()
  const router = useRouter()

  const handleSignOut = async () => {
    Alert.alert("Logout","Are you sure you want to logout",[
      {text:"Cancel", style: "cancel"},
      {text:"Logout", style: "destructive", onPress:() => {
        void signOut();
      }}
    ])
  }

  return (
    <TouchableOpacity style={styles.loadingContainer} onPress={handleSignOut}>
      <Ionicons name='log-out-outline' size={22} color={COLORS.text}/>
    </TouchableOpacity>
  )
}