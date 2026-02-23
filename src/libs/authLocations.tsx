import type { Location } from '@prisma/client'

import prisma from '@/db';
import { getAuthUser } from '@/utils/backend-helper';

export default async function getAuthLocations() {
    const user = await getAuthUser();

    if (!user) return null;

    const locationData = await prisma.user.findUnique({
        where: { id: user.id },
        include: {
            locations: {
                select: {
                    locationId: true,
                },
            },
        },
    });

    const locationIds = locationData?.locations.map(location => location.locationId) || [];

    const locations = await prisma.location.findMany({
        where: {
            id: {
                in: locationIds,
            },
        },
        orderBy: {
            createdAt: 'desc',
        },
    });

    return locations as Location[];
}
