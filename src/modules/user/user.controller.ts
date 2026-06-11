import type { Request, Response } from "express";
import { pool } from "../../db";
import { userService } from "./user.service";
import sendResponse from "../../utility/sendResponse";

const createUser = async (req: Request, res: Response) => {
  // console.log(req.body);
  // const { name, email, password, age } = req.body;
  try {
    const result = await userService.createUserIntoDB(req.body);
    // console.log("testing result:", result);

    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "User Created successfully!",
      data: result.rows[0],
    });
  } catch (error: any) {
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getAllUser = async (req: Request, res: Response) => {
  console.log("declaration merging test- req.user", req.user);
  try {
    const result = await userService.getAllUsersFromDB();
    // res.status(201).json();
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Users Retrieved Successfully",
      data: result.rows,
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const getSingleUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.getSingleUserFromDB(id as string);
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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const updateUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.updateUserInDB(req.body, id as string);

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

const deleteUser = async (req: Request, res: Response) => {
  const { id } = req.params;
  try {
    const result = await userService.deleteUserFromDB(id as string);

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
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: error.message,
      error: error,
    });
  }
};

export const userController = {
  createUser,
  getAllUser,
  getSingleUser,
  updateUser,
  deleteUser,
};
