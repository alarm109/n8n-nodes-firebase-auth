import type {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
} from 'n8n-workflow';
import { NodeOperationError } from 'n8n-workflow';

const admin = require('firebase-admin');
const { getAuth } = require('firebase-admin/auth');

function createFirebaseAdminApp(params: any) {
	const privateKey = params.privateKey.replace(/\\n/g, '\n');

	if (admin.apps.length > 0) {
		return admin.app();
	}

	const cert = admin.credential.cert({
		projectId: params.projectId,
		clientEmail: params.clientEmail,
		privateKey: privateKey,
	});

	return admin.initializeApp({
		credential: cert,
		projectId: params.projectId,
	});
}

export class FirebaseAuth implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'Firebase Auth',
		name: 'firebaseAuth',
		icon: 'file:firebase.svg',
		group: ['transform'],
		version: 1,
		description: 'Interact with Firebase Auth',
		defaults: {
			name: 'Firebase Auth',
		},
		inputs: ['main'],
		outputs: ['main'],
		credentials: [
			{
				name: 'firebaseAuthCredentialsApi',
				required: true,
			},
		],
		properties: [
			// Node properties which the user gets displayed and
			// can change on the node.
			{
				displayName: 'Email',
				default: '',
				description: 'The email of the user to get the uid',
				name: 'email',
				placeholder: 'john.doe@example.com',
				required: true,
				type: 'string',
			},
		],
	};

	// The function below is responsible for actually doing whatever this node
	// is supposed to do. In this case, we're just appending the `myString` property
	// with whatever the user has entered.
	// You can make async calls and use `await`.
	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const app = createFirebaseAdminApp({
			privateKey: String((await this.getCredentials('firebaseAuthCredentialsApi')).privateKey),
			projectId: String((await this.getCredentials('firebaseAuthCredentialsApi')).projectId),
			clientEmail: String((await this.getCredentials('firebaseAuthCredentialsApi')).clientEmail),
		});

		const auth = getAuth(app);

		const items = this.getInputData();

		let item: INodeExecutionData;
		let email: string;

		// Iterates over all input items and add the key "myString" with the
		// value the parameter "myString" resolves to.
		// (This could be a different value for each item in case it contains an expression)
		for (let itemIndex = 0; itemIndex < items.length; itemIndex++) {
			try {
				email = this.getNodeParameter('email', itemIndex, '') as string;
				item = items[itemIndex];

				item.json.uid = (await auth.getUserByEmail(email)).uid;
			} catch (error) {
				// This node should never fail but we want to showcase how
				// to handle errors.
				if (this.continueOnFail()) {
					items.push({ json: this.getInputData(itemIndex)[0].json, error, pairedItem: itemIndex });
				} else {
					// Adding `itemIndex` allows other workflows to handle this error
					if (error.context) {
						// If the error thrown already contains the context property,
						// only append the itemIndex
						error.context.itemIndex = itemIndex;
						throw error;
					}
					throw new NodeOperationError(this.getNode(), error, {
						itemIndex,
					});
				}
			}
		}

		return [items];
	}
}
