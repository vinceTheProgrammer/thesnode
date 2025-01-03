import prisma from '../utils/prisma.js';
import { handlePrismaError } from './errors.js';

export async function linkUser(discordId: string, snUsername: string, birthday: Date | null) {
    try {
        return await prisma.user.upsert({
            where: {
                discordId: discordId,
            },
            update: {
                discordId: discordId,
                snUsername: snUsername,
                birthday: birthday
            },
            create: {
                discordId: discordId,
                snUsername: snUsername,
                birthday: birthday
            },
        })
    } catch (error) {
        throw handlePrismaError(error);
    }

}

export async function logMessage(discordId: string, date?: Date) {
    try {
        incrementMessageCount(discordId);
        if (date) {
            return await prisma.message.create({
                data: {
                    discordId: discordId,
                    timestamp: date
                }
            })
        }
        return await prisma.message.create({
            data: {
                discordId: discordId
            }
        })
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function getUserMessageCountSinceDate(discordId: string, date: Date): Promise<number> {
    try {
        return await prisma.message.count({
            where: {
                discordId: discordId,
                timestamp: {
                    gte: date,
                },
            },
        });
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function getTotalLinkedUserCount(): Promise<number> {
    try {
        return await prisma.user.count({
            where: {
                snUsername: {not: null}
            }
        })
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function getTotalUnlinkedUserCount(): Promise<number> {
    try {
        return await prisma.user.count({
            where: {
                snUsername: null
            }
        })
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function getTotalUserCount(): Promise<number> {
    try {
        return await prisma.user.count()
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function incrementMessageCount(discordId: string) {
    try {
        return await prisma.user.upsert({
            where: {
                discordId: discordId
            },
            update: {
                messageCount: {
                    increment: 1
                }
            },
            create: {
                discordId: discordId,
                messageCount: 1
            }
        })
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function unlinkUser(discordId: string) {
    try {
        return await prisma.user.update({
            where: {
                discordId: discordId
            },
            data: {
                snUsername: null
            }
        })
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function findBySnUsername(snUsername: string) {
    try {
        return await prisma.user.findUnique({
            where: {
                snUsername: snUsername
            }
        })
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function findByDiscordId(discordId: string) {
    try {
        return await prisma.user.findFirst({
            where: {
                discordId: discordId,
            }
        })
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function findByDiscordIdWhereSnUsernameNotNull(discordId: string) {
    try {
        return await prisma.user.findFirst({
            where: {
                discordId: discordId,
                snUsername: { not: null }
            }
        })
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function findTodaysBirthdays() {
    const today = new Date();
    const month = (today.getMonth() + 1).toString().padStart(2, '0');
    const day = today.getDate().toString().padStart(2, '0');

    try {

        const users = await prisma.user.findMany({
            where: {
                birthday: {
                    not: null,
                },
            },
            select: {
                discordId: true,
                birthday: true,
            },
        });

        const usersWithBirthdaysToday = users.filter((user) => {
            const birthday = user.birthday as Date;
            const birthdayMonth = (birthday.getMonth() + 1).toString().padStart(2, '0');
            const birthdayDay = birthday.getDate().toString().padStart(2, '0');
            return birthdayMonth === month && birthdayDay === day;
        });

        return usersWithBirthdaysToday;
    } catch (error) {
        throw handlePrismaError(error);
    }
}