import { StyleSheet, Text, View } from 'react-native'
import React, { PropsWithChildren } from 'react'

interface HeaderViewProps {
    amount: number;
  }

export default function HeaderView({amount}: HeaderViewProps) {

    return (
        <View>
            <Text>${amount}</Text>
        </View>
    )
}

const styles = StyleSheet.create({})