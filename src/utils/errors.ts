import type { Command } from "@sapphire/framework";
import { getErrorEmbed, getWarningEmbed } from "./embeds.js";
import { Prisma } from "@prisma/client";

export enum ErrorType {
    Error = 'error',
    Warning = 'warning',
    Note = 'note'
}

export class CustomError extends Error {
    originalError: Error;
    errorType: ErrorType;

    constructor(message: string, errorType: ErrorType, originalError: Error) {
        super(message); // Set the custom message.
        this.name = "CustomSnodeError"; // Optional: set a specific name.
        this.originalError = originalError;
        this.errorType = errorType;

        // Ensure the prototype chain is properly set.
        Object.setPrototypeOf(this, new.target.prototype);
    }
}

export function handleCommandError(
    interaction: Command.ChatInputCommandInteraction | Command.ContextMenuCommandInteraction,
    error: unknown
) {
    if (error instanceof CustomError) {
        switch (error.errorType) {
            case ErrorType.Error:
                return interaction.editReply({ content: '', embeds: [getErrorEmbed(error.message)], components: [], files: []});
            case ErrorType.Warning:
                return interaction.editReply({ content: '', embeds: [getWarningEmbed(error.message)], components: [], files: [] });
            default:
                return interaction.editReply({ content: '', embeds: [getErrorEmbed(error.message)], components: [], files: [] });
        }

    } else {
        console.error('Unexpected Error:', error);
        return interaction.editReply({ content: 'An unexpected error occurred. Please tell vincetheanimator.', embeds: [], components: [] });
    }
}

export function handlePrismaError(error: any) {
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
        return new CustomError(`Prisma error! Error code: ${error.code}`, ErrorType.Error, error)
    }
    return new CustomError("Strange Prisma error!", ErrorType.Error, new Error('None to give!'));
}