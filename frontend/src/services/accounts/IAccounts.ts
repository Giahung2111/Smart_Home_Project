export interface IGoogleJwtPayload {
    iss: string;              // Issuer
    sub: string;              // Subject (unique ID)
    email: string;            // User's email
    email_verified: boolean;  // If email is verified
    name: string;             // Full name
    given_name: string;       // First name
    family_name: string;      // Last name
    picture: string;         // Profile picture URL
    locale?: string;           // User's locale
    iat: number;              // Issued at timestamp
    exp: number;              // Expiration timestamp
    jti: string;              // JWT ID
}