import { Command } from 'commander';
import chalk from 'chalk';
import { emoji } from '@/utils';
import Manager from './manager';
import logger from '@/logger';

const description = `Initialize a new project based on a template. You can initialize the application that conforms to the serverless devs project specification through GitHub, or you can initialize the application provided by the source by configuring the source.

Example:
    $ s init
    $ s init --project fc
    $ s init --project fc -d my_dir
    $ s init --project fc --app-name my-express
    $ s init --project fc --parameters '{"serviceName":"websiteService"}'
    $ s init --project git@github.com:foo/bar.git
    $ s init --project https://github.com/foo/bar.git
    
${emoji('🚀')} More applications: ${chalk.underline('https://registry.serverless-devs.com')}`;

export default (program: Command) => {
  program
    .command('init')
    .usage('[options]')
    .description(description)
    .summary(`${emoji('💞')} Initializing a serverless project`)
    .helpOption('-h, --help', 'Display help for command')
    .option('-d, --dir <dir>', 'Where to output the initialized app into (default: ./<ProjectName> )')
    .option('-r, --registry <url>', 'Use specify registry')
    .option('--uri <uri>', 'Use specify uri, Eg: remote url, local dir, local zip file')
    .option('--project <project>', 'Specify Template')
    .option('-y', 'Assume that the answer to any question which would be asked is yes')
    .option('--parameters <parameters>', 'Initialize with custom parameters')
    .option('--app-name <appName>', 'Modify default Application name')
    .action(async options => {
      if (options.parameters) {
        try {
          options.parameters = JSON.parse(options.parameters);
        } catch (_ex) {
          throw new Error('--parameters format error');
        }
      }

      // 兼容 s init <project>
      if (!options.project) {
        const template = process.argv[3];
        if (template && !template?.startsWith('-')) {
          options.project = template;
          logger.warn(`This method has been deprecated, please use --project ${template}`);
        }
      }
      const manager = new Manager({ ...options, ...program.optsWithGlobals() });
      await manager.init();
    });
};
