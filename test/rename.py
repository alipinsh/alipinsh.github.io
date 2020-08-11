from os import rename
from os import listdir
from os.path import isfile, join

for i in range(1, 6):
	for j in range(1, 33):
		rename(str(i) + '/' + str(j) + ".png", str(i) + '/' + str(i).zfill(2) + '_' + str(j).zfill(3) + '.png')