import * as dotenv from 'dotenv';
dotenv.config();

export const jwt_secret = process.env.JWT_SECRET;
export const paystack_key = process.env.PAYSTACK_KEY;
export const database_url = process.env.DATABASE_URL;
export const port = process.env.PORT;
