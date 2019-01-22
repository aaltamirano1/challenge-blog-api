const chai = require('chai');
const chaiHttp = require('chai-http');

const { app, runServer, closeServer } = require("../server");

const expect = chai.expect;

chai.use(chaiHttp);

describe('Blog Posts', function(){
	before(function(){
		runServer;
	});
	after(function(){
		closeServer();
	});

	it('Should list blog posts on GET', function(){
		return chai
			.request(app)
			.get('/blog-posts')
			.then(function(res){
				expect(res).to.be.json;
				expect(res.body).to.be.a('array');
			});
	});
	it('Should create a blog post on POST', function(){
		const newPost = { title: "Test Post", content: "A very useful feature in Mocha is describe(), a function that allows you to better control your tests by grouping them...", author: "Anonymous", publishDate: Date.now()};
		return chai
			.request(app)
			.post('/blog-posts')
			.send(newPost)
			.then(function(res){
				expect(res).to.be.json;
				expect(res.body).to.be.a('object');
				expect(res.body).to.include.keys('title', 'content', 'author', 'publishDate');
				expect(res.body.id).to.not.equal(null);
				expect(res.body).to.deep.equal(Object.assign(newPost, {id: res.body.id}))
			});
	});
	it('Should update a blog post on PUT', function(){
		const updateData = { title: "Updated Post", content: "A very useful feature in Mocha is describe(), a function that allows you to better control your tests by grouping them...", author: "Anonymous", publishDate: Date.now()};
		return (
			chai
				.request(app)
				.get('/blog-posts')
				.then(function(res){
					updateData.id = res.body[0].id;
					return chai
						.request(app)
						.put(`/blog-posts/${updateData.id}`)
						.send(updateData);
				})
				.then(function(res){
					expect(res.body).to.be.a('object');
					expect(res).to.have.status(204);
				})
		);
	});
	it('Should delete a blog post on DELETE', function(){
		return (
			chai
				.request(app)
				.get('/blog-posts')
				.then(function(res){
					return chai.request(app).delete(`/blog-posts/${res.body[0].id}`);
				})
				.then(function(res){
					expect(res).to.have.status(204);
				})
		);
	});
});