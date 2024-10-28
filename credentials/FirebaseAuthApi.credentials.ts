import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class FirebaseAuthApi implements ICredentialType {
	name = 'firebaseAuthApi';
	displayName = 'Firebase Auth API';
	properties: INodeProperties[] = [
		{
			displayName: 'Project ID',
			name: 'projectId',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Client Email',
			name: 'clientEmail',
			type: 'string',
			default: '',
		},
		{
			displayName: 'Private Key',
			name: 'privateKey',
			type: 'string',
			default: '',
			typeOptions: {
				password: true,
			},
		},
	];
}
