import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  RefreshControl,
  StyleSheet,
  SectionList,
  Pressable,
  ActivityIndicator,
} from 'react-native';
import { useRouter } from 'expo-router';
import { TransactionItem } from '@/components/TransactionItem';
import { getTransactions } from '@/services/transactions';
import { GroupedTransactions, Transaction } from '@/models/Transaction';
import { formatDate } from '@/utils/date';
import { Ionicons } from '@expo/vector-icons';
import { authenticateWithBiometrics } from '@/services/auth';

export default function TransactionHistory() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [showSensitiveData, setShowSensitiveData] = useState(false);
  const [groupedTransactions, setGroupedTransactions] = useState<
    GroupedTransactions[]
  >([]);

  const accessSensitiveData = async () => {
    if (!showSensitiveData) {
      try {
        const success = await authenticateWithBiometrics();
        if (success) setShowSensitiveData(true);
        return true;
      } catch (error) {
        setShowSensitiveData(false);
        return false;
      }
    } else {
      setShowSensitiveData(false);
      return false;
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
    setLoading(true);
    setError(null);
    try {
      const data = await getTransactions();
      const sorted = sortTransactionsByDate(data);
      const grouped = groupTransactionsByDate(sorted);
      setGroupedTransactions(grouped);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    } finally {
      setLoading(false);
    }
  }, []);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadTransactions();
    setRefreshing(false);
  }, [loadTransactions]);

  React.useEffect(() => {
    loadTransactions();
  }, [loadTransactions]);

  const handleTransactionPress = async (id: string) => {
    if (!showSensitiveData) {
      const granted = await accessSensitiveData();
      if (granted)
        router.push({
          pathname: '/(main)/[id]',
          params: { id },
        });
    } else {
      router.push({
        pathname: '/(main)/[id]',
        params: { id },
      });
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>Error: {error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Pressable style={styles.revealButton} onPress={accessSensitiveData}>
        <Ionicons
          name={showSensitiveData ? 'eye-off' : 'eye'}
          size={24}
          color="#000"
        />
        <Text style={styles.revealText}>
          {showSensitiveData
            ? 'Hide Sensitive Information'
            : 'Reveal Sensitive Information'}
        </Text>
      </Pressable>
      <SectionList
        sections={groupedTransactions}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.itemDivider} />}
        renderItem={({ item }) => (
          <TransactionItem
            transaction={item}
            showSensitiveData={showSensitiveData}
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  notFoundText: {
    fontSize: 18,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    fontSize: 18,
  },
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
