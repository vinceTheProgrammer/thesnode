import { Command } from '@sapphire/framework';
import { ColorRole } from '../constants/roles.js';
import { formatEnumNameCapitalSpaced } from '../utils/strings.js';
import { CustomError, handleCommandError } from '../utils/errors.js';
import { changeMemberSelectedColor, getUnlockedColors, unsetMemberColor } from '../utils/roles.js';
import { getBasicEmbed, getUnlockedColorsEmbed } from '../utils/embeds.js';
import { ErrorType } from '../constants/errors.js';
import { Color } from '../constants/colors.js';

export class ColorCommand extends Command {
    public constructor(context: Command.LoaderContext, options: Command.Options) {
        super(context, { ...options });
    }

    public override registerApplicationCommands(registry: Command.Registry) {
        registry.registerChatInputCommand((builder) =>
            builder
                .setName('color')
                .setDescription('Select your color')
                .addStringOption(option => {
                    return option
                        .setName('color')
                        .setDescription('The color role you want')
                        .setChoices([
                                ...Object.entries(ColorRole).map(([name, value]) => ({
                                    name: formatEnumNameCapitalSpaced(name),
                                    value: name
                                })), 
                                {
                                    name: "None",
                                    value: "None"
                                }
                            ]
                        )
                        .setRequired(false)
                })
            ,
            {idHints: ['1298906311123271721']}
        );
    }

    public override async chatInputRun(interaction: Command.ChatInputCommandInteraction) {
        try {
            await interaction.reply({ content: `Setting color...`, ephemeral: true });

            if (!interaction.guild) throw new CustomError("Guild is not defined.", ErrorType.Error)
            const member = await interaction.guild.members.fetch(interaction.user.id).catch(err => { throw new CustomError("User is not a member of the guild.", ErrorType.Error, err) });

            const selectedColor = interaction.options.getString('color');
            if (selectedColor == null) return interaction.editReply({ content: '', embeds: [getUnlockedColorsEmbed(member)] })

            if (selectedColor.toLowerCase() == 'none') {
                await unsetMemberColor(member);
                return interaction.editReply({content: '', embeds: [getBasicEmbed({description: `Successfully unset your color.`, color: Color.SuccessGreen})]});
            }

            const unlockedColors = getUnlockedColors(member);
            if (unlockedColors.length === 0) throw new CustomError("You do not have any colors unlocked.", ErrorType.Warning, undefined, "💡 Use /color without any arguments to see requirements.");

            const selectedColorRole = ColorRole[selectedColor as keyof typeof ColorRole];
            if (selectedColorRole == undefined) throw new CustomError(`"${selectedColor}" could not be converted to a ColorRole.`, ErrorType.Error);

            const memberMeetsRequirementForColor = unlockedColors.includes(ColorRole[selectedColor as keyof typeof ColorRole]);

            if (!memberMeetsRequirementForColor) throw new CustomError(`You have not unlocked ${formatEnumNameCapitalSpaced(selectedColor)}`, ErrorType.Warning, undefined, "💡 Use /color without any arguments to see requirements.");

            const role = await changeMemberSelectedColor(member, selectedColorRole);

            return interaction.editReply({content: '', embeds: [getBasicEmbed({description: `Successfully set your color to ${formatEnumNameCapitalSpaced(selectedColor)}`, color: role.color})]});
        } catch (error) {
            handleCommandError(interaction, error);
        }
    }
}
