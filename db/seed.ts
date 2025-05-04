import { db } from "./index";
import * as schema from "@shared/schema";
import { eq } from "drizzle-orm";

async function seed() {
  try {
    console.log("🌱 Seeding database...");

    // Check if we need to create a sample early access user
    const existingUsers = await db.select().from(schema.earlyAccessUsers);
    
    if (existingUsers.length === 0) {
      console.log("🔑 Creating sample early access user data...");
      // Sample wallet address for testing
      await db.insert(schema.earlyAccessUsers).values({
        walletAddress: "DemoSolanaWalletAddressForTesting123456789",
        hasRequestedAccess: true,
      });
    } else {
      console.log("👥 Early access users already exist, skipping seed");
    }

    console.log("✅ Seeding complete!");
  } catch (error) {
    console.error("❌ Error seeding database:", error);
  }
}

seed();
