import type { NextResponse } from 'next/server';

import bcrypt from 'bcrypt';
 
import { apiResponse, catchErrors, getAuthSession } from '@/helper';
import prisma from '@/db';

export async function POST(req: Request): Promise<NextResponse> {
  try {
    
    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return apiResponse(null, 'Current password and new password are required', 400);
    }

    const authUser = await getAuthSession();

console.log()

    const user = await prisma.user.findUnique({
      where: { id: authUser.id },
    });

    if (!user || !user.password) {
      return apiResponse(null, 'User not found', 404);
    }

    const isPasswordValid = await bcrypt.compare(currentPassword, user.password);

    if (!isPasswordValid) {
      return apiResponse(null, 'Current password is incorrect', 400);
    }

    
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);

    await prisma.user.update({
      where: { id: authUser.id },
      data: { password: hashedNewPassword },
    });


    return apiResponse(null, 'Password updated successfully', 200);
  } catch (error) {
    console.error('Error resetting password:', error);
    
return catchErrors(error as Error);
  }
}
