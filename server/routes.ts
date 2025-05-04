import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { db } from "@db";
import { earlyAccessUsers, insertEarlyAccessUserSchema } from "@shared/schema";
import { eq } from "drizzle-orm";
import { ZodError } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API endpoint for wallet connection and early access requests
  app.post('/api/wallet/connect', async (req: Request, res: Response) => {
    try {
      const { walletAddress, email } = req.body;
      
      if (!walletAddress) {
        return res.status(400).json({ 
          success: false, 
          message: 'Wallet address is required' 
        });
      }
      
      // Check if wallet is already connected
      const existingUser = await db.query.earlyAccessUsers.findFirst({
        where: eq(earlyAccessUsers.walletAddress, walletAddress)
      });
      
      if (existingUser) {
        // Update the record if it exists
        await db
          .update(earlyAccessUsers)
          .set({ 
            hasRequestedAccess: true,
            ...(email ? { email } : {})
          })
          .where(eq(earlyAccessUsers.walletAddress, walletAddress));
          
        return res.status(200).json({ 
          success: true, 
          message: 'Wallet already registered for early access',
          isEarlyAccess: true
        });
      }
      
      // Validate the data
      const validatedData = insertEarlyAccessUserSchema.parse({
        walletAddress,
        email: email || undefined,
        hasRequestedAccess: true
      });
      
      // Store in the database
      const [newUser] = await db
        .insert(earlyAccessUsers)
        .values(validatedData)
        .returning();
      
      return res.status(201).json({ 
        success: true, 
        message: 'Wallet connected and early access requested successfully',
        isEarlyAccess: true,
        user: {
          id: newUser.id,
          walletAddress: newUser.walletAddress,
          joinedAt: newUser.joinedAt
        }
      });
    } catch (error) {
      console.error('Error connecting wallet:', error);
      
      if (error instanceof ZodError) {
        return res.status(400).json({ 
          success: false, 
          message: 'Invalid data provided',
          errors: error.errors
        });
      }
      
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error processing wallet connection' 
      });
    }
  });

  // API endpoint for checking wallet early access status
  app.get('/api/wallet/status/:address', async (req: Request, res: Response) => {
    try {
      const { address } = req.params;
      
      if (!address) {
        return res.status(400).json({ 
          success: false, 
          message: 'Wallet address is required' 
        });
      }
      
      // Check if wallet exists in our early access list
      const user = await db.query.earlyAccessUsers.findFirst({
        where: eq(earlyAccessUsers.walletAddress, address)
      });
      
      if (!user) {
        return res.status(200).json({ 
          success: true,
          isEarlyAccess: false,
          message: 'Wallet not registered for early access'
        });
      }
      
      return res.status(200).json({ 
        success: true,
        isEarlyAccess: true,
        message: 'Wallet is registered for early access',
        joinedAt: user.joinedAt
      });
    } catch (error) {
      console.error('Error checking wallet status:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error checking wallet status' 
      });
    }
  });

  // Get all early access users (for admin purposes)
  app.get('/api/admin/early-access-users', async (_req: Request, res: Response) => {
    try {
      const users = await db.query.earlyAccessUsers.findMany({
        orderBy: (users, { desc }) => [desc(users.joinedAt)]
      });
      
      return res.status(200).json({ 
        success: true,
        count: users.length,
        users: users.map(user => ({
          id: user.id,
          walletAddress: user.walletAddress,
          joinedAt: user.joinedAt,
          hasRequestedAccess: user.hasRequestedAccess,
          email: user.email || 'Not provided'
        }))
      });
    } catch (error) {
      console.error('Error fetching early access users:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Internal server error fetching early access users' 
      });
    }
  });

  const httpServer = createServer(app);

  return httpServer;
}
