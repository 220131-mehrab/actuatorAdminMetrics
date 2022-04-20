export interface SystemHealth {
    status: string;
    details: {
        db: {
            status: String,
            details: {
                database: String,
                hello: number
            }
        },
        diskSpace: {
            status: string,
            details: {
                total: number,
                free: number | string,
                threshold: number
            }
        }
    };
}