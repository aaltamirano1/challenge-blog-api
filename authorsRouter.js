const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {Author, BlogPost} = require('./models');

router.get('/', (req, res)=>{
	Author
		.find()
		//res.json status defaults 200.
		.then(authors=>res.json(authors));
});

router.post('/', jsonParser, (req, res)=>{
	const requiredFields = ['firstName', 'lastName', 'userName'];
	requiredFields.forEach(field => {
		if(!(field in req.body)){
			const msg = `Missing ${field} in request body.`;
			console.error(msg);
			return res.status(400).send(msg);
		}
	});
	Author
		.findOne({userName: req.body.userName})
		.then(author=>{
			if(author){
				const msg = `Username taken.`;
				console.error(msg);
				return res.status(400).send(msg);
			}else{
				Author
					.create({
						firstName: req.body.firstName,
			    	lastName: req.body.lastName,
			    	userName: req.body.userName
					})
					.then(author=>res.status(201).json({
              _id: author.id,
              name: `${author.firstName} ${author.lastName}`,
              userName: author.userName
            }))
					.catch(err => {
						const message = "Something went wrong.";
			      console.error(message);
			      return res.status(500).send(message);
			    });		
			}
		});
});

//requires all fields b/c unlike PATCH replaces everything.
router.put('/:id', (req, res)=>{
	const requiredFields = ['firstName', 'lastName', 'userName'];
	requiredFields.forEach(field=>{
		if(!(field in req.body)){
			const msg = `Missing ${field} from request body`;
			console.error(msg);
			// 400 bad request/header/format/content.
			return res.status(400).send(msg);
		}
	});

	if(req.params.id !== req.body.id){
		const msg = `Request parameter id and request body id must match.`;
			console.error(msg);
			// 400 bad request/header/format/content.
			return res.status(400).send(msg);
	}

	const toUpdate ={};
	const updatableFields = ['firstName', 'lastName'];
	updatableFields.forEach(field=>{
		if(field in req.body){
			toUpdate[field] = req.body[field];
		}
	});
	Author
		.findByIdAndUpdate(req.body.id, toUpdate)
		.then(()=>res.status(204).end())
		.catch(err=>console.error(err));
});

router.delete('/:id', (req, res)=>{
	BlogPost
		.deleteMany({author: req.params.id})
		.then(()=>{
			Author
				.findByIdAndRemove(req.params.id)
				.then(()=>res.status(204).end());
		})
		.catch(err=>console.error("Something went wrong."));

});

module.exports = router;
