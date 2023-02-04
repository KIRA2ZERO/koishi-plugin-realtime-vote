import { Context, Schema } from 'koishi';
export declare const name = "realtime-vote";
export interface Config {
}
export declare const Config: Schema<Config>;
declare module 'koishi' {
    interface Tables {
        vote_manager_table: vote_manager_table;
    }
}
export interface vote_manager_table {
    id: number;
    programName: string;
    counts: any;
    participant: string[];
    owner: string;
}
export declare function apply(ctx: Context): void;
