import prisma from '../utils/prisma.js';
import { handlePrismaError } from './errors.js';

export async function linkUser(discordId: string, snUsername: string) {
    try {
        return await prisma.user.upsert({
            where: {
                discordId: discordId,
            },
            update: {
                discordId: discordId,
                snUsername: snUsername
            },
            create: {
                discordId: discordId,
                snUsername: snUsername,
            },
        })
    } catch(error) {
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
    } catch(error) {
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
                snUsername: { not: null }
            }
        })
    } catch (error) {
        throw handlePrismaError(error);
    }
}

export async function findTodaysBirthdays() {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentDay = now.getDate();

    const today = new Date(now.getFullYear(), currentMonth, currentDay);
    const tomorrow = new Date(now.getFullYear(), currentMonth, currentDay + 1);
    const birthday = new Date("2024-10-23 05:00:00");

    console.log(birthday);

    console.log(birthday >= today && birthday < tomorrow);
    console.log(birthday > tomorrow);

    try {
        return await prisma.user.findMany({
            where: {
                birthday: {
                    not: null,
                    lt: tomorrow, // Start of tomorrow
                    //gte: new Date(now.getFullYear(), currentMonth, currentDay), // Start of today's date
                }
            }
        })
    } catch (error) {
        throw handlePrismaError(error);
    }
}