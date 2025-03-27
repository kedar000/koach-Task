import express, { Request, Response, NextFunction } from "express";
import { PrismaClient } from "@prisma/client";
import { setupSwagger } from "./swagger"; 
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const app = express();
setupSwagger(app);
const prisma = new PrismaClient();

async function testConnection() {
  try {
    const users = await prisma.user.findMany();
    console.log("Database connected! Users ");
  } catch (error) {
    console.error("Database connection failed:", error);
  } finally {
    await prisma.$disconnect();
  }
}
testConnection();

const SECRET_KEY  = "KOACH-KEY"

app.use(express.json());

/* _____________________ AUTH ROUTES __________________________*/
/**
 * @swagger
 * /register:
 *   post:
 *     summary: Register a new user
 *     description: Creates a new user account
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: User registered successfully
 *       400:
 *         description: User already exists
 *       500:
 *         description: Internal Server Error
 */

//______________________ Register User_____________________________

app.post("/register", async (req: Request, res: Response): Promise<void> => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await prisma.user.create({
      data: { name, email, password: hashedPassword },
    });

    const token = jwt.sign({ userId: newUser.id }, SECRET_KEY, { expiresIn: "1h" });

    res.status(201).json({ message: "User registered successfully", user: newUser , token : token});
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" , error : error });
  }
});



// ______________________ Login User ______________________ 

/**
 * @swagger
 * /login:
 *   post:
 *     summary: User login
 *     description: Authenticates a user and returns a JWT token
 *     tags:
 *       - Auth
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 *       400:
 *         description: Invalid credentials
 *       500:
 *         description: Internal Server Error
 */
app.post("/login", async (req: Request, res: Response) : Promise<void> => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
        res.status(400).json({ message: "Invalid credentials" });
        return 
    }


    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword){ 
        res.status(400).json({ message: "Invalid credentials" });
        return 
    }

    const token = jwt.sign({ userId: user.id }, SECRET_KEY, { expiresIn: "1h" });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ─────────────────────────── AUTH MIDDLEWARE ─────────────────────────── */

interface AuthRequest extends Request {
  userId?: string;
}

const authMiddleware = (req: AuthRequest, res: any, next: NextFunction) => {
    console.log("Authorization Header:", req.headers.authorization); // Debugging log
  
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({ message: "Access Denied, No Token Provided" });
    }
  
    const token = authHeader.split(" ")[1];
    console.log("Extracted Token:", token); // Debugging log
  
    try {
      const decoded: any = jwt.verify(token, SECRET_KEY);
      req.userId = decoded.userId;
      console.log("Decoded Token:", decoded); // Debugging log
      next();
    } catch (error) {
      console.error("Token Verification Failed:", error);
      res.status(401).json({ message: "Invalid Token" });
    }
  };

/* ─────────────────────────── USER ROUTES ─────────────────────────── */

// ______________________ Get User Profile ______________________ 
/**
 * @swagger
 * /profile:
 *   get:
 *     summary: Get user profile
 *     description: Retrieve the profile of the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []   # This enables token authentication
 *     responses:
 *       200:
 *         description: User profile retrieved successfully
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 */
app.get("/profile", authMiddleware, async (req: AuthRequest, res: any) => {
  try {
    const user = await prisma.user.findUnique({ where: { id: req.userId } });
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({ user });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});



// ______________________ Update User Profile ______________________ 

/**
 * @swagger
 * /update-profile:
 *   put:
 *     summary: Update user profile
 *     description: Update the name of the authenticated user
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []   # This enables token authentication
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       200:
 *         description: Profile updated successfully
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 */
app.put("/update-profile", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    const { name } = req.body;

    const updatedUser = await prisma.user.update({
      where: { id: req.userId },
      data: { name },
    });

    res.status(200).json({ message: "Profile updated successfully", user: updatedUser });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

//______________________  Delete User ______________________ 

/**
 * @swagger
 * /delete-profile:
 *   delete:
 *     summary: Delete user profile
 *     description: Permanently delete the authenticated user's profile
 *     tags:
 *       - User
 *     security:
 *       - BearerAuth: []   # Enables token authentication
 *     responses:
 *       200:
 *         description: User profile deleted successfully
 *       401:
 *         description: Unauthorized - Token is missing or invalid
 *       403:
 *         description: Forbidden - User does not have permission
 *       500:
 *         description: Internal server error
 */
app.delete("/delete-profile", authMiddleware, async (req: AuthRequest, res: Response) => {
  try {
    await prisma.user.delete({ where: { id: req.userId } });
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
});

/* ─────────────────────────── START SERVER ─────────────────────────── */

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(` Server running on port ${PORT}`));