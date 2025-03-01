import { Command } from 'commander';
import { parseArgv, setGlobalConfig, getGlobalConfig } from '@serverless-devs/utils';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { emoji } from '@/utils';
import logger from '@/logger';

const description = `Set analysis action.

    Example:
        $ s set analysis
        $ s set analysis disable
        
${emoji('📖')} Document: ${chalk.underline('https://github.com/Serverless-Devs/Serverless-Devs/tree/master/docs/zh/command/set.md')}`;

const promptOption = [
  {
    type: 'list',
    name: 'analysis',
    message: 'Choose a action?',
    choices: [
      {
        name: 'enable',
        value: 'enable',
      },
      {
        name: 'disable',
        value: 'disable',
      },
    ],
  },
];

export default (program: Command) => {
  program
    .command('analysis')
    .usage('[options]')
    .description(description)
    .summary(`${emoji('👉')} Set to enable or disable analysis`)
    .helpOption('-h, --help', 'Display help for command')
    .action(async () => {
      logger.write(`\n${emoji('👉')} Current analysis action: ${getGlobalConfig('analysis', 'enable')}\n`);
      const { _: raw } = parseArgv(process.argv.slice(2));
      let type = raw[2];
      if (type) {
        if (!['enable', 'disable'].includes(type)) {
          throw new Error(`Not Supported: ${type}. Only accept [enable, disable]`);
        }
      } else {
        const answers = await inquirer.prompt(promptOption);
        type = answers.analysis;
      }
      setGlobalConfig('analysis', type);
      logger.write(chalk.green(`Set analysis to ${type} successfully`));
    });
};
