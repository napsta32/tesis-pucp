import os.path
import sys

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

from utils.GoogleCredentials import get_credentials


def upload_file(creds, fileName: str, destDirectory: str):
    """
    Upload file to Google Drive
    """
    try:
        # create drive api client
        service = build('drive', 'v3', credentials=creds)

        file_metadata = {
            'name': fileName,
            'parents': [destDirectory]
        }
        media = MediaFileUpload(fileName,
                                mimetype='application/octet-stream')
        # pylint: disable=maybe-no-member
        file = service.files().update(body=file_metadata, media_body=media,
                                      fields='id').execute()
        print(F'File ID: {file.get("id")}')

    except HttpError as error:
        print(F'An error occurred: {error}')
        file = None

    return file.get('id')


def main():
    """
    Main script
    """
    assert len(sys.argv) == 3, 'Expected 2 arguments'

    fileName = sys.argv[1]
    destDirectory = sys.argv[2]
    print('Uploading file {} to google drive directory {}'.format(
        fileName, destDirectory))

    creds = get_credentials()
    upload_file(creds, fileName, destDirectory)


"""
Upload file to Google Drive directory.
Arguments:
1. fileName: File to upload
2. destDirectory: Directory ID that will contain the uploaded file
"""
if __name__ == '__main__':
    main()
