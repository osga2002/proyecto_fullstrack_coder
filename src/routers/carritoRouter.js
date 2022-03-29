import { Router } from "express";
import cartsDao from "../daos/carts/carts.daos.js";
import productsDao from "../daos/products/products.daos.js";

export const carritoRouter = Router();

const cartsContainer = cartsDao;
const productsContainer = productsDao;

// Endpoints Cart

carritoRouter.get("/", async (req, res) => {
	res.json(await cartsContainer.getAll());
});

carritoRouter.get("/:id", async (req, res) => {
	const cartId = req.params.id;
	const cart = await cartsContainer.getById(cartId);

	if (cart) {
		res.json(cart);
	} else {
		res.json({ error: "carrito no encontrado" });
	}
});

carritoRouter.get("/:id/productos", async (req, res) => {
	const cartId = req.params.id;
	const cart = await cartsContainer.getById(cartId);

	if (cart) {
		res.json({ productos: cart.productos });
	} else {
		res.json({ error: "carrito no encontrado" });
	}
});

carritoRouter.post("/", async (req, res) => {
	res.json(await cartsContainer.save(req.body));
});

carritoRouter.post("/:id/productos", async (req, res) => {
	const cart = await cartsContainer.getById(req.params.id);
	const product = await productsContainer.getById(req.body.id);
	cart.productos.push(product);

	res.json(await cartsContainer.updateById(req.params.id, cart));
});

carritoRouter.delete("/", async (req, res) => {
	res.send(await cartsContainer.deleteAll());
});

carritoRouter.delete("/:id", async (req, res) => {
	const cartId = req.params.id;
	res.send(await cartsContainer.deleteById(cartId));
});

carritoRouter.delete("/:id/productos/:id_prod", async (req, res) => {
	const cartId = req.params.id;
	const productId = req.params.id_prod;
	try {
		const cart = await cartsContainer.getById(cartId);
		const isInCart = await cart.productos.some(
			(producto) => producto._id.toString() === productId
		);

		if (isInCart) {
			cart.productos = cart.productos.filter(
				(producto) => producto._id.toString() !== productId
			);
			res.json(await cartsContainer.updateById(req.params.id, cart));
		} else {
			throw new Error(`El producto ${productId} no esta en el carrito`);
		}
	} catch (err) {
		throw new Error(`Error al eliminar producto: ${err}`);
	}
});
