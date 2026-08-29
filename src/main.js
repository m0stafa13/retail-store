import express from 'express'
import productRouter from './modules/Products/product.controller.js'

const app = express()
app.use(express.json())

app.use("/product", productRouter)




app.listen(3000, () => {
    console.log("server working on port 3000");
})
