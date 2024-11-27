import { SlashCommandBuilder, ChatInputCommandInteraction, EmbedBuilder } from "discord.js";
import { ROLES } from "../configuration/roles";  // ID ролей
import { sendLog } from "../utils/logger";  // Функция логирования

export const promotionCommand = {
    data: new SlashCommandBuilder()
        .setName("promotion")
        .setDescription("Логирование повышения.")
        .addUserOption(option =>
            option.setName("пользователь").setDescription("Кто был повышен").setRequired(true)
        )
        .addStringOption(option =>
            option.setName("должность").setDescription("Новая должность").setRequired(true)
        )
        .addNumberOption(option =>
            option.setName("стоимость").setDescription("Стоимость повышения").setRequired(true)
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
        const position = interaction.options.getString("должность", true);
        const cost = interaction.options.getNumber("стоимость", true);

        const embed = new EmbedBuilder()
            .setTitle("Повышение")
            .setColor(0x00ff00)
            .addFields(
                { name: "Пользователь", value: `${user}`, inline: true },
                { name: "Должность", value: position, inline: true },
                { name: "Стоимость", value: `${cost}`, inline: true },
                { name: "Инициатор", value: `${interaction.user}`, inline: true }
            )
            .setTimestamp();

        // Логирование в канал для повышения
        await sendLog(interaction.client, "PROMOTION", embed);

        await interaction.reply({ content: "Повышение успешно залогировано.", ephemeral: true });
    },
};
