"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Markitdown = void 0;
const fs_extra_1 = require("fs-extra");
const tmp_promise_1 = require("tmp-promise");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execPromise = (0, util_1.promisify)(child_process_1.exec);
class Markitdown {
    constructor() {
        this.description = {
            displayName: 'Markitdown',
            name: 'markitdown',
            icon: 'file:microsoft.svg',
            group: ['transform'],
            version: 1,
            description: 'Convert any file into markdown',
            defaults: {
                name: 'Markitdown',
            },
            inputs: ['main'],
            outputs: ['main'],
            properties: [
                {
                    displayName: 'Input Binary Field',
                    name: 'inputBinaryField',
                    type: 'string',
                    default: 'data',
                    required: true,
                    description: 'Name of the binary property containing the file to process',
                }
            ],
        };
    }
    async execute() {
        const items = this.getInputData();
        const returnData = [];
        for (let i = 0; i < items.length; i++) {
            try {
                const inputBinaryField = this.getNodeParameter('inputBinaryField', i);
                const binaryData = this.helpers.assertBinaryData(i, inputBinaryField);
                const inputTmpFile = await (0, tmp_promise_1.file)({
                    prefix: 'n8n-markitdown-input-',
                    postfix: binaryData.fileName
                });
                await fs_extra_1.promises.writeFile(inputTmpFile.path, Buffer.from(binaryData.data, 'base64'));
                const outputTmpFile = await (0, tmp_promise_1.file)({
                    prefix: 'n8n-markitdown-output-',
                    postfix: '.md'
                });
                const command = `markitdown "${inputTmpFile.path}" -o "${outputTmpFile.path}"`.trim();
                await execPromise(command);
                const outputContent = await fs_extra_1.promises.readFile(outputTmpFile.path, 'utf-8');
                const newItem = {
                    json: {
                        data: outputContent
                    },
                    binary: {},
                };
                returnData.push(newItem);
                await Promise.all([
                    inputTmpFile.cleanup(),
                    outputTmpFile.cleanup()
                ]);
            }
            catch (error) {
                if (this.continueOnFail()) {
                    returnData.push({
                        json: {
                            error: error.message,
                        },
                    });
                    continue;
                }
                throw error;
            }
        }
        return [returnData];
    }
}
exports.Markitdown = Markitdown;
//# sourceMappingURL=Markitdown.node.js.map