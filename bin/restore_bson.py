#!/usr/bin/env python
#
# Script to import a BSON file exported from MongoDB to PostgreSQL.
#


import bson
# from bson.codec_options import CodecOptions
import collections
import json


# Read the BSON file.
# dvds_bson = open('backups/dvds.bson', 'rb').readlines()
# dvds_json = open('backups/dvds.json', 'r').read()
dvds_json = open('backups/dvds.json', 'r').readlines()
# print('dvds_bson:', dvds_bson)
# print()

# data = bson.BSON.encode(dvds_bson)
# print('data:', data)
# dvds = bson.BSON(data).decode()

# dvds = json.loads(dvds_json)
for entry in dvds_json[0:2]:
    # print('entry:', entry)
    dvd = json.loads(entry)
    print('dvd:', dvd)
    # dvd = bson.loads(entry)
    print('dvd[title]:', dvd['title'], dvd['createdAt']['$date'])
    print()
# print('dvds: ', dvds)
# print('dvds[title]: ', dvds['title'])
# print()
