import {Client, Events, GatewayIntentBits, Collection, MessageFlags} from "discord.js";
import dotenv from "dotenv";
import * as path from "node:path";
import * as fs from "node:fs";
import {connect} from "mongoose"

dotenv.config();

interface ClientWithCommands extends Client {
    commands: Collection<string, any>
}

const client = new Client({intents: [GatewayIntentBits.Guilds]}) as ClientWithCommands;

client.on(Events.ClientReady, () => {
    console.log(client.user!.username + " is ready!");
    dbConnect();
});

client.commands = new Collection();

const folderPath = path.join(__dirname, 'commands');

const commandFiles = fs.readdirSync(folderPath).filter((file) => file.endsWith(".ts"));
for (const file of commandFiles) {
    const filePath = path.join(folderPath, file);
    import(filePath).then((module) => {
        if('data' in module && 'execute' in module) {
            client.commands.set(module.data.name, module);
        } else {
            console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
        }
    })
}

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter((file) => file.endsWith(".ts"));
for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    import(filePath).then((module) => {
        if(module.once) {
            client.once(module.name, (...args) => module.execute(...args));
        } else {
            client.on(module.name, (...args) => module.execute(...args));
        }
    })
}

client.on(Events.InteractionCreate, async (interaction) => {
    if(!interaction.isChatInputCommand()) return;
    const command = (interaction.client as ClientWithCommands).commands.get(interaction.commandName);

    if(!command) {
        console.error(`No command matching ${interaction.commandName} was found.`);
        return;
    }

    try {
        await command.execute(interaction);
    } catch (e) {
        console.error(e);
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            });
        } else {
            await interaction.reply({
                content: 'There was an error while executing this command!',
                flags: MessageFlags.Ephemeral,
            });
        }
    }
});


async function dbConnect() {
    await connect(process.env.MONGOURI!);
    console.log("Connected to DB");
}

client.login(process.env.TOKEN);