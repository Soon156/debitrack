import RecordModal, { DB_NAME, TABLE_NAME } from '../constants/Modal';
import { openDatabaseAsync } from 'expo-sqlite';

export async function fetchRecords() {
    const db = await openDatabaseAsync(DB_NAME.default);
    const query = `SELECT * FROM ${TABLE_NAME.records} ORDER BY timestamp DESC;`
    const result = await db.getAllAsync<RecordModal>(query);

    return result;
}

export async function addRecord(record: RecordModal) {
    const db = await openDatabaseAsync(DB_NAME.default);
    let query = `INSERT INTO ${TABLE_NAME.records} (detail, amount, timestamp) VALUES ('${record.detail}', '${record.amount}', '${record.timestamp}')`
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
    let query = `SELECT SUM(amount) FROM ${TABLE_NAME.records} `;
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

    const db = await openDatabaseAsync(DB_NAME.default);
    const result = await db.getFirstAsync<{ "SUM(amount)": number } | null>(query);
    return result && result["SUM(amount)"] ? result["SUM(amount)"] : 0;
}

export async function initDB() {
    const db = await openDatabaseAsync(DB_NAME.default);
    await db.execAsync(`
    PRAGMA journal_mode = WAL;

    CREATE TABLE IF NOT EXISTS ${TABLE_NAME.records} (
        id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL, 
        detail TEXT NOT NULL, 
        amount REAL NOT NULL,
        timestamp TEXT NOT NULL
    );

    CREATE TABLE IF NOT EXISTS ${TABLE_NAME.setting} (
        key TEXT PRIMARY KEY,
        value TEXT
    );

    INSERT INTO ${TABLE_NAME.setting} (key, value)
    SELECT 'last_sync', '-1'
    WHERE NOT EXISTS (
        SELECT 1 FROM ${TABLE_NAME.setting} WHERE key = 'last_sync'
    );
    `
    );
}

export async function dropTable() {
    const db = await openDatabaseAsync(DB_NAME.default);
    await db.execAsync(`
        DROP TABLE IF EXISTS ${TABLE_NAME.records};
        DROP TABLE IF EXISTS ${TABLE_NAME.setting};
        `);
}

export async function updateSyncTime(time: string) {
    const db = await openDatabaseAsync(DB_NAME.default);
    await db.execAsync(`UPDATE ${TABLE_NAME.setting} SET value = '${time}' WHERE key = 'last_sync';`);
}

export async function getLastSyncTime() {
    const db = await openDatabaseAsync(DB_NAME.default);
    const query = `SELECT value FROM ${TABLE_NAME.setting} WHERE key = 'last_sync';`;

    const result = await db.getFirstAsync<{ "value": string } | null>(query);
    return result && result.value ? result.value : '-1';
}