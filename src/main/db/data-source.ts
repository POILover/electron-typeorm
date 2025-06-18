import { DataSource } from "typeorm";

let _AppDataSource: DataSource | null = null;

export const setAppDataSource = (dataSource: DataSource) => {
    _AppDataSource = dataSource;
}

export const getAppDataSource = () => {
    if (!_AppDataSource) {
        throw new Error("AppDataSource is not initialized. Please set it using setAppDataSource.");
    }
    return _AppDataSource;
}