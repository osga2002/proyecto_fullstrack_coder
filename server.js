import "dotenv/config";
import express, { json, urlencoded } from "express";
import { productosRouter } from "./src/routers/productosRouter.js";
import { carritoRouter } from "./src/routers/carritoRouter.js";
const app = express();

app.use(json());
app.use(urlencoded({ extended: true }));
app.use(express.static("public"));

app.use("/api/productos", productosRouter);
app.use("/api/carrito", carritoRouter);

const PORT = process.env.PORT;

const server = app.listen(PORT, () => {
	console.log(`Corriendo el servidor local host http://localhost:${PORT}`);
});

server.on("error", (error) => console.log(`Error en servidor ${error}`));
