import { pool } from "../../db";
import type { IUser } from "./user.interface";
import bcrypt from "bcryptjs";

const createUserIntoDB = async (payload: IUser) => {
  const { name, email, password, age, role } = payload;

  // encrypting sensitive data in DB (salt round 12 recommended)
  const hashPassword = await bcrypt.hash(password, 12);

  const result = await pool.query(
    `
        INSERT INTO users(name, email, password, age, role) VALUES($1, $2, $3, $4, COALESCE($5,'user'))
        RETURNING *     
        `,
    [name, email, hashPassword, age, role],
  ); // role ui থেকে না সেট করলে null আসতে পারে। তাই COALESCE করে 'user' সেট করা হয়েছে। আমরা চাইলে if-else block দিয়েও করতে পারি কিন্তু সে ক্ষেত্রে query টা ২ বার লিখতে হবে।

  if (result.rows.length !== 0) delete result.rows[0].password; // omitting (hiding) password from response (if block added to prevent accessing the empty array and returning unexpected result)
  return result;
};

const getAllUsersFromDB = async () => {
  // * means all.
  const result = await pool.query(`
      SELECT * FROM users 
      `);
  if (result.rows.length !== 0) {
    result.rows.forEach((user) => delete user.password); // omitting (hiding) password from response
  }
  return result;
};

const getSingleUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
      SELECT * FROM users WHERE id=$1
      `,
    [id],
  );
  if (result.rows.length !== 0) delete result.rows[0].password; // omitting (hiding) password from response
  return result;
};

const updateUserInDB = async (payload: IUser, id: string) => {
  const { name, password, age, is_active } = payload;
  const result = await pool.query(
    `
    UPDATE users 
    SET 
    name=COALESCE($1,name),
    password=COALESCE($2,password),
    age=COALESCE($3,age),
    is_active=COALESCE($4,is_active) 

    WHERE id=$5 RETURNING *
    `,
    [name, password, age, is_active, id],
  );
  if (result.rows.length !== 0) delete result.rows[0].password; // omitting (hiding) password from response
  return result;
};

const deleteUserFromDB = async (id: string) => {
  const result = await pool.query(
    `
    DELETE FROM users WHERE id=$1  
      `,
    [id],
  );
  return result;
};

export const userService = {
  createUserIntoDB,
  getAllUsersFromDB,
  getSingleUserFromDB,
  updateUserInDB,
  deleteUserFromDB,
};
