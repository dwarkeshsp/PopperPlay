import requests
import urllib.request
import time
from bs4 import BeautifulSoup
import numpy as np
import pandas as pd
from urllib.request import urlopen

url = 'https://en.wikipedia.org/wiki/List_of_unsolved_problems_in_computer_science'
html = urlopen(url)
soup = BeautifulSoup(html, 'html.parser')
text = soup.find_all('ul')
print(len(text))
