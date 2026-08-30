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
    connection.query(` SELECT * FROM product ;  SELECT * FROM suppliers`, (error, data) => {
        if (error) {
            console.log(error);
        } else {
            let [products, sups] = data
            let checkData = products.find((pro) => {
                return pro.proName == proName
            })
            let checkSup = sups.find((supplier) => {
                return supplier.supplierId == supplierId
            })
            if (!checkSup) {
                return res.status(404).json({
                    message: "this supplier is not found "
                })
            }
            else if (checkData) {
                return res.json({
                    message: "this product already exists try another one  "
                })
            } else {
                connection.execute(` insert into product ( proName  , price , stockQuantity , supplierId ) values ( "${proName}","${price} ","${stockQuantity} ","${supplierId}"  ) `, (err, result) => {
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
            }
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
        connection.execute(` select * from product where productId = ${id} `, (error, result) => {
            if (error) {
                console.log(error);
            }
            else {
                res.status(200).json({
                    message: "product data founded ",
                    product: result
                })
            }
        })
    }
})
// update product data 
router.patch("/update/id/:id", (req, res) => {
    let { id } = req.params
    let { proName, price, stockQuantity } = req.body
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
    connection.execute(` update product set    proName ="${proName}" , price ="${price}" , stockQuantity  ="${stockQuantity}"  where productId=${id}  `, (err, result) => {
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

