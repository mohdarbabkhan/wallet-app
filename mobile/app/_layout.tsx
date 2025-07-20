import SafeArea from "@/components/SafeArea";
import { ClerkProvider } from '@clerk/clerk-expo'
import { Slot } from 'expo-router'
import { tokenCache } from '@clerk/clerk-expo/token-cache'
import {StatusBar} from "expo-status-bar"
export default function RootLayout() {
  
  return (
    <ClerkProvider tokenCache={tokenCache}>
    <SafeArea>
      <Slot/>
    </SafeArea>
    <StatusBar style="dark"/>
    </ClerkProvider>
  )
}
