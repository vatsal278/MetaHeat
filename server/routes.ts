import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";

// In-memory storage for wallet addresses and emails
// Note: This will reset when the server restarts
interface EarlyAccessUser {
  id: number;
  walletAddress: string;
  email: string | null;
  hasRequestedAccess: boolean;
  joinedAt: string;
}

// Store users in memory
let earlyAccessUsers: EarlyAccessUser[] = [];
let nextId = 1;

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
      const existingUserIndex = earlyAccessUsers.findIndex(
        user => user.walletAddress === walletAddress
      );
      
      if (existingUserIndex !== -1) {
        // Update the record if it exists
        earlyAccessUsers[existingUserIndex] = {
          ...earlyAccessUsers[existingUserIndex],
          hasRequestedAccess: true,
          ...(email ? { email } : {})
        };
          
        return res.status(200).json({ 
          success: true, 
          message: 'Wallet already registered for early access',
          isEarlyAccess: true
        });
      }
      
      // Create new user
      const newUser: EarlyAccessUser = {
        id: nextId++,
        walletAddress,
        email: email || null,
        hasRequestedAccess: true,
        joinedAt: new Date().toISOString()
      };
      
      // Add to the in-memory array
      earlyAccessUsers.push(newUser);
      
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
      const user = earlyAccessUsers.find(user => user.walletAddress === address);
      
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
      // Sort by joinedAt in descending order
      const sortedUsers = [...earlyAccessUsers].sort((a, b) => {
        return new Date(b.joinedAt).getTime() - new Date(a.joinedAt).getTime();
      });
      
      return res.status(200).json({ 
        success: true,
        count: sortedUsers.length,
        users: sortedUsers.map(user => ({
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
