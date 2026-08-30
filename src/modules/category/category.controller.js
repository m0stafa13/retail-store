import { Router } from "express";
import { connection } from "../../database/database.js";
const router = Router()
let sqlGetAllCol = "SHOW COLUMNS FROM product"
let sql = "ALTER TABLE product DROP category"
let changeDataType = "alter table suppliers MODIFY column supPhone varchar(?)"
// add category column 
router.post("/add-category-col", (req, res) => {
    connection.query(sqlGetAllCol, (err, result) => {
        if (err) {
            console.log(err);
        }
        let checkColl = result.find((col) => {
            return col.Field == "category"
        })
        if (!checkColl) {
            connection.query(sql, (error, creation) => {
                if (error) {
                    console.log(error);
                } else {
                    res.status(201).json({
                        message: "category column created "
                    })
                }
            })
        } else {
            res.status(409).json({
                message: "column already exists"
            })
        }
    })
})
// delete category column 
router.delete("/delete-category-col", (req, res) => {
    connection.query(sqlGetAllCol, (err, result) => {
        if (err) {
            console.log(err);
        }
        let checkColl = result.find((col) => {
            return col.Field == "category"
        })
        if (!checkColl) {
            res.status(404).json({
                message: "column already not found "
            })
        } else {
            connection.query(sql, (error, deleteResult) => {
                if (error) {
                    console.log(error);
                } else {
                    res.status(200).json({
                        message: "column deleted successfully"
                    })
                }
            })
        }
    })
})
//change data type for sup phone number 
router.post("/change-type-col", (req, res) => {
    let colNum = req.body
    connection.query(`alter table suppliers MODIFY column supPhone varchar(3)`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            res.status(200).json({
                message: "datatype size updated successfully"
            })
        }
    })
})

router.use("", (req, res) => {
    res.status(404).json({
        message: "server not found "
    })
})
export default router