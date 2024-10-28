import { ICredentialType, INodeProperties } from 'n8n-workflow';

export class FirebaseAuthCredentialsApi implements ICredentialType {
	name = 'firebaseAuthCredentialsApi';
	displayName = 'Firebase Admin Credentials API';
	properties: INodeProperties[] = [
		// The credentials to get from user and save encrypted.
		// Properties can be defined exactly in the same way
		// as node properties.
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
