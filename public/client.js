var blogPostTemplate =
  '<li class="js-blog-post">' +
  '<h2 class="js-blog-post-title"></h2>' +
  '<h3 class="js-blog-post-author"></h3>' +
  '<p class="js-blog-post-content"></p>' +
  '<button class="js-blog-post-delete">' +
  '<span class="button-label"><i class="fas fa-trash-alt"></i></span>' +
  "</button>" +
  "</div>" +
  "</li>";
var serverBase = "//localhost:8080/";
var BLOG_POST_URL = serverBase + "blog-posts";

function getAndDisplayBlogPosts() {
  console.log("Retrieving blog posts");
  $.getJSON(BLOG_POST_URL, function(res) {
    console.log("Rendering blog posts");
    const posts = res.posts;
    var postElements = posts.map(function(post) {
      var element = $(blogPostTemplate);
      element.attr("id", post.id);
      var postTitle = element.find(".js-blog-post-title");
      postTitle.text(post.title);
      var postAuthor = element.find(".js-blog-post-author");
      postAuthor.text(post.author);
      var postContent = element.find(".js-blog-post-content");
      postContent.text(post.content);
      return element;
    });
    $(".js-blog-posts").html(postElements);
  });
}

function addBlogPost(post) {
  console.log("Adding blog post: " + post);
  $.ajax({
    method: "POST",
    url: BLOG_POST_URL,
    data: JSON.stringify(post),
    success: function(data) {
      getAndDisplayBlogPosts();
    },
    dataType: "json",
    contentType: "application/json"
  });
}

function handleAddBlogPost() {
  $("form").submit(function(e) {
    e.preventDefault();
    var title = $("#title").val();
    var authorFirstname = $("#author-firstname").val();
    var authorLastname = $("#author-lastname").val();
    var content = $("#js-new-post").val();
    addBlogPost({
      title: title,
      content: content,
      author: {
        firstName: authorFirstname,
        lastName: authorLastname
      }
    });
  });
}

function deleteBlogPost(postId) {
  console.log("Deleting shopping item `" + postId + "`");
  $.ajax({
    url: BLOG_POST_URL + "/" + postId,
    method: "DELETE",
    success: getAndDisplayBlogPosts
  });
}

function updateBlogPost(post) {
  console.log("Updating blog post `" + post.id + "`");
  $.ajax({
    url: BLOG_POST_URL + "/" + post.id,
    method: "PUT",
    data: JSON.stringify(post),
    success: function(data) {
      getAndDisplayBlogPosts();
    },
    dataType: "json",
    contentType: "application/json"
  });
}

function handleBlogPostAdd() {
  $("#js-blog-posts-form").submit(function(e) {
    e.preventDefault();
    addBlogPost({
      name: $(e.currentTarget)
        .find("#js-new-post")
        .val(),
      checked: false
    });
  });
}

function handleBlogPostDelete() {
  $(".js-blog-posts").on("click", ".js-blog-post-delete", function(e) {
    e.preventDefault();
    deleteBlogPost(
      $(e.currentTarget)
        .closest(".js-blog-post")
        .attr("id")
    );
  });
}

$(function() {
  getAndDisplayBlogPosts();
  handleBlogPostAdd();
  handleBlogPostDelete();
});
