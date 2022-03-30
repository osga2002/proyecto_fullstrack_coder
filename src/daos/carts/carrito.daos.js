import cartSchema from "../../schema/carts.schema.js";

let carritoDao;

if (`${process.env.DB}` === "firebase") {
	const { default: carritoDaoFirebase } = await import(
		"../../containers/FirebaseContainer.js"
	);

	carritoDao = new carritoDaoFirebase("carts");
} else {
	const { default: carritoDaoMongo } = await import(
		"../../containers/MongoContainer.js"
	);

	carritoDao = new carritoDaoMongo("carts", cartSchema);
}

export default carritoDao;
