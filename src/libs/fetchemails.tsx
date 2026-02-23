// lib/fetchEmails.ts
import prisma from '@/db'

export interface EmailTableRow {
    id: string
    subject: string
    email: string
    firstName: string
    lastName: string
    assignedTo: string
    assignedUserIds: string[]
    folder: string
    date: string
}

export interface EmailsResponse {
    emails: EmailTableRow[]
    totalRecords: number
    totalPages: number
    hasNextPage: boolean
    hasPrevPage: boolean
}

// Helper: check if user is super admin
async function isSuperAdmin(userId: string): Promise<boolean> {
    const user = await prisma.user.findUnique({
        where: { id: String(userId) },
        select: {
            roles: {
                select: {
                    role: { select: { name: true } }
                }
            }
        }
    })

    if (!user) return false

    return user.roles.some(
        r => r.role.name.toLowerCase() === 'super-admin'
    )
}

export default async function fetchEmails(
    userId: string,
    page: number = 1,
    pageSize: number = 20
): Promise<EmailsResponse> {
    if (!userId) throw new Error('userId is required')

    // Ensure page and pageSize are numbers
    const pageNumber = Number(page) || 1
    const size = Number(pageSize) || 20

    // Check if super admin
    const superAdmin = await isSuperAdmin(userId)
     
    // Build filter
    const whereFilter: any = { deletedAt: false }

    console.log(superAdmin, "gelo super admin")

    if (!superAdmin) {
        // Only emails assigned to this user
        whereFilter.assignments = { some: { userId: String(userId) } }
    }

    // Count total emails
    const totalRecords = await prisma.email.count({ where: whereFilter })
    const totalPages = Math.ceil(totalRecords / size)
    const hasNextPage = pageNumber < totalPages
    const hasPrevPage = pageNumber > 1

    // Fetch emails
    const emails = await prisma.email.findMany({
        skip: (pageNumber - 1) * size,
        take: size,
        orderBy: [
            { date: 'desc' },
            { createdAt: 'desc' }
        ],
        where: whereFilter,
        select: {
            id: true,
            subject: true,
            to: true,
            folder: true,
            date: true,
            createdAt: true,
            user: { select: { first_name: true, last_name: true } },
            assignments: { select: { user: { select: { id: true, first_name: true, last_name: true } } } }
        }
    })

    // Format emails
    const formattedEmails: EmailTableRow[] = emails.map(email => {
        const assignedUsers = email.assignments
            .map(a => a.user)
            .map(u => (u.first_name ? `${u.first_name} ${u.last_name}` : '-'))
            .join(', ') || '-'

        const assignedUserIds = email.assignments.map(a => String(a.user.id))

        return {
            id: email.id,
            subject: email.subject || '(No Subject)',
            email: email.to || '-',
            firstName: email.user?.first_name || '-',
            lastName: email.user?.last_name || '-',
            assignedTo: assignedUsers,
            assignedUserIds,
            folder: email.folder,
            createdAt: email.createdAt
        }
    })

    return {
        emails: formattedEmails,
        totalRecords,
        totalPages,
        hasNextPage,
        hasPrevPage
    }
}
