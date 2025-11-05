import {
    ChatInputCommandInteraction, SlashCommandBuilder, MessageFlags, EmbedBuilder, ButtonBuilder, ButtonStyle,
    ActionRowBuilder, TextChannel, MessageActionRowComponentBuilder
} from "discord.js";
import config from "../../config.json";
import spacetime from "spacetime";
import {HydratedDocument} from "mongoose";
import {IQuestion, Question} from "../schema/question";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("ask")
        .setDescription("Ask a question to the specified people")
        .addStringOption(option =>
            option.setName("person")
                .setDescription("Who do you want to ask to?")
                .setChoices(config.people.map(p => ({name: p.namePretty, value: p.name})))
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("input")
                .setDescription("What do you want to ask?")
                .setRequired(true)
        )
        .addStringOption(option =>
            option.setName("name")
                .setDescription("Would you like to attach a name to this question?")
        ),
    async execute(interaction: ChatInputCommandInteraction) {
        const person = interaction.options.getString("person")!;
        const input = interaction.options.getString("input")!;
        const name = interaction.options.getString("name");

        const personObj = config.people.find(p => p.name === person);
        if(!personObj) return interaction.reply({content: 'An error occurred, please tell Joey. **Error Code: incompleteconfig0x43**', flags: MessageFlags.Ephemeral})

        const inbox = await interaction.client.channels.fetch(personObj.inboxID) as TextChannel;
        if(!inbox) return interaction.reply({content: 'An error occurred, please tell Joey. **Error Code: incompleteconfig0x44**', flags: MessageFlags.Ephemeral})

        let s = spacetime.now(personObj.timezone)

        const questionEmbed = new EmbedBuilder()
            .setTitle(`A New Question From ${name ? name : 'Anonymous'}!`)
            .setDescription(`**${input}**`)
            .setColor('Random')
            .setFooter({text: `Question asked at ${s.format("nice")}`})
        const answerButton = new ButtonBuilder().setCustomId("answer").setEmoji("📥").setStyle(ButtonStyle.Success).setLabel("Answer Question")
        const buttonRow = new ActionRowBuilder<MessageActionRowComponentBuilder>().addComponents(answerButton)

        const questionData = await inbox.send({content: `<@${personObj.userID}>`, embeds: [questionEmbed], components: [buttonRow]})
        if(!questionData) return interaction.reply({content: `An error occurred, please tell Joey. **Error Code: failedtosend0x44**`, flags: MessageFlags.Ephemeral})

        const question: HydratedDocument<IQuestion> = new Question({
            id: questionData.id,
            question: input,
            nameQ: name ? name : `Anonymous`,
            timeAsked: Date.now(),
            answered: false
        });

        await question.save()

        await interaction.reply({
            content: `Thank you for asking a question to ${personObj.namePretty}.\nYour answered question will appear in <#1435673341582250016>.${name ? `\nSince you chose to add a name, your answer will be linked with that name`: ``}`,
            flags: MessageFlags.Ephemeral
        });
    }
}