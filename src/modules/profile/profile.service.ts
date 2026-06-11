import { error } from "node:console";
import { pool } from "../../db";

const createProfileIntoDB = async (payload: any) => {
  // console.log("payload", payload);
  const { user_id, bio, address, phone, gender } = payload;
  // first check if the user is exists or not.
  const user = await pool.query(
    `
    SELECT * FROM users WHERE id=$1
        `,
    [user_id],
  );
  //   console.log(user);
  if (user.rows.length === 0) {
    throw new Error("User not Exist !"); // as there are no response interface here.
  }

  const result = await pool.query(
    `
        INSERT INTO profiles(user_id, bio, address, phone, gender) VALUES($1,$2,$3,$4,$5) RETURNING *
        `,
    [user_id, bio, address, phone, gender],
  );
  // RETURNING * (all) - means to give/show data in response ui
  return result;
};

export const profileService = {
  createProfileIntoDB,
};
