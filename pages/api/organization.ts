import { NextApiRequest, NextApiResponse } from 'next';
import { db } from "@/lib/db";

interface OrganizationData {
  name: string;
  address: string;
  contactNumber: string;
  email: string;
  website: string;
  district: string;
  category: string;
  userId: string;
}

interface ServiceData {
  serviceName: string;
  category: string;
  description: string;
  requirements?: string;
  organizationRoleId?: string; // Added missing field
}

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  try {
    console.log("Received body:", req.body);

    const { organizationData, servicesData } = req.body;

    if (!organizationData || !servicesData) {
      return res.status(400).json({ success: false, error: "Missing required data" });
    }

    // Create the organization
    const institution = await db.organization.create({
      data: {
        name: organizationData.name,
        address: organizationData.address,
        contactNumber: organizationData.contactNumber,
        email: organizationData.email,
        website: organizationData.website,
        district: organizationData.district,
        category: organizationData.category,
        userId: organizationData.userId,
      },
    });

    // Create a default role for the organization (Needed for services)
    const defaultRole = await db.organizationRole.create({
      data: {
        role: "default",
        userId: organizationData.userId,
        organizationId: institution.id,
      },
    });

    // Create associated services
    for (const service of servicesData) {
      await db.service.create({
        data: {
          name: service.serviceName,
          category: service.category,
          description: service.description,
          organizationId: institution.id,
          organizationRoleId: defaultRole.id, // Use created role ID
        },
      });
    }

    return res.status(200).json({ success: true, organization: institution });
  } catch (error) {
    console.error("Error saving data:", error);

    if (error instanceof SyntaxError && error.message.includes('Unexpected token')) {
      return res.status(400).json({ success: false, error: "Invalid JSON payload" });
    }

    return res.status(500).json({ success: false, error: String(error) });
  }
}
