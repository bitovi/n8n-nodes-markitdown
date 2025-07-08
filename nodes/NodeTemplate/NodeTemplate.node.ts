import {
  IExecuteFunctions,
  INodeExecutionData,
  INodeType,
  INodeTypeDescription
} from 'n8n-workflow';

export class NodeTemplate implements INodeType {
  description: INodeTypeDescription = {
    displayName: 'Node Template',
    name: 'nodeTemplate',
    icon: 'file:icon.svg',
    group: ['transform'],
    version: 1,
    description: 'Describe what your node does',
    defaults: {
      name: 'Node Template',
    },
    inputs: ['main'],
    outputs: ['main'],
    properties: [
      {
        displayName: 'Example Property',
        name: 'exampleProperty',
        type: 'string',
        default: '',
        description: 'Describe this property',
      }
    ],
  };

  async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
    const items = this.getInputData();
    const returnData: INodeExecutionData[] = [];
    for (let i = 0; i < items.length; i++) {
      returnData.push({ json: { example: 'Hello from NodeTemplate!' } });
    }
    return [returnData];
  }
} 