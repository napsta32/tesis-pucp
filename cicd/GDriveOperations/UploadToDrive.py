import os.path
import sys

from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

SECRETS_FILE = 'DriveUploader-secrets.json'
TOKEN_FILE = 'token.json'
SCOPES = ['https://www.googleapis.com/auth/drive']
DEST_DIR = ''


def get_credentials():
    creds = None
    # The file token.json stores the user's access and refresh tokens, and is
    # created automatically when the authorization flow completes for the first
    # time.
    if os.path.exists(TOKEN_FILE):
        creds = Credentials.from_authorized_user_file(TOKEN_FILE, SCOPES)
    # If there are no (valid) credentials available, let the user log in.
    if not creds or not creds.valid:
        if creds and creds.expired and creds.refresh_token:
            creds.refresh(Request())
        else:
            if not os.path.exists(SECRETS_FILE):
                print('Could not find secrets file')
                exit(1)

            flow = InstalledAppFlow.from_client_secrets_file(
                SECRETS_FILE, SCOPES)
            creds = flow.run_local_server(port=0)
        # Save the credentials for the next run
        with open(TOKEN_FILE, 'w') as token:
            token.write(creds.to_json())
    return creds


def describe(obj):
    print(type(obj))
    print([val for val in dir(type(obj))])


def update_file(creds, fileName: str, fileId: str, destDirectory: str):
    try:
        # create drive api client
        service = build('drive', 'v3', credentials=creds)

        file_metadata = {
            'name': fileName
        }
        media = MediaFileUpload(fileName,
                                mimetype='application/octet-stream')
        # pylint: disable=maybe-no-member
        file = service.files().update(fileId=fileId, body=file_metadata, media_body=media,
                                      fields='id').execute()
        print(F'File ID: {file.get("id")}')

    except HttpError as error:
        print(F'An error occurred: {error}')
        file = None

    return file.get('id')


def main():
    assert len(sys.argv) == 4, 'Expected 3 arguments'

    fileName = sys.argv[1]
    fileId = sys.argv[2]
    destDirectory = sys.argv[3]
    print('Uploading file {} to google drive directory "{}"'.format(
        fileName, destDirectory))

    creds = get_credentials()
    update_file(creds, fileName, fileId, destDirectory)


if __name__ == '__main__':
    main()
