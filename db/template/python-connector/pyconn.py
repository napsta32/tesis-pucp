import mysqlx
import os

# Connect to server on localhost
session = mysqlx.get_session({
    "host": "fpena_preprocessing_db",
    "port": 33060,
    "user": os.environ['DB_USER'],
    "password": os.environ['DB_PASSWORD']
})

# Get schema object
schema = session.get_schema("test")

# Use the collection "my_collection"
collection = schema.get_collection("my_collection")

# Specify which document to find with Collection.find()
result = collection.find("name like :param") \
                   .bind("param", "S%").limit(1).execute()

# Print document
docs = result.fetch_all()
print("Name: {0}".format(docs[0]["name"]))

session.close()
