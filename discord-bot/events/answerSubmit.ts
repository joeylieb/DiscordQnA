import {EmbedBuilder, Events, MessageFlags, ModalSubmitInteraction, TextChannel} from "discord.js";
import {Question} from "../../webserver/src/schema/question.ts";
import config from "../../config.json"
import spacetime from "spacetime";

module.exports = {
    name: Events.InteractionCreate,
    once: false,
    execute: async (interaction: ModalSubmitInteraction) => {
        if(!interaction.isModalSubmit()) return;
        if(interaction.customId !== "answerModal") return;

        const answer = interaction.fields.getTextInputValue("answerUser");
        if(!interaction.message) return interaction.reply({content: 'Cannot find the question embed!', flags: MessageFlags.Ephemeral});
        const questionDB = await Question.findOne({id: interaction.message.id});
        if(!questionDB) return interaction.reply({content: 'Cannot find this question anywhere!?', flags: MessageFlags.Ephemeral});

        const answerChannel = await interaction.client.channels.fetch(config.answerChannel) as TextChannel;
        if(!answerChannel) return interaction.reply({content: 'Cannot find the answer channel!', flags: MessageFlags.Ephemeral});

        const answerer = config.people.find(p => p.userID === interaction.user.id);
        if(!answerer) return interaction.reply({content: 'Cannot find your account data?!', flags: MessageFlags.Ephemeral});

        let s = spacetime(questionDB.timeAsked, "America/New_York")

        const questionAnswerEmbed = new EmbedBuilder()
            .setTitle(`New Answer Sent From ${answerer.namePretty}`)
            .setDescription(`*"${questionDB.question}"* - ${questionDB.nameQ}\n↳\n**${answer}**`)
            .setFooter({text: `Question asked at ${s.format("nice")} EST`});
        await answerChannel.send({embeds: [questionAnswerEmbed]});
        questionDB.answered = true;
        await interaction.reply({content: 'Successfully Answered', flags: MessageFlags.Ephemeral});
        await interaction.message.delete();
    }
}