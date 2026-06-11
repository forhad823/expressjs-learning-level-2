export interface IUser {
  name: string;
  email: string;
  password: string;
  age: number;
  is_active?: boolean;
  role?: "admin" | "agent" | "user"; // was string
}
