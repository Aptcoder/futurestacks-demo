/* eslint-disable @typescript-eslint/no-unused-vars */
// custom-request.d.ts
import { Request } from 'express';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      role: string;
    }; // You can replace 'any' with a specific user interface if needed
  }
}
