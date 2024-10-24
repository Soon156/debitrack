import { StyleSheet } from 'react-native'
import React from 'react'
import { ThemedView } from '@/components/ThemedView'
import { Button, Icon } from '@rneui/themed'
import { dropTable } from '@/script/RecordDB'
import { exportDatabase, importDatabase } from '@/script/exportImportDB'
import { signIn, updateDB } from '@/script/googleAPIs'

export default function SettingPage() {
  return (
    <ThemedView>
      <Button radius={"sm"} type="solid" onPress={() => {
        signIn();
      }}>
        <Icon name="login" type="material-community" color="white" />
        Login Account
      </Button>
      <Button radius={"sm"} type="solid" onPress={() => {
        importDatabase();
      }}>
        <Icon name="database-import" type="material-community" color="white" />
        Import DB
      </Button>
      <Button radius={"sm"} type="solid" onPress={() => {
        exportDatabase();
      }}>
        <Icon name="database-export" type="material-community" color="white" />
        Export DB
      </Button>
      <Button radius={"sm"} type="solid" onPress={() => {
        // TODO add alert before sync - overwrite issue
        updateDB();
      }}>
        <Icon name="database-sync" type="material-community" color="white" />
        Sync DB
      </Button>
      <Button radius={"sm"} type="solid"
        onPress={() => dropTable()}>
        <Icon name="database-remove" type="material-community" color="white" />
        Reset DB
      </Button>
    </ThemedView>
  )
}

const styles = StyleSheet.create({

})