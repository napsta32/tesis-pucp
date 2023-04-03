import os.path
import sys

from googleapiclient.discovery import build, Resource
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload
from google.oauth2.credentials import Credentials

from utils.GoogleCredentials import get_credentials


def update_file(creds: Credentials, fileId: str, fileName: str) -> str:
    """Update existent Google Drive file

    Args:
        creds (Credentials): Google OAuth2.0 credentials
        fileId (str): Google Drive file id of existent file
        fileName (str): Google Drive file name

    Returns:
        str: Id of the file that was updated
    """
    try:
        # create drive api client
        service: Resource = build('drive', 'v3', credentials=creds)

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
    """Main script
    """
    assert len(sys.argv) == 3, 'Expected 2 arguments'

    fileId = sys.argv[1]
    fileName = sys.argv[2]
    print('Updating drive file id {} with contents of file {}'.format(
        fileName, fileId))

    creds = get_credentials()
    update_file(creds, fileId, fileName)


"""Update existing file in Google Drive.
Arguments:
1. fileId: File to update
2. fileName: File to upload
"""
if __name__ == '__main__':
    main()
