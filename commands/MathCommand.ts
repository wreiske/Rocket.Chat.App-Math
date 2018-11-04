import { IHttp, IModify, IRead } from '@rocket.chat/apps-engine/definition/accessors';
import { ISlashCommand, SlashCommandContext } from '@rocket.chat/apps-engine/definition/slashcommands';

export class MathCommand implements ISlashCommand {
    public command: string = 'math';
    public i18nParamsExample: string = 'Slash_Command_Params_Example';
    public i18nDescription: string = 'Slash_Command_Description';
    public providesPreview: boolean = false;

    public async executor(context: SlashCommandContext, read: IRead, modify: IModify, http: IHttp): Promise<void> {
        const icon = await read.getEnvironmentReader().getSettings().getValueById('math_icon');
        const username = await read.getEnvironmentReader().getSettings().getValueById('math_name');

        let text: string = '';
        let success: boolean = false;

        if (context.getArguments().length >= 1) {
            const mathSearch = encodeURIComponent(context.getArguments().slice().join(' '));
            const user = context.getSender().username;

            const response = await http.get(`https://apis.reiske.tech/api/rocket/math?q=${mathSearch}`);
            if (response.content) {
                const parsedResponse = JSON.parse(response.content);
                switch (response.statusCode) {
                    case 200:
                        success = true;
                        text = `@${user}, \\[${parsedResponse.body}\\]` as string;
                        break;
                    case 400:
                        text = `@${user}, and error occurred: ${parsedResponse.body}` as string;
                        break;
                    default:
                        break;
                }
            } else {
                text = `@${user}, an error occurred communicating with the Math API.`;
            }
        } else {
            text = 'No math problem found. Try /math 2+2';
        }

        const builder = modify.getCreator().startMessage()
            .setSender(/* botUser || */ context.getSender()).setRoom(context.getRoom())
            .setText(text).setUsernameAlias(username).setAvatarUrl(icon);

        if (success) {
            await modify.getCreator().finish(builder);
        } else {
            await modify.getNotifier().notifyUser(context.getSender(), builder.getMessage());
        }
    }
}
