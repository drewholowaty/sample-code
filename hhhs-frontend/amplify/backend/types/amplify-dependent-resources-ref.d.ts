export type AmplifyDependentResourcesAttributes = {
    "auth": {
        "userPoolGroups": {
            "DentistsGroupRole": "string",
            "StudentsGroupRole": "string"
        },
        "hhhsfrontend8f8141908f814190": {
            "IdentityPoolId": "string",
            "IdentityPoolName": "string",
            "UserPoolId": "string",
            "UserPoolArn": "string",
            "UserPoolName": "string",
            "AppClientIDWeb": "string",
            "AppClientID": "string"
        }
    },
    "function": {
        "hhhsfrontend8f8141908f814190PostConfirmation": {
            "Name": "string",
            "Arn": "string",
            "LambdaExecutionRole": "string",
            "Region": "string"
        },
        "hhhsfrontendc4ccc546": {
            "Name": "string",
            "Arn": "string",
            "Region": "string",
            "LambdaExecutionRole": "string"
        }
    },
    "storage": {
        "users": {
            "Name": "string",
            "Arn": "string",
            "StreamArn": "string",
            "PartitionKeyName": "string",
            "PartitionKeyType": "string",
            "Region": "string"
        }
    },
    "api": {
        "api994a52bc": {
            "RootUrl": "string",
            "ApiName": "string",
            "ApiId": "string"
        }
    }
}