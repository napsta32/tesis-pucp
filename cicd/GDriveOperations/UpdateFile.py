import os.path
import sys

from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
from googleapiclient.http import MediaFileUpload

from utils.GoogleCredentials import get_credentials


def update_file(creds, fileId: str, fileName: str):
    """
    Update Google Drive file
    """
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
    """
    Main script
    """
    assert len(sys.argv) == 3, 'Expected 2 arguments'

    fileId = sys.argv[1]
    fileName = sys.argv[2]
    print('Updating drive file id {} with contents of file {}'.format(
        fileName, fileId))

    creds = get_credentials()
    update_file(creds, fileId, fileName)


"""
Update existing file in Google Drive.
Arguments:
1. fileId: File to update
2. fileName: File to upload
"""
if __name__ == '__main__':
    main()
