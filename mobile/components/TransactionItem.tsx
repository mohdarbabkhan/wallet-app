import { View, Text, TouchableOpacity } from 'react-native'
import { styles } from '@/assets/styles/home.styles'
import { Ionicons } from '@expo/vector-icons'
import { COLORS } from '@/constants/colors';
import { formatDate } from '@/lib/utils';

interface TransactionType{
    user_id:string,
    id:string,
    title:string,
    amount:string,
    category:keyof typeof CATEGORY_ICONS,
    created_at:string
}

interface PropType{
    item:TransactionType,
    onDelete:(id:string) => void
}

const CATEGORY_ICONS = {
    "Food & Drinks": "fast-food",
    Shopping:"cart",
    Transportation:"car",
    Entertainment:"film",
    Bills:"receipt",
    Income:"cash",
    Other:"ellipsis-horizontal",
}

type Category = keyof typeof CATEGORY_ICONS;

export const TransactionItem = ({item,onDelete}:PropType) => {
    const isIncome = parseFloat(item.amount) > 0;
    const iconName = CATEGORY_ICONS[item.category as Category] || "pricetag-outline";
  return (
    <View style={styles.transactionCard} key={item.id}>
        <TouchableOpacity style={styles.transactionContent}>
            <View style={styles.categoryIconContainer}>
                <Ionicons name={iconName as any} size={22} color={isIncome ? COLORS.income : COLORS.expense} />
            </View>
            <View style={styles.transactionLeft}>
                <Text style={styles.transactionTitle}>{item.title}</Text>
                <Text style={styles.transactionCategory}>{item.category}</Text>
            </View>
            <View style={styles.transactionRight}>
                <Text
                    style={[styles.transactionAmount,{color:isIncome?COLORS.income:COLORS.expense}]}
                >
                    {isIncome ? "+" : "-"}₹{Math.abs(parseFloat(item.amount)).toFixed(2)}
                </Text>
                <Text style={styles.transactionDate}>{formatDate(item.created_at)}</Text>
            </View>
        </TouchableOpacity>
        <TouchableOpacity style={styles.deleteButton} onPress={() => onDelete(item.id)}>
            <Ionicons name='trash-outline' size={20} color={COLORS.expense}/>
        </TouchableOpacity>
    </View>
  )
}
