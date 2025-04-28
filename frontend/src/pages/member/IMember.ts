export interface IMemberTableProps {
    key: string,
    id: number,
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
