export const RECORD_TABLE_NAME: string = 'records';
export const DB_NAME: string = 'debitrack-db';
export const RESET_DB: boolean = false;

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