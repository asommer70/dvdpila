#!/usr/bin/python
#
# Testing getting information from Yoopsie.
#

import urllib2
from bs4 import BeautifulSoup


#barcode = "043396172340"
barcode = "085392841028"
url = "http://www.yoopsie.com/query.php?query=" + barcode

response = urllib2.urlopen(url)

html = response.read()
#print html

#html = open('yoopsie.html', 'r').read()

soup = BeautifulSoup(html)

items = soup.find_all("td", class_='info_image')

print items[0].a.img['src']
print items[0].a['title']
#for item in items:
#  print item.a.img['src']

