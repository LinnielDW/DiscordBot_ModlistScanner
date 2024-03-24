import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getBadModList, getPastebinContent } from "../utils/getHelper";

export const data = new SlashCommandBuilder()
    .setName("modscan")
    .setDescription("Scans a rentry or pastebin list of your mods and finds problematic mods.")
    .addStringOption(option =>
        option.setName('link')
            .setDescription('The link to your modlist rentry/pastebin')
            .setRequired(true));

export async function execute(interaction: CommandInteraction) {
    const badMods = await getBadModList();

    if (!badMods) {
        return interaction.reply("Could not get the bad mods list");
    }

    let pastebinUrl: string = interaction.options.get('link')?.value as string;
    if (!pastebinUrl.endsWith('/raw')) {
        pastebinUrl = `${pastebinUrl}/raw`;
    }

    const modlist = await getPastebinContent(pastebinUrl);
    if (!modlist) {
        return interaction.reply("Could not get rentry reply");
    }

    const regex = /([0-9].*\. \!\[\]\(.*\) )\[(.*)\]/gm;
    const parsedModlist = modlist.matchAll(regex);

    const modNameList: string[] = [];
    for (const r of parsedModlist) {
        modNameList.push(r[2]);
    }

    const filteredModlist = modNameList.filter(value => badMods.includes(value));

    if(filteredModlist.length > 0){
        let ohNo = "Your mod list contains known problematic mods, they are: "
        filteredModlist.forEach(mod => {
            ohNo += `\n    - ${mod}`
        });
        return interaction.reply(ohNo);
    }
    else{

        return interaction.reply("Modlist clean!");
    }
}

