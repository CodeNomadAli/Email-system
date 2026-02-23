import { apiResponse, catchErrors, getAuthSession } from '@/helper'
import { NextRequest } from 'next/server'
import prisma from '@/db'


export async function DELETE(req: NextRequest) {
  try {
    const formParams = req.nextUrl.searchParams;
    
    const fileId = formParams.get('fileId');

    const user = await getAuthSession();

    if (!user) throw new Error('User not found');

    if (fileId) {
        
      const file = await prisma.file.findFirst({
        where: {
          id: fileId,
          userId: user.id,
        },
      });

      if (!file) {
        return apiResponse(null, 'File not found', 404);
      }

    
      await prisma.file.delete({
        where: {
          id: fileId,
        },
      });
    }

    
    if (!fileId) {
      return apiResponse(null, 'No folderId or fileId provided', 400);
    }

    return apiResponse(null, 'Deleted successfully');
  } catch (error) {
    console.error(error);
    return catchErrors(error as Error);
  }
}
