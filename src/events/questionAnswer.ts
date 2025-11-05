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
import {Question} from "../schema/question";

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
            .setDescription("Question: " + questionDB.question)
        const answerModal = new ModalBuilder()
            .setCustomId("answerModal")
            .setTitle("Please Answer the Question")
            .setLabelComponents(answerLabel)
        await interaction.showModal(answerModal)
    }
}