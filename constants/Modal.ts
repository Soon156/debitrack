export const RESET_DB: boolean = false;

export const TABLE_NAME: Readonly<{
    records: string;
    setting: string;
}> = {
    records: 'records',
    setting: 'setting',
};

export const DB_NAME: Readonly<{
    default: string;
    shm: string;
    wal: string;
}> = {
    default: 'debitrack-db',
    shm: 'debitrack-db-shm',
    wal: 'debitrack-db-wal',
};

export interface RecordModal {
    id?: number;
    detail: string;
    amount: number;
    timestamp: string;
    category?: string;
    account?: string;
    iconId?: string;
}

export default RecordModal;