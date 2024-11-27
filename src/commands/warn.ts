import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder, MembershipScreeningFieldType, Embed } from "discord.js";
import { ROLES } from "../configuration/roles";
import { sendLog } from "../utils/logger";

export const warnCommand = {
    data: new SlashCommandBuilder()
        .setName("warn")
        .setDescription("Выдать выговор.")
        .addUserOption(option =>
            option.setName("Сотрудник").setDescription("Кому выдать выговор?").setRequired(true)
        )
        .addStringOption(option =>
            option.setName("Причина").setDescription("Причина выговора").setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const member = interaction.member;

        if (!member || !("roles" in member)) {
            return interaction.reply({ content: "Не удалось проверить роли пользователя.", ephemeral: true});
        }

        const roles = member.roles as any;
        const hasPermission = roles.cache.some((role: any) => Object.values(ROLES).includes(role.id));
        if (!hasPermission) {
            return interaction.reply({ content: "У вас нету прав для использования этой команды", ephemeral: true});
        }

        const user = interaction.options.getUser("Сотрудник", true);
        const reason = interaction.options.getString("Причина", true);

        const embed = new EmbedBuilder()
            .setTitle("Выдача выговора")
            .setColor(0xff0000)
            .addFields(
                { name: "Сотрудник", value: `${user}`, inline: true },
                { name: "Причина", value: reason, inline: true },
                { name: "Инициатор", value: `${interaction.user}`, inline: true }
            )
            .setTimestamp();

        await sendLog(interaction.client, embed);
        await interaction.reply({ content: "Выговор успешно выдан.", ephemeral: true });
    },
};