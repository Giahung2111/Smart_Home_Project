export interface IMemberTableProps {
    key: string,
    UserID: number,
    FullName: string,
    // Email: string,
    Phone?: string,
    Role: string,
    Status: string
}

export interface IMemberDrawerProps {
    FullName?: string,
    // Email?: string,
    Phone?: string,
    Role?: string,
}
