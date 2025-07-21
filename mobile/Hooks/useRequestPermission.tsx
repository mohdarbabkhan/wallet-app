import { useCallback } from "react";
import { Platform, PermissionsAndroid, Alert } from "react-native";

export const useRequestPermission = (userId: string) => {
  const requestSMSPermission = useCallback(async () => {
    if (Platform.OS === "android") {
      try {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.READ_SMS,
          {
            title: "SMS Permission",
            message: "This app needs access to your SMS to track transactions.",
            buttonNeutral: "Ask Me Later",
            buttonNegative: "Cancel",
            buttonPositive: "OK",
          }
        );
        if (granted === PermissionsAndroid.RESULTS.GRANTED) {
          return true;
        } else {
          Alert.alert(
            "Permission Denied",
            "SMS read permission is required to track transactions from SMS. Please enable it in Settings > Apps > [Your App] > Permissions."
          );
          return false;
        }
      } catch (err) {
        console.warn(err);
        return false;
      }
    }
    return true; // iOS or other platforms
  }, [userId]);
  return { requestSMSPermission};
};
