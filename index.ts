import * as fs from 'fs'
import {StringyDriver} from './robot'

const driver = new StringyDriver()
fs.readFileSync('./commands.txt', 'utf8').split('\n').forEach((line) => driver.perform(line))

console.log(driver.log.join('\n'))