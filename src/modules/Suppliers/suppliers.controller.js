import { Router } from "express";
import { connection } from "../../database/database.js";

const router = Router()
// add new supplier 
router.post("/add-supplier", (req, res) => {
    let { supPhone, supName } = req.body
    if (!supName || !supPhone) {
        return res.json({
            message: "all data require put it and try again "
        })
    } else if (supPhone.length !== 11) {
        return res.json({
            msg: "wrong phone number"
        })
    }
    connection.execute(` select supPhone from suppliers `, (fError, fData) => {
        if (fError) {
            console.log(fError);
        }
        let checkData = fData.find((sup) => {
            return sup.supPhone == supPhone
        })
        if (!checkData) {
            connection.query(`insert INTO suppliers(supName , supPhone)VALUES ("${supName}" , "${supPhone}")`, (error, data) => {
                if (error) {
                    console.log(error);
                } else {
                    if (data.affectedRows > 0) {
                        res.json({
                            message: "supplier added successfully  "
                        })
                    } else {
                        res.json({
                            message: "try again "
                        })
                    }
                }
            })
        } else {
            res.json({
                message: "user already exists"
            })
        }
    })

})
// get all supplier 
router.get("/get-all-supplier", (req, res) => {
    connection.execute(` select * from suppliers `, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.status(200).json({
                message: "success operation",
                products: result
            })
        }
    })
})
// update product data 
router.patch("/supplier/id/:id", (req, res) => {
    let { id } = req.params
    let { supName, supPhone } = req.body
    if (!id) {
        return res.status(404).json({
            message: "id is require "
        })
    } else if (isNaN(id)) {
        return res.status(404).json({
            message: "invalid id ",
            rule: "id must be number "
        })
    }
    connection.execute(` select supPhone from suppliers `, (fError, fData) => {
        if (fError) {
            console.log(fError);
        }
        let checkData = fData.find((sup) => {
            return sup.supPhone == supPhone
        })
        if (!checkData) {
            connection.execute(` update suppliers set    supName  ="${supName}" , supPhone ="${supPhone}"   where supplierId =${id}  `, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else if (result.affectedRows > 0) {
                    res.status(200).json({
                        message: "data updated successfully "
                    })
                } else {
                    res.json({
                        message: "supplier is not found "
                    })
                }
            })
        } else {
            res.json({
                message: " try with another number "
            })
        }
    })
})
router.use("/*path", (req, res) => {
    res.status(404).json({
        message: "path not fund"
    })
})

export default router

