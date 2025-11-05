import {ChatInputCommandInteraction, SlashCommandBuilder, MessageFlags} from "discord.js";
import config from "../../config.json"

module.exports = {
    data: new SlashCommandBuilder()
        .setName("people")
        .setDescription("Lists all people you can ask a question"),
    execute: async (interaction: ChatInputCommandInteraction) => {
        await interaction.reply({content:
              config.people.map(p => `**${p.namePretty}**: ${p.description}`).join('\n\n'),
        flags: MessageFlags.Ephemeral})
    }
}