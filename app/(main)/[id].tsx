import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getTransactionById } from '@/services/transactions';
import { Transaction } from '@/models/Transaction';
import { useBiometrics } from '@/hooks/useBiometrics';
import { formatDate, formatTime } from '@/utils/date';

export default function TransactionDetail() {
  const { id } = useLocalSearchParams();
  const [transaction, setTransaction] = useState<Transaction | null>(null);
  const { isAuthenticated, authenticate } = useBiometrics();

  useEffect(() => {
    const loadTransaction = async () => {
      if (typeof id === 'string') {
        const data = await getTransactionById(id);
        setTransaction(data);
      }
    };
    loadTransaction();
  }, [id]);

  if (!transaction) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <View style={styles.header}>
          <View style={styles.iconContainer}>
            <MaterialCommunityIcons
              name={
                transaction.type === 'credit'
                  ? 'arrow-down-circle'
                  : 'arrow-up-circle'
              }
              size={40}
              color={transaction.type === 'credit' ? '#34C759' : '#FF3B30'}
            />
          </View>
          <View style={styles.headerText}>
            <Text style={styles.description}>{transaction.description}</Text>
            <Text style={styles.type}>{transaction.type}</Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <DetailItem
            icon="calendar-outline"
            label="Date"
            value={formatDate(transaction.date)}
          />
          <DetailItem
            icon="time-outline"
            label="Time"
            value={formatTime(transaction.date)}
          />
          <DetailItem
            icon="card-outline"
            label="Amount"
            value={
              isAuthenticated
                ? `${transaction.type === 'credit' ? '+' : '-'}RM${Math.abs(transaction.amount).toFixed(2)}`
                : '••••'
            }
            valueStyle={[
              styles.amount,
              transaction.type === 'credit' ? styles.credit : styles.debit,
            ]}
            onPress={isAuthenticated ? undefined : authenticate}
          />
        </View>
      </View>
    </ScrollView>
  );
}

interface DetailItemProps {
  icon: React.ComponentProps<typeof Ionicons>['name'];
  label: string;
  value: string;
  valueStyle?: object;
  onPress?: () => void;
}

function DetailItem({
  icon,
  label,
  value,
  valueStyle,
  onPress,
}: DetailItemProps) {
  return (
    <View style={styles.detailItem}>
      <Ionicons
        name={icon}
        size={24}
        color="#007AFF"
        style={styles.detailIcon}
      />
      <View style={styles.detailText}>
        <Text style={styles.detailLabel}>{label}</Text>
        <Pressable onPress={onPress} disabled={!onPress}>
          <Text style={[styles.detailValue, valueStyle]}>{value}</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F0F0F5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: '#007AFF',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 10,
    margin: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  iconContainer: {
    marginRight: 16,
  },
  headerText: {
    flex: 1,
  },
  description: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  type: {
    fontSize: 16,
    color: '#666',
    textTransform: 'capitalize',
  },
  detailsContainer: {
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
    paddingTop: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  detailIcon: {
    marginRight: 16,
  },
  detailText: {
    flex: 1,
  },
  detailLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 2,
  },
  detailValue: {
    fontSize: 18,
    color: '#333',
  },
  amount: {
    fontWeight: 'bold',
    fontSize: 20,
  },
  debit: {
    color: '#FF3B30',
  },
  credit: {
    color: '#34C759',
  },
});
