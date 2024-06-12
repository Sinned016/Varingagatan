require("dotenv").config();
var admin = require("firebase-admin");
var serviceAccount = require("./config/serviceAccountKey.json");

// Initialize Firebase Admin SDK
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
  // Add other Firebase configuration options if needed
});

// Get the Auth service for managing users
const auth = admin.auth();

const adminUID = process.env.ADMIN_UID

// Assign custom claims to a user
const uid = adminUID; // Insert the user's UID that you want to make an admin
const customClaims = { admin: true };

auth.setCustomUserClaims(uid, customClaims)
  .then(() => {
    console.log('Custom claims updated successfully');
  })
  .catch((error) => {
    console.error('Error updating custom claims:', error);
});