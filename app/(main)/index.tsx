import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  RefreshControl,
  StyleSheet,
  SectionList,
  Pressable,
} from 'react-native';
import { useRouter } from 'expo-router';
import { TransactionItem } from '@/components/TransactionItem';
import { getTransactions } from '@/services/transactions';
import { GroupedTransactions, Transaction } from '@/models/Transaction';
import { formatDate } from '@/utils/date';
import { Ionicons } from '@expo/vector-icons';
import { authenticateWithBiometrics } from '@/services/auth';

export default function TransactionHistory() {
  const [groupedTransactions, setGroupedTransactions] = useState<
    GroupedTransactions[]
  >([]);
  const [showAmounts, setShowAmounts] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  const revealAmounts = async () => {
    if (!showAmounts) {
      try {
        const success = await authenticateWithBiometrics();
        if (success) setShowAmounts(true);
      } catch (error) {
        setShowAmounts(false);
      }
    } else {
      setShowAmounts(false);
    }
  };

  const sortTransactionsByDate = (
    transactions: Transaction[],
  ): Transaction[] => {
    return transactions.sort((a, b) => {
      // Convert date strings to Date objects
      const dateA = new Date(a.date);
      const dateB = new Date(b.date);

      // Sort in descending order (latest to oldest)
      return dateB.getTime() - dateA.getTime();
    });
  };

  function groupTransactionsByDate(
    transactions: Transaction[],
  ): GroupedTransactions[] {
    const grouped = transactions.reduce(
      (groups: { [key: string]: Transaction[] }, transaction) => {
        const dateString = formatDate(transaction.date);

        if (!groups[dateString]) {
          groups[dateString] = [];
        }
        groups[dateString].push(transaction);
        return groups;
      },
      {},
    );

    return Object.entries(grouped).map(([title, data]) => ({
      title,
      data: data.sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime(),
      ),
    }));
  }

  const loadTransactions = useCallback(async () => {
    const data = await getTransactions();
    const sorted = sortTransactionsByDate(data);
    const grouped = groupTransactionsByDate(sorted);
    setGroupedTransactions(grouped);
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  }, [loadTransactions]);

  React.useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleTransactionPress = (id: string) => {
    router.push({
      pathname: '/(main)/[id]',
      params: { id },
    });
  };

  return (
    <View style={styles.container}>
      <Pressable style={styles.revealButton} onPress={revealAmounts}>
        <Ionicons
          name={showAmounts ? 'eye-off' : 'eye'}
          size={24}
          color="#000"
        />
        <Text style={styles.revealText}>
          {showAmounts ? 'Hide Amounts' : 'Reveal Amounts'}
        </Text>
      </Pressable>
      <SectionList
        sections={groupedTransactions}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.itemDivider} />}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            showAmounts={showAmounts}
            onPress={() => handleTransactionPress(item.id)}
          />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHeaderText}>{title}</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F5F5',
  },
  sectionHeader: {
    backgroundColor: '#EFEFF4',
    padding: 14,
  },
  sectionHeaderText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  itemDivider: {
    height: 1,
    width: '100%',
    backgroundColor: '#EFEFF4',
  },
  revealButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    margin: 10,
    padding: 10,
    backgroundColor: '#E4E4E4FF',
    borderRadius: 8,
  },
  revealText: {
    marginLeft: 8,
    fontSize: 16,
  },
});
