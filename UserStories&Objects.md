# User Stories & Objects

## Consumer
A consumer is a user that is viewing posts by one or multiple creators.
In order to see posts on their timeline they need to follow at least one creator.

- As consumer I want to see a mix of posts from creators I have followed.
- As consumer I want to follow a creator I'm interested in.
- As consumer I want to see all posts from one creator.
- As consumer I want to react to a creators post, to show them that I liked it.
- As consumer I want to discover more creators than I already follow.
- As consumer I want to be able to see posts for free.

## Creator
A creator is a user that is creating posts to be viewed by consumers.
They have a creator profile on which all their posts can be viewed.

- As creator I want to create a post to share with my followers.
- As creator I want to share a post of another creator with my followers.
- As creator I want to send and receive private message to communicate with other creators.

## Post
A post is a piece of content shared by a creator, which can include text, images, videos, or links. It allows creators to express thoughts, share updates, and engage with their followers.
All posts are shared publicly and can be viewed by any consumer.




# Releases
This project can quickly explode in scope so it is important to well define steps and scopes. 
What is the minimal viable product here? What is the minimal requirement in scope?

## V1 - Singular Blogs
Two profiles, one for each of us where we can easily add posts.

### User Stories
- As creator I want to create a post to share on my profile.
- As creator I want to have some form of security so no-one can use my name to create a post on my profile.
- As consumer I want to see the posts of one creator on their profile in chronological order.

### Technical Requirements
- Each blog can at this point just be one html document, and a directory for media files.
- As long as only the owner has edit access to the server / files we don't need to implement any authentication ourselves.
- We need to define a criteria on how the HTML document needs to be structured, for that a basic requirement could be:
```
<html>
<body>
<div class="content">
<article data-shared-at="unixtimestamp">
<!-- put your article / post content here -->
</article>
<article data-shared-at="unixtimestamp">
<!-- put your article / post content here -->
</article>
</div>
</body>
</html>
```
-> For this I have put an example html in the repository.

## V2 - Timeline
To find out if one of the creators I'm interested in as a consumer has posted something new, I don't want to go through all the profiles manually, but I want one central place where I can see all posts of creators I follow in chronological order.

User Stories for this would be:
- As consumer I want to edit a list of creators I am interested in. (View, Add, Remove)
- As consumer I want to see all posts from the creators I'm interested in, on one page in chronological order (now -> past).
