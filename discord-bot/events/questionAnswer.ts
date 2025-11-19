import {
    ButtonInteraction,
    Events,
    LabelComponent,
    MessageFlags,
    ModalBuilder,
    TextInputBuilder,
    TextInputStyle,
    LabelBuilder, TextDisplayBuilder
} from "discord.js";
import {Question} from "../../webserver/src/schema/question.ts";

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    execute: async (interaction: ButtonInteraction) => {
        if(interaction.isChatInputCommand()) return;
        if(interaction.customId !== "answer") return;
        const questionDB = await Question.findOne({id: interaction.message.id});
        if(!questionDB) return interaction.reply({content: 'Cannot find this question anywhere!?', flags: MessageFlags.Ephemeral});

        const answerInput = new TextInputBuilder()
            .setCustomId("answerUser")
            .setStyle(TextInputStyle.Paragraph)
        const answerLabel = new LabelBuilder()
            .setLabel("Your Answer:")
            .setTextInputComponent(answerInput)
        const answerModal = new ModalBuilder()
            .setCustomId("answerModal")
            .setTitle("Please Answer the Question")
            .setLabelComponents(answerLabel)
        try {
            await interaction.showModal(answerModal);
        } catch (err: any) {
            console.error("Modal build failed:", err);
            if (err.errors) console.dir(err.errors, { depth: null });
        }
    }
}