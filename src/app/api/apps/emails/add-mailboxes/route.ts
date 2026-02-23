// app/api/apps/emails/add-mailboxes/route.ts
import { NextResponse } from 'next/server';

import { getServerSession } from 'next-auth/next';

import prisma from '@/db'

import { getAuthUser } from '@/utils/backend-helper'


export async function POST(request: Request) {
  const user = await getAuthUser()

     console.log(user)

  if (!user?.id) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const currentUserId = user?.id;

  try {
    const body = await request.json();
    const { mailboxes } = body;

    if (!Array.isArray(mailboxes) || mailboxes.length === 0) {
      return NextResponse.json(
        { message: 'Invalid or empty mailboxes array' },
        { status: 400 }
      );
    }

    // Validate & normalize input
    const normalizedMailboxes = mailboxes
      .filter(
        (item: any): item is { displayName: string; emailAddress: string } =>
          typeof item?.displayName === 'string' &&
          typeof item?.emailAddress === 'string' &&
          item.displayName.trim() !== '' &&
          item.emailAddress.trim() !== ''
      )
      .map((item) => ({
        displayName: item.displayName.trim(),
        emailAddress: item.emailAddress.trim().toLowerCase(),
      }));

    if (normalizedMailboxes.length === 0) {
      return NextResponse.json(
        { message: 'No valid mailboxes provided' },
        { status: 400 }
      );
    }

    // Optional: check for duplicates per user (prevent adding same email twice)
    const existingEmails = await prisma.email.findMany({
      where: {
        userId: currentUserId,
        to: {
          in: normalizedMailboxes.map((m) => m.emailAddress),
        },
      },
      select: { to: true },
    });

    const existingSet = new Set(existingEmails.map((e) => e.to));

    const newMailboxes = normalizedMailboxes.filter(
      (m) => !existingSet.has(m.emailAddress)
    );

    if (newMailboxes.length === 0) {
      return NextResponse.json(
        { message: 'All provided email addresses are already added' },
        { status: 409 }
      );
    }

    // ── Transaction ────────────────────────────────────────────────
    const createdCount = await prisma.$transaction(async (tx) => {
      let count = 0;

      for (const mailbox of newMailboxes) {
        // Generate negative UID (placeholder for empty mailbox)
        // Adding timestamp component reduces collision probability
        const placeholderUid =
          -Math.floor(Date.now() / 1000 + Math.random() * 900000);

        const newEmail = await tx.email.create({
          data: {
            to: mailbox.emailAddress,
            labels: mailbox.displayName ? [mailbox.displayName] : [],   
            folder: 'inbox',
            uid: placeholderUid,
            userId: currentUserId, // creator
            date: null,
            subject: null,
            body: null,
            htmlBody: null,
            isRead: false,
            isStarred: false,
            hasAttachment: false,
            
          },
        });

        // Auto-assign to current user
        await tx.userEmailAssignment.create({
          data: {
            userId: currentUserId,
            emailId: newEmail.id,
            email: newEmail.to!, // denormalized for faster queries
            isRead: true,        // new empty mailbox → considered read
            uid: newEmail.uid,
          },
        });

        count++;
      }

      return count;
    });

    return NextResponse.json({
      success: true,
      addedCount: createdCount,
      message: `Successfully added ${createdCount} mailbox(es)`,
    });
  } catch (error: any) {
    console.error('Add mailboxes failed:', error);

    const message =
      error.code === 'P2002'
        ? 'One or more email addresses already exist'
        : 'Failed to add email(s)';

    return NextResponse.json(
      { message, error: error.message },
      { status: 500 }
    );
  }
}
