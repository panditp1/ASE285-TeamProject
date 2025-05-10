# Preston Jackson Feature Descriptions

## Login Feature
For the webpage, you will want to use logins to create authorized users that can access the main page to view and modify the inventory. To do so, you will need to create login credentials and store them.
By use of an .env file, we can create a more secure webpage using our login feature.
1. On an .env file, fill in the information of LOGIN_EMAILS and LOGIN_PASSWORDS
   - Example:
   - `LOGIN_EMAILS = admin@example.com,manager1@gmail.com,dev3@test.net`
   - `LOGIN_PASSWORDS = 123,456,789`
   - Note: The order of the passwords relate to the order of emails (email: admin@example.com; password: 123)
2. Once entered the login info into the .env, on the webpage you will be met with a login screen.
3. The server uses an api post to gather the email and password entered once you click submit.
4. The server then tests the two credentials to see if they match the order given in .env
5. If successful, you will be sent to the main page, otherwise you will be sent "Invalid email or password' and can enter them again.
This method gives the person using our inventory manager the ability to set their own logins through a more secure manner.

## History Tracker
The changes made to a database will need to be monitored and have documentation of what modifications have been made. This feature gives you a log each time a change is made through the webpage.
1. Whenever an item is added, edited, or deleted through the webpage, the system first checks if 'mongoLog.txt' has been created. If not, it is created. This file will be created on the server itself.
2. If so, then a log is made within it.
- Example of the log:
- [4/27/2025 | 10:34 PM] | Change Type: Update | User: admin@example.com | Item Changed: Ball
- Format: [Date | Time] | Change Type: [Add/Update/Delete] | User [email that was signed in] | Item Changed: [Name of item]
This is logged each time something is changed so you can accurately view any changes made and track if they are changes that should've been made. Previous logs will not be deleted after a new log is made.

## Email Notification
When something is out of stock, it is important that someone is alerted to when an item is out of stock. Using EmailJS, we can set up a custom email notification system to check when an item quantity reaches 0.
1. Within the .env file are 3 values, similar to the login creditials: EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_USER_ID
2. Create an account on EmailJS's webpage, and use their site to create the following:
- An email service that will send and log the emails going through EmailJS
- A template for how the email should look when sent. This should include 'to_email' so they system knows what email to send the alert to, and 'item_name' so the email will contain what item is out of stock.
- The link to your user id (Found in your profile settings)
- Note: You can run a test email through EmailJS to ensure the system you set up works
3. Enter all these values into their respective values on the .env
4. When an update change happens to an item, a check is ran to see if the item quatity has changed to 0. If not, nothing happens.
5. If so, by collecting the email and item name for the template, the email is sent and a log is sent to the console confirming this.
This is a simple way to ensure no items can remain out of stock without someone knowing. 
