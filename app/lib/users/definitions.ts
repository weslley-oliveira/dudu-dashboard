// This file contains type definitions for your data.
// It describes the shape of the data, and what data type each property should accept.
// For simplicity of teaching, we're manually defining these types.
// However, these types are generated automatically if you're using an ORM such as Prisma.
export type User = {
  id: string;
  username: string;
  password_hash: string;
  email: string;
  full_name: string;
  user_type: string;  // 'customer', 'mechanic', 'attendant', etc.
  avatar_url?: string;  // Optional
  phone: string;
  created_at: Date;
  updated_at: Date;
};