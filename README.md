in index.js page === 

for make cookie use res.cookie()
1)inside that we use the token or key with the cookie value 

2)and als0 we can use httpOnly:true which HttpOnly attribute is inaccessible to the JavaScript Document.cookie API; it's only sent to the server. 

3) so after that if in a website if the user have the cookie.token or it have coookie before we make a page for login and if he has cookie render the logout page
4) after that if the user logout we should delete the cookie value.

5) after that we use the next() method which is a middleware if the user login we call the next() method which loads the needed page.
