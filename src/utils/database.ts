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