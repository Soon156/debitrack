import RecordModal, { DB_NAME, RECORD_TABLE_NAME, RESET_DB } from '../constants/Modal';
import { openDatabaseAsync } from 'expo-sqlite';

export async function fetchRecords() {
    const db = await openDatabaseAsync(DB_NAME);
    // const query1 = `SELECT * FROM ${RECORD_TABLE_NAME}`;
    const query2 = `SELECT * FROM ${RECORD_TABLE_NAME} ORDER BY timestamp DESC;`
    const result = await db.getAllAsync<RecordModal>(query2);

    return result;
}

export async function addRecord(record: RecordModal) {
    const db = await openDatabaseAsync(DB_NAME);
    let query = `INSERT INTO ${RECORD_TABLE_NAME} (detail, amount, timestamp) VALUES ('${record.detail}', '${record.amount}', '${record.timestamp}')`
    console.log(query);
    let result = await db.runAsync(query);
    console.log(result.lastInsertRowId, result.changes);
}

export function updateRecord() {
}

export function deleteRecords() {

}

export function selectRecord() {
}

export function getAmountFromAccount() {

}

export async function getAmountByDateRange(dateRange?: String, day?: number, dateType?: String) {
    let query = `SELECT amount FROM ${RECORD_TABLE_NAME} `;
    // Today
    if (dateRange) {
        switch (dateRange) {
            case 'today':
                query += `WHERE timestamp >= datetime('now', 'localtime')`;
                break;
            case 'yesterday':
                query += `WHERE timestamp >= datetime('now', '-1 day', 'localtime') AND timestamp < datetime('now', 'localtime')`;
                break;
            case 'thisWeek':
                query += `WHERE timestamp >= datetime('now', '-7 day', 'localtime')`;
                break;
            case 'thisMonth':
                query += `WHERE timestamp >= datetime('now', '-1 month', 'localtime')`;
                break;
            default:
                break;
        }
    }

    const db = await openDatabaseAsync(DB_NAME);
    const result = await db.getFirstAsync<{ amount: number }>(query);
    return result?.amount ? result?.amount : 0;
}

export async function initDB() {
    const db = await openDatabaseAsync(DB_NAME);
    if (RESET_DB) {
        await db.execAsync(`DROP TABLE IF EXISTS ${RECORD_TABLE_NAME}`);
    }
    await db.execAsync(`
    PRAGMA journal_mode = WAL;
    CREATE TABLE IF NOT EXISTS ${RECORD_TABLE_NAME} (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
        detail TEXT NOT NULL, 
        amount REAL NOT NULL,
        timestamp TEXT NOT NULL
    );
    `);
}
