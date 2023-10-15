# E-Commerce-e-shop-verse

The Work Behind It: e-Shopverse stands as a testament to my passion and commitment to creating an exceptional shopping platform, meticulously designed and developed to prioritize your needs. Endless Shopping Options: Immerse yourself in a world of diverse products, from fashion and electronics to home decor, without any commercial influences. Simplified Shopping: The user-friendly interface I've designed ensures effortless product discovery and cart management, making the shopping process straightforward and enjoyable.
You you see the project running here: [website](https://e-commerce-e-shop-verse.vercel.app/)

Key Features of e-Shopverse:
* Add Orders: Explore products and add them to your cart, simplifying the purchase process.
* Add Reviews: Share your insights on products, providing valuable guidance to fellow shoppers.
* Sign In: Create an account for access to personalized features, including order tracking and preferences management.
* Address Management: Streamline shopping with efficient address management tools.
* Product Discovery: Discover new items tailored to your preferences.
* Order History: Easily keep track of past orders and reorder favorite items.
* Cart Management: Add or remove items from the cart as needed.
* Cancel Orders & Reviews: Maintain complete control over the shopping experience, with the ability to cancel orders or reviews when necessary.
* Payment with Stripe: Securely process payments using the Stripe payment gateway, ensuring a seamless and reliable transaction experience for customers.

# How to run

### Run the following commands to run the application
```bash
   npm i
   npm run dev
```
### Run the following command in another terminal to run the stripe webhook listener
```bash
stripe listen --forward-to localhost:3000/api/webhooks
```
Replace localhost:3000 with the address your application is running

# Setup Environment Variables
* Copy the .env.example into a .env.local file `cp .env.local .env`
* Create a Client Secret and a Client ID in the GCP Console: [Tutorial](https://developers.google.com/workspace/guides/create-credentials#web-application)
  * Add the secret and id in these two envs:
  `GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET`
  * If you're having trouble in making this part you can refer to this free resource and watch from 7:00 to 29:00 [Video tutorial](https://www.youtube.com/watch?v=dTFXufTgfOE&t=1403s&ab_channel=CodingWithDawid)
* Create a hash for the `NEXTAUTH_URL` [md5](https://www.md5hashgenerator.com/)
* Create a mongoDB account: [Atlas](https://www.mongodb.com/atlas)
  * Create a database
  * Click on connect -> drivers
  * Copy the connection string and put the password of your database there
  * Put this connection string in this variable `MONGO_DB_URI`
* In the `NEXTAUTH_URL` put the address your application is running
* For the stripe envs create a stripe account
* Refer to this tutorial: [Getting started with Next.js, Typescript, and Stripe Checkout](https://vercel.com/guides/getting-started-with-nextjs-typescript-stripe)
* Fill this three environment variables `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY, STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET`
  * OBS: Some parts of this tutorial is not well explained, for more detailed information please refer to the github readme of the guide: [Github](https://github.com/vercel/next.js/tree/canary/examples/with-stripe-typescript)

# Importing products to your database
* Select the database you want to use in the atlas collections
* Create a collection with the name products
* Click in insert document
* In view select the left option to import a JSON
* In the project public/mongodb-initial-data you will find a file named e-shopvserse.products.json
  * Copy the content and paste in the atlas modal
  * Click **Insert** and the data will be impoerted
