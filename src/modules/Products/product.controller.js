import { Router } from "express";
import { connection } from "../../database/database.js";

const router = Router()
// get all product 
router.get("/get-all-product", (req, res) => {
    connection.execute(` select * from product `, (error, result) => {
        if (error) {
            console.log(error);
        } else {
            res.status(200).json({
                message: "success operation ",
                products: result
            })
        }
    })
})
// add new product 
router.post("/add-product", async (req, res) => {
    let { proName, price, stockQuantity, supplierId } = req.body
    if (!proName || !price || !stockQuantity || !supplierId) {
        return res.json({
            message: "all data require put it and try again "
        })
    }
    connection.query(` SELECT supplierId FROM suppliers where supplierId =?`, [supplierId], (error, data) => {
        if (error) {
            console.log(error);
        }
        if (data.length > 0) {
            connection.execute(` insert into product ( proName  , price , stockQuantity , supplierId ) values ( ?,?,?,?  ) `, [proName, price, stockQuantity, supplierId], (err, result) => {
                if (err) {
                    console.log(err);
                } else {
                    if (result.affectedRows > 0) {
                        return res.status(201).json({
                            message: "product added successfully "
                        })
                    }
                }
            })
        } else {
            res.json({
                message: "this supplier is not found"
            })
        }
    })
})
// get product by id 
router.get("/get-product-by-id/:id", (req, res) => {
    let { id } = req.params
    if (!id) {
        res.status(404).json({
            message: "id is require "
        })
    } else if (isNaN(id)) {
        return res.status(404).json({
            message: "invalid id ",
            rule: "id must be number "
        })
    } else {
        connection.execute(` select * from product where productId = ? `, [id], (error, result) => {
            if (error) {
                console.log(error);
            }
            else if (result.length > 0) {
                res.status(200).json({
                    message: "product data founded ",
                    product: result
                })
            } else {
                res.json({
                    message: "no product founded"
                })
            }
        })
    }
})
// update product data 
router.patch("/update/id/:id", (req, res) => {
    let { id } = req.params
    let { name, pPrice, pStockQuantity } = req.body
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
    connection.execute(` select proName , price ,stockQuantity from product where productId  = ? `, [id], (error, ressul) => {
        if (error) {
            console.log(error);
        } else {
            let { proName, price, stockQuantity } = ressul[0]
            connection.execute(` update product set    proName ="${name ? name : proName}" , price ="${pPrice ? pPrice : price}" , stockQuantity  ="${pStockQuantity ? pStockQuantity : stockQuantity}"  where productId=${id}  `, (err, result) => {
                if (err) {
                    console.log(err);
                }
                else if (result.affectedRows > 0) {
                    res.status(200).json({
                        message: "data updated successfully "
                    })
                } else {
                    res.json({
                        message: "product not found "
                    })
                }
            })
        }
    })




})
// delete product data 

router.delete("/delete-product/:id", (req, res) => {
    let { id } = req.params
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

    connection.execute(` delete  from product where productId = ${id} `, (error, result) => {
        if (error) {
            console.log(error);
        }
        else if (result.affectedRows > 0) {
            res.json({
                message: "product deleted successfully "
            })
        } else if (result.affectedRows == 0) {
            res.json({
                message: "product not found "
            })
        }
    })
})
router.post("/create-category", (req, res) => {
    connection.query(`    alter table product add category if not exists `)
})
router.use("/*path", (req, res) => {
    res.status(404).json({
        message: "path not fund"
    })
})

export default router

