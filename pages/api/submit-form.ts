import { db } from "@/lib/db";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export default async function handler(req, res) {
  if (req.method === "POST") {
    const { institution, district, contact, email, website, services } = req.body;

    try {
      // Save institution details
      const organization = await db.organization.create({
        data: {
          name: institution,
          address: district,
          contactNumber: contact,
          email: email,
          website: website,
          district: district,
          category: "Default Category", // Add a category field if needed
          userId: "user-id-here", // Replace with the actual user ID
        },
      });

      // Save services
      for (const service of services) {
        await db.service.create({
          data: {
            name: service.serviceName,
            category: service.category,
            description: service.description,
            organizationId: organization.id,
          },
        });
      }

      res.status(200).json({ message: "Data saved successfully!" });
    } catch (error) {
      console.error("Error saving data:", error);
      res.status(500).json({ error: "Failed to save data" });
    }
  } else {
    res.status(405).json({ error: "Method not allowed" });
  }
}