const Whiskey = require("./whiskey.model");
const auth = require("./auth-middleware.js");

module.exports = function(app) {

    // create a whiskey
    app.post("/api/v1/whiskey", auth, function(request, response, next) {
        try {
            var whiskey = new Whiskey({
                name: request.fields.name,
                distillery: request.fields.distillery,
                age: request.fields.age,
                strength: request.fields.strength,
                size: request.fields.size,
                price: request.fields.price,
                country: request.fields.country,
                image: request.fields.image
            })
            whiskey.save();
            response.status(201);
            response.json(whiskey);
        } catch (error) {
            return next(error);
        }
    });

    // get all whiskey
    app.get("/api/v1/whiskey", async function(request, response, next) {
        var limit = parseInt(request.query.limit) || 5;
        var offset = parseInt(request.query.offset) || 0;
        
        try {
			var result = await Whiskey.find().limit(limit).skip(offset);
			var count = (await Whiskey.find()).length;

			var qLimit = request.query.limit;
			var qOffset = request.query.offset || 0;

			var queryStringNext = [];
			var queryStringPrevious = [];

			if (qLimit) {
				queryStringNext.push("limit=" + qLimit);
				queryStringPrevious.push("limit=" + qLimit);
			}

			queryStringNext.push("offset=" + (parseInt(qOffset) + limit));

			if (qOffset) {
				queryStringPrevious.push("offset=" + (parseInt(qOffset) - limit));
			}

			var baseUrl = `${request.protocol}://${request.hostname}${ request.hostname == "localhost" ? ":" + process.env.PORT : "" }${ request._parsedUrl.pathname }`;

			var output = {
				count,
				next: (offset + limit < count) ? `${baseUrl}?${queryStringNext.join("&")}` : null,
				previous: offset > 0 ? `${baseUrl}?${queryStringPrevious.join("&")}` : null,
				url: `${baseUrl}?` + (offset ? "offset=" + offset : ""),
				results: result
			}

			response.json(output);
		} catch (error) {
			return next(error);
		}
    });

    // get single whiskey by id
	app.get("/api/v1/whiskey/:id", async function(request, response, next) {
		try {
			// hent en ost ud fra id
			var result = await Whiskey.findById(request.params.id);

			// hvis osten ikke findes: fejl 404
			if (!result) {
				response.status(404);
				response.end();
				return;
			}

			// hvis osten findes
			response.json(result);

		// fejlhåndtering
		} catch (error) {
			return next(error);
		}
    });
    
    // update a whiskey
	app.patch("/api/v1/whiskey/:id", auth, async function(request, response, next) {
		try {
            var { name, distillery, age, strength, size, price, country } = request.fields;
            var updateObject = {};

            // if the field has something in it, and exists, it will overwrite with the new input

            if (name) updateObject.name = name;
            if (distillery) updateObject.distillery = distillery;
            if (age) updateObject.age = age;
            if (strength) updateObject.strength = strength;
            if (size) updateObject.size = size;
            if (price) updateObject.price = price;
            if (country) updateObject.country = country;
            if (image) updateObject.image = image;

			await Whiskey.findByIdAndUpdate(request.params.id, updateObject);

			var whiskey = await Whiskey.findById(request.params.id);

			response.status(200);
			response.json(whiskey);
		} catch (error) {
			return next(error);
		}
	});

    // delete a single whiskey by id
    app.delete("/api/v1/whiskey/:id", auth, async function(request, response, next) {
        try {
            await Whiskey.findByIdAndRemove(request.params.id);
            response.status(204);
            response.end();
        } catch (error) {
            return next(error);
        }
    });
};