import React from 'react';
import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Transaction } from '@/models/Transaction';
import { formatTime } from '@/utils/date';

interface Props {
  transaction: Transaction;
  showSensitiveData: boolean;
  onPress: () => void;
}

export function TransactionItem({
  transaction,
  showSensitiveData,
  onPress,
}: Props) {
  return (
    <Pressable onPress={onPress}>
      <View style={styles.container}>
        <View style={styles.leftContent}>
          <Text style={styles.description}>{transaction.description}</Text>
          <Text style={styles.time}>{formatTime(transaction.date)}</Text>
        </View>
        {showSensitiveData ? (
          <Text
            style={[
              styles.amount,
              transaction.type === 'credit' ? styles.credit : styles.debit,
            ]}
          >
            {transaction.type === 'credit' ? '+' : '-'}
            RM{Math.abs(transaction.amount).toFixed(2)}
          </Text>
        ) : (
          <Text>***</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: 'white',
  },
  leftContent: {
    flex: 1,
  },
  time: {
    fontSize: 14,
    color: '#666',
  },
  description: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  amount: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  debit: {
    color: '#FF3B30',
  },
  credit: {
    color: '#34C759',
  },
});
