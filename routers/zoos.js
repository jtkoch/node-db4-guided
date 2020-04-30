const express = require("express")
const db = require("../data/config")

const router = express.Router()

router.get("/", async (req, res, next) => {
	try {
		res.json(await db("zoos"))
	} catch(err) {
		next(err)
	}
})

router.get("/:id", async (req, res, next) => {
	try {
		const zoo = await db("zoos")
			.where("id", req.params.id)
			.first()
		
		if (!zoo) {
			return res.status(404).json({
				message: "Zoo not found",
			})
		}

		res.json(zoo)
	} catch(err) {
		next(err)
	}
})

router.get("/:id/animals", async (req, res, next) => {
	try {
		const animals = await db("zoos_animals as za")
			.join("zoos as z", "z.id", "za.zoo_id")
			.join("animals as a", "a.id", "za.animal_id")
			.join("species as s", "s.id", "a.species_id")
			.where("za.zoo_id", req.params.id)
			// we can still utilize wildcards with table name prefixes.
			// so "select all the columns from the animals table, but nothing else"
			.select(
				"a.id",
				"a.name",
				"s.name as species",
				"za.from_date",
				"za.to_date",
			)

		res.json(animals)		
	} catch (err) {
			next(err)
	}
})

module.exports = router