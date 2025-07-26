import {
	IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription,
  NodeOperationError
} from 'n8n-workflow';
import { promises as fsPromise } from 'fs-extra';
import { file as tmpFile } from 'tmp-promise';
import { exec } from 'child_process';
import { promisify } from 'util'

const execPromise = promisify(exec);

/**
 * Check if markitdown command is available and get its path
 */
async function checkMarkitdownAvailability(node: any): Promise<string> {
  try {
    // First try the direct command
    await execPromise('markitdown --version');
    return 'markitdown';
  } catch (error) {
    // Try to find it using which/where
    try {
      const { stdout } = await execPromise('which markitdown 2>/dev/null || find /usr -name markitdown 2>/dev/null | head -1');
      const markitdownPath = stdout.trim();
      if (markitdownPath) {
        await execPromise(`${markitdownPath} --version`);
        return markitdownPath;
      }
    } catch (findError) {
      // Continue to the error below
    }
    
    throw new NodeOperationError(node, 
      'markitdown command not found. Please ensure Python and markitdown are installed:\n' +
      '1. Install Python 3: https://python.org\n' +
      '2. Install markitdown: pip install markitdown\n' +
      '3. Ensure markitdown is in your PATH\n' +
      'Original error: ' + error.message
    );
  }
}

export class Markitdown implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Markitdown',
		name: 'markitdown',
		icon: 'file:microsoft.svg',
		group: ['transform'],
		version: 1,
		description: 'Convert any file into markdown',
		defaults: {
			name: 'Markitdown',
		},
		// @ts-ignore
		inputs: ['main'],
		// @ts-ignore
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
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    // Check if markitdown is available before processing any items and get its path
    let markitdownCommand: string;
    try {
      markitdownCommand = await checkMarkitdownAvailability(this.getNode());
    } catch (error) {
      throw error; // Re-throw NodeOperationError from checkMarkitdownAvailability
    }

    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];

    for (let i = 0; i < items.length; i++) {
      try {
        const inputBinaryField = this.getNodeParameter('inputBinaryField', i) as string;

				const binaryData = this.helpers.assertBinaryData(i, inputBinaryField);

				const inputTmpFile = await tmpFile({
					prefix: 'n8n-markitdown-input-',
					postfix: binaryData.fileName
				});
				await fsPromise.writeFile(inputTmpFile.path, Buffer.from(binaryData.data, 'base64'));

				const outputTmpFile = await tmpFile({
					prefix: 'n8n-markitdown-output-',
					postfix: '.md',
				});

        const command = `${markitdownCommand} "${inputTmpFile.path}" -o "${outputTmpFile.path}"`.trim();

				await execPromise(command);

        const outputContent = await fsPromise.readFile(outputTmpFile.path, 'utf-8');
        const newItem: INodeExecutionData = {
          json: {
						data: outputContent
					},
          binary: { },
        };
        returnData.push(newItem);

        // Clean up temporary files
        await Promise.all([
          inputTmpFile.cleanup(),
          outputTmpFile.cleanup()
        ]);

      } catch (error) {
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

