import { StyleSheet } from 'react-native'
import React, { useState } from 'react'
import { addRecord } from '@/script/RecordDB';
import RecordModal from '@/constants/Modal';
import { Button, Icon, Input } from '@rneui/themed';
import { ThemedView } from '@/components/ThemedView';
import { useThemeColor } from '@/hooks/useThemeColor';

export default function RecordPage() {
  const textColor = useThemeColor({}, 'text')
  const [detail, onChangeDetail] = useState('');
  const [amount, onChangeAmount] = useState('');

  return (
    <ThemedView>
      <Input
        onChangeText={onChangeDetail}
        value={detail}
        placeholder="Details"
        style={{color: textColor}}
      />
      <Input
        onChangeText={onChangeAmount}
        value={amount}
        placeholder="Amount"
        keyboardType="numeric"
        style={{color: textColor}}
      />
      <Button
        onPress={async () => {
          if (amount !== '') {
            let date: Date = new Date();
            let newRecord: RecordModal = {
              detail: detail,
              amount: parseFloat(amount),
              timestamp: date.toISOString()
            };
            await addRecord(newRecord);
          }
        }}>
        <Icon name="add"></Icon>
      </Button>
    </ThemedView>
  )
}

const styles = StyleSheet.create({
})