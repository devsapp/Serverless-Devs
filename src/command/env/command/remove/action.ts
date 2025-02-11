import { filter, find } from 'lodash';
import logger from '@/logger';
import { IOptions } from './type';
import fs from 'fs-extra';
import { ENVIRONMENT_FILE_NAME } from '@serverless-devs/parse-spec';
import * as utils from '@serverless-devs/utils';
import path from 'path';
import assert from 'assert';
import yaml from 'js-yaml';

class Action {
  constructor(private options: IOptions) {
    logger.debug(`s env update --option: ${JSON.stringify(options)}`);
  }
  async start() {
    const { template = path.join(process.cwd(), ENVIRONMENT_FILE_NAME), name } = this.options;
    assert(fs.existsSync(template), `The file ${template} was not found`);
    const { project, environments } = utils.getYamlContent(template);
    const data = find(environments, item => item.name === name);
    assert(data, `The environment ${name} was not found`);
    const newEnvironments = filter(environments, item => item.name !== name);
    fs.writeFileSync(template, yaml.dump({ project, environments: newEnvironments }));
    logger.write(`The environment ${name} was removed successfully`);
  }
}

export default Action;
