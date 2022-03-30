import { Router } from "express";
import carritoDao from "../daos/carts/carrito.daos.js";
import productsDao from "../daos/products/products.daos.js";

export const carritoRouter = Router();

const carritoContainer = carritoDao;
const productosContainer = productsDao;

// Endpoints Cart

carritoRouter.get("/", async (req, res) => {
	res.json(await carritoContainer.getAll());
});

carritoRouter.get("/:id", async (req, res) => {
	const cartId = req.params.id;
	const cart = await carritoContainer.getById(cartId);

	if (cart) {
		res.json(cart);
	} else {
		res.json({ error: "carrito no encontrado" });
	}
});

carritoRouter.get("/:id/productos", async (req, res) => {
	const cartId = req.params.id;
	const cart = await carritoContainer.getById(cartId);

	if (cart) {
		res.json({ productos: cart.productos });
	} else {
		res.json({ error: "carrito no encontrado" });
	}
});

carritoRouter.post("/", async (req, res) => {
	res.json(await carritoContainer.save(req.body));
});

carritoRouter.post("/:id/productos", async (req, res) => {
	const cart = await carritoContainer.getById(req.params.id);
	const product = await productosContainer.getById(req.body.id);
	cart.productos.push(product);

	res.json(await carritoContainer.updateById(req.params.id, cart));
});

carritoRouter.delete("/", async (req, res) => {
	res.send(await carritoContainer.deleteAll());
});

carritoRouter.delete("/:id", async (req, res) => {
	const cartId = req.params.id;
	res.send(await carritoContainer.deleteById(cartId));
});

carritoRouter.delete("/:id/productos/:id_prod", async (req, res) => {
	const cartId = req.params.id;
	const productId = req.params.id_prod;
	try {
		const cart = await carritoContainer.getById(cartId);
		const isInCart = await cart.productos.some(
			(producto) => producto._id.toString() === productId
		);

		if (isInCart) {
			cart.productos = cart.productos.filter(
				(producto) => producto._id.toString() !== productId
			);
			res.json(await carritoContainer.updateById(req.params.id, cart));
		} else {
			throw new Error(`El producto ${productId} no esta en el carrito`);
		}
	} catch (err) {
		throw new Error(`Error al eliminar producto: ${err}`);
	}
});
