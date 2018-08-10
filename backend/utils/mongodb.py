import pymongo


def get_db(db='datasets'):
    client = pymongo.MongoClient(
        "mongodb://bluenoml:elvoanalysis@104.196.51.205/elvo"
    )
    db = getattr(client.elvo, db)
    return db
