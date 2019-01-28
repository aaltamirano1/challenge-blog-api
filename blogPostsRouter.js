 const express = require('express');
const router = express.Router();

const bodyParser = require('body-parser');
const jsonParser = bodyParser.json();

const {BlogPost} = require('./models');

// BlogPost.create('About Me', 'When I was five, my mother immigrated into this country with $25 to her name. She built her own catering business and everyone lent a hand to keep us afloat. I come from a world where we sleep little, leave class to go to work, and always watch out for heat strokes.\nI come from a very low-tech world. In 1999 my mother brought home our first computer after hearing someone was trying to get rid of it. It had a small black screen and green letters. I had fun making pictures on it using little square characters against the black background. Years later my brother got a computer for his birthday. It was a machine for MS Paint and some video games. A few years after that, it was stolen. Beyond that computers were always something used in school.\nWhen I was 18 I was working enough to save up for a smartphone and laptop for college. I entered bottle-cap codes for Coke Rewards to get a Wired Magazine subscription to read on the train rides and bus rides to and from class. I loved reading about people slowly building a science fiction world, but never considered this was a field I could work in. I never met anyone who worked in tech.\nNear the end of college I got a job at a company that builds rewards websites. I answer calls from people having issues with the site. On my breaks I took courses on Khan Academy. One day Intro to Programming popped up and they had me make a sun rise out of a green field. I could not believe that is what programming was.\nSo here we are.', 'Angel Altamirano');

// BlogPost.create('My Second Post', `Just say anything, George, say what ever's natural, the first thing that comes to your mind. Take that you mutated son-of-a-bitch. My pine, why you. You space bastard, you killed a pine. You do? Yeah, it's 8:00. Hey, McFly, I thought I told you never to come in here. Well it's gonna cost you. How much money you got on you?`, 'Anonymous');


router.get('/', (req, res)=>{
	BlogPost
	.find()
	.then(posts=>{
		res.json({posts: posts.map(post => post.serialize())});
	})
	.catch(err => {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  });
});

router.post('/', jsonParser, (req, res)=>{
	const requiredFields = ['title', 'content', 'author'];
	requiredFields.forEach(field => {
		if(!(field in req.body)){
			const msg = `Missing ${field} in request body.`;
			console.error(msg);
			return res.status(400).send(msg);
		}
	});
	BlogPost
		.create({
			title: req.body.title,
    	author: req.body.author,
    	content: req.body.content
		})
		.then(post=>res.status(201).json(post.serialize()))
		.catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.put('/:id', jsonParser, (req, res)=>{
	const requiredFields = ['title', 'content', 'author'];
	requiredFields.forEach(field => {
		if(!(field in req.body)){
			const msg = `Missing ${field} in request body.`;
			console.error(msg);
			return res.status(400).send(msg);
		}
	});

	if(req.params.id !== req.body.id){
		const msg = `Request path id ${req.params.id} and request body id ${req.body.id} must match.`;
			console.error(msg);
			return res.status(400).send(msg);
	}

	const toUpdate = {};
	const updatableFields = ['title', 'content', 'author'];
	updatableFields.forEach(field=>{
		if(field in req.body){
			toUpdate[field] = req.body[field];
		}
	});

	BlogPost
		.findByIdAndUpdate(req.params.id, {$set: toUpdate})
		.then(()=>{
			console.log(`Updated item with id ${req.params.id}.`);
			res.status(204).end();
		})
		.catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

router.delete('/:id', (req, res)=>{
	BlogPost.findByIdAndRemove(req.params.id)
		.then(()=>{
			console.log(`Deleted item with id ${req.params.id}.`);
			res.status(204).end();
		})
		.catch(err => {
      console.error(err);
      res.status(500).json({ message: "Internal server error" });
    });
});

module.exports = router;

const app = express();