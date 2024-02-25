require('dotenv').config();
const mongoose = require('mongoose');
const crypto = require('crypto');


const createAdmin = async () => {
    Admin.findOne({ username: 'admin' }) 
        .then(user => {
            if (user) {
                console.log('Admin user already exists.');
                return;
            }

            // Generate a random salt
            const salt = crypto.randomBytes(16).toString('hex');
            // Hash the password with the salt
            const hash = crypto.pbkdf2Sync('Yusuf12', salt, 20, 64, 'sha512').toString('hex'); // Replace 'yourAdminPassword' with the desired password

            const newAdmin = new Admin({ 
                username: 'Admin',
                password: `${salt}$${hash}`, // Storing the salt and the hash, separated by a $
                role: 'admin' 
            });

            newAdmin.save()
                .then(() => console.log('Admin user created successfully.'))
                .catch(err => console.error('Error creating admin user:', err));
        })
        .catch(error => {
            console.error('Error checking for existing admin user:', error);
        });
}

// Export the function for external use
module.exports = createAdmin;
