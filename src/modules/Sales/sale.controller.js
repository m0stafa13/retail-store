import { Router } from "express";
import { connection } from "../../database/database.js";

const router = Router()


// add new sale operation
router.post("/add-sale", (req, res) => {
    let { proId, quantitySold } = req.body
    if (!proId || !quantitySold) {
        return res.json({
            message: "all data require put it and try again "
        })
    } else if (isNaN(proId) || isNaN(quantitySold)) {
        return res.status(404).json({
            message: "invalid data ",
            rule: "data must be in integer"
        })
    }
    connection.execute(` select productId from product where productId = ${proId}`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            if (result.length > 0) {
                connection.execute(` insert into sales (proId , quantitySold )values (${proId} , ${quantitySold}) `, (error, addResult) => {
                    if (error) {
                        console.log(error);
                    }
                    if (addResult.affectedRows > 0) {
                        res.status(201).json({
                            message: "sale added successfully"
                        })
                    }
                })
            } else {
                res.status(404).json({
                    message: "product id is not found"
                })
            }
        }
    })


})

// get all sale operation 
router.get("/all", (req, res) => {
    connection.execute(` select * from sales `, (error, result) => {
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
// Get sales for specific product
router.get("/sale-product/:id", (req, res) => {
    let { id } = req.params
    if (isNaN(id)) {
        return res.status(404).json({
            message: "invalid id ",
            rule: "id must be number "
        })
    }
    connection.execute(`select quantitySold   , saleDate ,product.proName  , product.price from sales JOIN product on sales.proId= ? `, [id], (err, result) => {
        if (err) {
            console.log(err);
        }
        else if (result.length > 0) {
            res.status(200).json({
                message: "product data founded",
                product: result
            })
        } else {
            res.status(404).json({
                message: "product id is not found"
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

