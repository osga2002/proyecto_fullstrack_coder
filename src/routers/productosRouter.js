import { Router } from "express";
import productsDao from "../daos/products/products.daos.js";

export const productosRouter = Router();

const productsContainer = productsDao;

let administrador = true;

const authError = (req) => ({
	error: -1,
	description: `Ruta ${req.baseUrl} método ${req.method} no autorizada`,
});

// Endpoints products
productosRouter.get("/", async (req, res) => {
	res.json(await productsContainer.getAll());
});

productosRouter.get("/:id", async (req, res) => {
	const productId = req.params.id;
	const product = await productsContainer.getById(productId);
	console.log("product:", product);
	if (product) {
		res.json(product);
	} else {
		res.json({ error: "producto no encontrado" });
	}
});

productosRouter.post("/", async (req, res) => {
	if (administrador) {
		res.json(await productsContainer.save(req.body));
	} else {
		res.send(authError(req));
	}
});

productosRouter.put("/:id", (req, res) => {
	const productId = req.params.id;
	if (administrador) {
		productsContainer.updateById(productId, {
			...req.body,
		});
		res.send(productsContainer.getById(productId));
	} else {
		res.send(authError(req));
	}
});

productosRouter.delete("/:id", async (req, res) => {
	const productId = req.params.id;
	administrador
		? res.send(await productsContainer.deleteById(productId))
		: res.send(authError);
});

productosRouter.delete("/", async (req, res) => {
	if (administrador) {
		res.send(await productsContainer.deleteAll());
	} else {
		res.send(authError(req));
	}
});
