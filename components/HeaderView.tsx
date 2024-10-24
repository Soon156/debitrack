import { StyleSheet, Text, View } from 'react-native'
import React, { PropsWithChildren } from 'react'
import { ThemedView } from './ThemedView';
import { ThemedText } from './ThemedText';

interface HeaderViewProps {
    amount: number;
  }

export default function HeaderView({amount}: HeaderViewProps) {

    return (
        <ThemedView>
            <ThemedText>${amount}</ThemedText>
        </ThemedView>
    )
}

const styles = StyleSheet.create({})