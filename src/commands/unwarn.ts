import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { ROLES } from "../configuration/roles";  // ID ролей
import { sendLog } from "../utils/logger";  // Функция логирования

export const unwarnCommand = {
    data: new SlashCommandBuilder()
        .setName("unwarn")
        .setDescription("Снять выговор.")
        .addUserOption(option =>
            option.setName("пользователь").setDescription("С кого снять выговор").setRequired(true)
        )
        .addStringOption(option =>
            option.setName("причина").setDescription("Причина снятия выговора").setRequired(true)
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
            .setTitle("Снятие выговора")
            .setColor(0x00ff00)
            .addFields(
                { name: "Пользователь", value: `${user}`, inline: true },
                { name: "Причина снятия", value: reason, inline: true },
                { name: "Инициатор", value: `${interaction.user}`, inline: true }
            )
            .setTimestamp();

        // Логирование в канал для выговоров
        await sendLog(interaction.client, "WARNS", embed);

        await interaction.reply({ content: "Выговор успешно снят.", ephemeral: true });
    },
};
