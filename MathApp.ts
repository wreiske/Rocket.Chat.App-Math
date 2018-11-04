import {
    IConfigurationExtend, IEnvironmentRead, ILogger,
} from '@rocket.chat/apps-engine/definition/accessors';
import { App } from '@rocket.chat/apps-engine/definition/App';
import { IAppInfo } from '@rocket.chat/apps-engine/definition/metadata';
import { SettingType } from '@rocket.chat/apps-engine/definition/settings';

import { MathCommand } from './commands/MathCommand';

export class MathApp extends App {

    constructor(info: IAppInfo, logger: ILogger) {
        super(info, logger);
    }

    protected async extendConfiguration(configuration: IConfigurationExtend, environmentRead: IEnvironmentRead): Promise<void> {
        await configuration.settings.provideSetting({
            id: 'math_name',
            type: SettingType.STRING,
            packageValue: 'Math',
            required: true,
            public: false,
            i18nLabel: 'Customize_Name',
            i18nDescription: 'Customize_Name_Description',
        });

        await configuration.settings.provideSetting({
            id: 'math_icon',
            type: SettingType.STRING,
            packageValue: 'https://apis.reiske.tech/images/rocket.reiske.tech-math-icon.svg',
            required: true,
            public: false,
            i18nLabel: 'Customize_Icon',
            i18nDescription: 'Customize_Icon_Description',
        });

        await configuration.slashCommands.provideSlashCommand(new MathCommand());
    }

}
