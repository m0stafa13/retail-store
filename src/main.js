import express from 'express'
import productRouter from './modules/Products/product.controller.js'
import supRouter from './modules/Suppliers/suppliers.controller.js'
import saleRouter from './modules/Sales/sale.controller.js'
import categoryRouter from './modules/category/category.controller.js'
const app = express()
app.use(express.json())

app.use("/product", productRouter)
app.use("/suppliers", supRouter)
app.use("/sale",saleRouter)
app.use("/category" , categoryRouter)


app.listen(3000, () => {
    console.log("server working on port 3000");
})
