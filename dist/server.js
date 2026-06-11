import express, {} from "express";
import { Pool, Result } from "pg";
import config from "./config";
const app = express();
const port = config.port;
app.use(express.json());
app.use(express.text());
app.use(express.urlencoded({ extended: true }));
const pool = new Pool({
    connectionString: config.connection_string,
});
const initDB = async () => {
    try {
        await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100),
      email VARCHAR(255) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      is_active BOOLEAN DEFAULT true,
      age INT,

      created_at TIMESTAMP DEFAULT NOW(),
      updated_at TIMESTAMP DEFAULT NOW()
      )
      `);
        console.log("Database connected Successfully!");
    }
    catch (error) {
        console.log(error);
    }
};
initDB();
// middleware request এর আগে use করতে হবে
app.get("/", (req, res) => {
    res.status(200).json({
        message: "Express Server",
        Author: "Next Level",
    });
});
// creating users
app.post("/api/users", async (req, res) => {
    try {
        // console.log(req.body);
        const { name, email, password, age } = req.body;
        // post দিয়ে আমরা কোন কিছু set করি বা create করি।
        const result = await pool.query(`
    INSERT INTO users(name, email, password, age) VALUES($1, $2, $3, $4)
    RETURNING *     
    `, [name, email, password, age]);
        // console.log("testing result:", result);
        res.status(201).json({
            success: true,
            message: "User Created Successfully !",
            data: result.rows[0],
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
});
// getting all users
app.get("/api/users", async (req, res) => {
    try {
        // * means all.
        const result = await pool.query(`
      SELECT * FROM users 
      `);
        res.status(200).json({
            success: true,
            message: "Users Retrieved Successfully",
            data: result.rows,
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
});
// getting a single user
app.get("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
      SELECT * FROM users WHERE id=$1
      `, [id]);
        //---- if there are no user with the id
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User Not found!",
                data: {},
            });
        }
        // -----if user exist with the id --
        res.status(200).json({
            success: true,
            message: "User Retrieved Successfully",
            data: result.rows[0],
        });
    }
    catch (error) {
        res.status(404).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
});
// --- Update user
app.put("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    const { name, password, age, is_active } = req.body;
    // console.log("Id : ", id);
    // console.log({ name, password, age, is_active });
    try {
        const result = await pool.query(`
    UPDATE users 
    SET 
    name=COALESCE($1,name),
    password=COALESCE($2,password),
    age=COALESCE($3,age),
    is_active=COALESCE($4,is_active) 

    WHERE id=$5 RETURNING *
    `, [name, password, age, is_active, id]);
        if (result.rows.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User Not found!",
            });
        }
        // console.log(result);
        res.status(200).json({
            success: true,
            message: "User updated successfully!",
            data: result.rows[0],
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
});
// --- Delete user
app.delete("/api/users/:id", async (req, res) => {
    const { id } = req.params;
    try {
        const result = await pool.query(`
    DELETE FROM users WHERE id=$1  
      `, [id]);
        console.log(result);
        if (result.rowCount === 0) {
            // rowCount 0 মানে user টাকে খুজেই পাওয়া যায়নি
            return res.status(404).json({
                success: false,
                message: "User Not found!",
            });
        }
        res.status(200).json({
            success: true,
            message: "User deleted successfully!",
            data: {},
        });
    }
    catch (error) {
        res.status(500).json({
            success: false,
            message: error.message,
            error: error,
        });
    }
});
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
//# sourceMappingURL=server.js.map