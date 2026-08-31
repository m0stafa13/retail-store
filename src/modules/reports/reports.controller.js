import { Router } from "express"
import { connection } from "../../database/database.js"
const router = Router()

// get total quantity sold to product 
router.get("/get-quantity-sold", (req, res) => {
    let { name } = req.body
    if (!name) {
        return res.json({
            message: "name require put it and try again "
        })
    }
    connection.execute(`SELECT SUM(stockQuantity) as data FROM product WHERE proName =? `, [name], (err, result) => {
        if (err) {
            console.log(err);
        }
        else {
            let { data } = result[0]
            data ? res.status(200).json({
                result: data
            }) : res.json({
                message: "this product is not fund"
            })
        }
    })
})

// report highest stock 
router.get("/get-highest-stock", (req, res) => {
    connection.query(`SELECT proName as name , MAX(stockQuantity)  as quantity  FROM product`, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            let { name, quantity } = result[0]
            name ? res.status(200).json({
                message: "this is the highest data stocked",
                productName: name,
                quantity: quantity
            }) : res.status(404).json({
                message: "nodata founded"
            })
        }
    })
})
// select sup with name starts with 
router.get("/get-sup-name-with/:name", (req, res) => {
    let { name } = req.params
    connection.execute(`SELECT supName FROM suppliers WHERE supName LIKE "${name}%"`, (err, result) => {
        if (err) {
            console.log(err);
        } else if (result.length > 0) {
            let { supName } = result[0]
            res.status(200).json({
                message: "supplier found",
                user: supName
            })
        } else {
            res.json({
                message: "not found "
            })
        }
    })

})
// get product have never soled
router.get("/get-product-never-sold", (req, res) => {
    connection.execute(`SELECT productId , proName ,price,stockQuantity  FROM product left JOIN sales on product.productId = sales.proId WHERE sales.proId is null `, (err, result) => {
        if (err) {
            console.log(err);
        } else if (result.length > 0) {
            res.status(200).json({
                message: "this is product have never sold",
                product: result
            })
        } else {
            res.json({
                message: "product not found"
            })
        }
    })
})
// get all sales 
router.get("/get-all-sales", (req, res) => {
    connection.execute(`SELECT productId,proName, quantitySold ,saleDate,price,stockQuantity FROM sales JOIN product on sales.proId = product.productId `, (err, result) => {
        if (err) {
            console.log(err);
        } else if (result.length > 0) {
            res.status(200).json({
                message: "all product sales information",
                product:result
            })
        }
    })
})
export default router


