#!/usr/bin/env python
#
# Script to import a BSON file exported from MongoDB to PostgreSQL.
#
# Used the *bsondump* utility to convert the dvds.bson file from MongoDB to JSON.
# "bsondump --outFile=collection.json collection.bson"
#


import bson
# from bson.codec_options import CodecOptions
import collections
import json
import psycopg2


# Connect to the db.
db = psycopg2.connect("dbname=dvdpila user=adam")
cursor = db.cursor()
# cursor.execute('SELECT * FROM dvd')
# dvds = cursor.fetchall()

# Read the BSON file.
dvds_bson = open('backups/dvds.bson', 'rb').readlines()
# dvds_json = open('backups/dvds.json', 'r').read()
dvds_json = open('backups/dvds.json', 'r').readlines()
# print('dvds_bson:', dvds_bson)
# print()

# data = bson.BSON.encode(dvds_bson)
# print('data:', data)
# dvds = bson.BSON(data).decode()
# for entry in dvds_bson[0:2]:
#     # print('entry:', entry)
#     dvd = bson.loads(entry)
#     print('dvd:', dvd)
#     print()

# dvds = json.loads(dvds_json)
for entry in dvds_json[0:2]:
    # print('entry:', entry)
    dvd = json.loads(entry)
    # print('dvd:', dvd)
    # dvd = bson.loads(entry)
    print('dvd[title]:', dvd['title'], dvd['createdAt']['$date'])
    print()
# print('dvds: ', dvds)
# print('dvds[title]: ', dvds['title'])
# print()
