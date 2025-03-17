import { IExecuteFunctions } from 'n8n-workflow';
import { promises as fsPromise } from 'fs-extra';
import { Markitdown } from '../Markitdown.node'
import * as path from 'path';

describe('Markitdown Node', () => {
	let nodeInstance = new Markitdown()
	const sampleFilePath = path.join(__dirname, 'test.docx');
  let sampleFileBuffer: Buffer;

	beforeAll(async () => {
		sampleFileBuffer = await fsPromise.readFile(sampleFilePath);
	})

	afterAll(async () => {
    try {
			jest.restoreAllMocks(); // Reset mocks after each test
    } catch (error) {
      // Ignore if already deleted
    }
  });

	it('should convert a document to markdown', async () => {
    // Create a mock execution context with real binary data
    const mockExecuteFunctions: IExecuteFunctions = {
      getInputData: () => [{
        json: { filename: 'test-sample.docx' },
        binary: {
          data: {
            fileName: 'test-sample.docx',
            mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
            data: sampleFileBuffer.toString('base64')
          }
        }
      }],
      getNodeParameter: () => 'data',
      helpers: {
        assertBinaryData: (itemIndex: number, field: string) => {
          const items = mockExecuteFunctions.getInputData();
          if (itemIndex >= items.length) {
            throw new Error(`Item index ${itemIndex} out of bounds`);
          }

          const item = items[itemIndex];
          if (!item.binary || !item.binary[field]) {
            throw new Error(`Binary data not found for field ${field}`);
          }

          return item.binary[field];
        }
      },
      continueOnFail: () => false
    } as unknown as IExecuteFunctions;

    // Execute the node function
    const result = await nodeInstance.execute.call(mockExecuteFunctions);

    // Verify the results
    expect(result).toHaveLength(1);
    expect(result[0]).toHaveLength(1);
		const readSample = await fsPromise.readFile(path.join(__dirname, 'test.md'), 'utf-8')
    expect(result[0][0].json.data).toBe(readSample.trimEnd());

	}, 30000)

});
