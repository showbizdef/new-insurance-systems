import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { ROLES } from "../configuration/roles";  // ID ролей
import { sendLog } from "../utils/logger";  // Функция логирования

export const blacklistCommand = {
    data: new SlashCommandBuilder()
        .setName("blacklist")
        .setDescription("Занести пользователя в черный список.")
        .addUserOption(option =>
            option.setName("пользователь").setDescription("Кого занести в черный список").setRequired(true)
        )
        .addStringOption(option =>
            option.setName("причина").setDescription("Причина занесения в черный список").setRequired(true)
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const member = interaction.member;

        // Проверка ролей
        if (!member || !("roles" in member)) {
            return interaction.reply({ content: "Не удалось проверить роли пользователя.", ephemeral: true });
        }

        const roles = member.roles as any;
        const hasPermission = roles.cache.some((role: any) => Object.values(ROLES).includes(role.id));
        if (!hasPermission) {
            return interaction.reply({ content: "У вас нет прав для использования этой команды.", ephemeral: true });
        }

        const user = interaction.options.getUser("пользователь", true);
        const reason = interaction.options.getString("причина", true);

        const embed = new EmbedBuilder()
            .setTitle("Занесение в черный список")
            .setColor(0x000000)
            .addFields(
                { name: "Пользователь", value: `${user}`, inline: true },
                { name: "Причина", value: reason, inline: true },
                { name: "Инициатор", value: `${interaction.user}`, inline: true }
            )
            .setTimestamp();

        // Логирование в канал для черного списка
        await sendLog(interaction.client, "BLACKLIST", embed);

        await interaction.reply({ content: "Пользователь занесен в черный список.", ephemeral: true });
    },
};
