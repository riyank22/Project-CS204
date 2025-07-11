const {prisma} = require('../config/db')
const bcrypt = require('bcrypt');
const { generateToken } = require('../config/jwt');

exports.loginController = async (req, res) => {
    try{
        if(!req.body)
        {
            console.log("[DEBUG] Request body not found")
            return res.status(400).send({message:"Broken request",auth:false });
        }
        const { email, password } = req.body;

        if (!email || !password) {
            console.log("[DEBUG] Request body not valid")
            return res.status(400).send("Missing fields");
        }

        const user = await prisma.users.findUnique({
            where: { email: email },
        });

        if (!user) {
            console.log("[DEBUG] User not found for email:" + email)
            return res.status(404).send({message: 'User not found', auth: false});
        }

        const storedPasswordHash = user.password;

        if(!bcrypt.compare(password, storedPasswordHash)) {
            console.log("[DEBUG] Password not match for user " + email)
            return res.status(401).send({message: "Invalid Password", auth: false});
        }

        const token = generateToken(user.email, user.id);

        if(!token) {
            console.log("[DEBUG] Token not generated")
            return res.status(401).send({message: "Not able to generate the token", auth: false});
        }

        console.log("[INFO] Token generated for the email: " + user.email);
        console.log("[INFO] Login Successful: " + user.email);
        return res.status(200).send({message: "Authenticated successfully", token: `Bearer ${token}`, auth: true});
    }
    catch (error) {
        console.log("[WARNING] Not able to login at authRoutes.js file");
        console.error(error);
        return res.status(500).send({message: error.message, auth: false});
    }
}

exports.registerUserController = async (req, res) => {
    try {
        if(!req.body) {
            console.log("[DEBUG] Request body not found")
            return res.status(400).send({message:"Broken request", auth: false});
        }
        const rawEmail = req.body.email;
        const password = req.body.password;
        const rawName = req.body.name;

        if (!rawEmail || !password || !rawName) {
            console.log("[DEBUG] Request body not valid")
            return res.status(400).send("Missing fields");
        }
        const email = rawEmail.trim();
        const name = rawName.trim();

        const existingUser = await prisma.users.findUnique({
            where: { email: email },
        })[0];

        if (existingUser) {
            console.log("[DEBUG] User already exists for email: " + email);
            return res.status(409).send({message: 'User already exists', auth: false});
        }

        const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = await prisma.users.create({
                data: {
                    email: email,
                    password: hashedPassword,
                    name: name
                },
            });

        if (!newUser) {
            console.log("[DEBUG] Not able to create user for email: " + email);
            return res.status(500).send({message: 'User registration failed', auth: false});
        }
        console.log("[DEBUG] New user created: " + newUser.email);


        if (!newUser) {
            console.log("[DEBUG] Not able to create user for email: " + email);
            return res.status(500).send({message: 'User registration failed', auth: false});
        }

        const token = generateToken(newUser.email, newUser.id);
        if (!token) {
            console.log("[DEBUG] Token not generated for user: " + newUser.email);
            return res.status(401).send({message: "Not able to generate the token", auth: false});
        }

        console.log("[INFO] User registered successfully: " + newUser.email);
        return res.status(201).send({message: "User registered successfully", auth: true, user: {
            email: newUser.email,
            name: newUser.name,
            }, token: `Bearer ${token}`});
    } catch (error) {
        console.log("[WARNING] Not able to register user at authRoutes.js file");
        console.error(error);
        return res.status(500).send({message: error.message, auth: false});
    }
}

exports.changePasswordController = async (req, res) => {
    console.log("[DEBUG] change password controller");
    const {oldPassword, newPassword} = req.body;

    if (!oldPassword || !newPassword) {
        console.log("[DEBUG] Missing fields in change password request");
        return res.status(400).send({message: "Old Password and New Password are required", auth: false});
    }

    if (oldPassword === newPassword) {
        console.log("[DEBUG] Old Password and New Password cannot be same");
        return res.status(400).send({message: "Old Password and New Password cannot be same", auth: false});
    }

    try {

        const isOldPasswordValid = await bcrypt.compare(oldPassword, req.user.password);

        if (!isOldPasswordValid) {
            console.log("[DEBUG] Old password is invalid for user: " + req.email);
            return res.status(401).send({message: "Invalid old password", auth: false});
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        console.log("[DEBUG] New password hashed for user: " + req.email);
        await prisma.users.update(
            {
                where: { email: req.email },
                data: { password: newHashedPassword }
            }
        )

        console.log("[INFO] Password changed successfully for user: " + req.email);
        return res.status(200).send({message: "Password changed successfully", auth:true});
    }
    catch (error) {
        console.log("[WARNING] Error changing password for user: " + req.email);
        console.error(error);
        return res.status(500).send("Error changing password");
    }
}