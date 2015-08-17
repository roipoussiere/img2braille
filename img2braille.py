#! usr/bin/python
# -*- coding: UTF-8 -*-

import csv
import Image   
import os, sys, tempfile
import struct
from scipy import misc as sm

if len(sys.argv)  != 3:
	print 'Usage: ' + sys.argv[0] + 'picture.png 160'
	print '1st arg: picture name, 2nd arg: picture width.'
	sys.exit(0)

input_file_name = os.path.abspath(sys.argv[1])
pic_width = int(sys.argv[2])

braille_cars = u"⠀⠁⠈⠉⠂⠃⠊⠋⠐⠑⠘⠙⠒⠓⠚⠛⠄⠅⠌⠍⠆⠇⠎⠏⠔⠕⠜⠝⠖⠗⠞⠟⠠⠡⠨⠩⠢⠣⠪⠫⠰⠱⠸⠹⠲⠳⠺⠻⠤⠥⠬⠭⠦⠧⠮⠯⠴⠵⠼⠽⠶⠷⠾⠿⡀⡁⡈⡉⡂⡃⡊⡋⡐⡑⡘⡙⡒⡓⡚⡛⡄⡅⡌⡍⡆⡇⡎⡏⡔⡕⡜⡝⡖⡗⡞⡟⡠⡡⡨⡩⡢⡣⡪⡫⡰⡱⡸⡹⡲⡳⡺⡻⡤⡥⡬⡭⡦⡧⡮⡯⡴⡵⡼⡽⡶⡷⡾⡿⢀⢁⢈⢉⢂⢃⢊⢋⢐⢑⢘⢙⢒⢓⢚⢛⢄⢅⢌⢍⢆⢇⢎⢏⢔⢕⢜⢝⢖⢗⢞⢟⢠⢡⢨⢩⢢⢣⢪⢫⢰⢱⢸⢹⢲⢳⢺⢻⢤⢥⢬⢭⢦⢧⢮⢯⢴⢵⢼⢽⢶⢷⢾⢿⣀⣁⣈⣉⣂⣃⣊⣋⣐⣑⣘⣙⣒⣓⣚⣛⣄⣅⣌⣍⣆⣇⣎⣏⣔⣕⣜⣝⣖⣗⣞⣟⣠⣡⣨⣩⣢⣣⣪⣫⣰⣱⣸⣹⣲⣳⣺⣻⣤⣥⣬⣭⣦⣧⣮⣯⣴⣵⣼⣽⣶⣷⣾⣿"

temp_floyd = tempfile.gettempdir() + '/temp_floyd.bmp'
temp_croped = tempfile.gettempdir() + '/temp_croped.bmp'
temp_infos = tempfile.gettempdir() + '/temp_infos'

def prepare_img():
	im = Image.open(input_file_name)
	im = im.convert('RGB')
	im.save(temp_floyd, 'bmp')

	os.system('convert ' + temp_floyd + ' -resize ' + str(pic_width) + ' -dither FloydSteinberg -colors 2 ' + temp_floyd)

	os.system('identify ' + temp_floyd + ' > ' + temp_infos)
	with open(temp_infos, 'r') as f_infos:
		return int(f_infos.read().split(' ')[2].split('x')[1])

def get_data_from_pic_part(filename):
	with open(filename, 'rb') as f_in:
		data = bytearray(f_in.read())
		d1 = int('{:08b}'.format(data[130]/64)[::-1], 2)
		d2 = int('{:08b}'.format(data[134]/16)[::-1], 2)
		d3 = int('{:08b}'.format(data[138]/4)[::-1], 2)
		d4 = int('{:08b}'.format(data[142]/1)[::-1], 2)
		d = d1 + d2 + d3 + d4
		return d

def go():
	pic_height = prepare_img()
	for j in range(pic_height/4):
		for i in range(pic_width/2):
			pos = str(i*2) + '+' + str(j*4)
			os.system('convert ' + temp_floyd + ' -crop 2x4+' + pos + ' -monochrome -depth 1 -colors 2 -type optimize ' +  temp_croped)
			data = get_data_from_pic_part(temp_croped)
			sys.stdout.write(braille_cars[data])
			if i >= (pic_width/2)-1:
				sys.stdout.write('\n')
	
	os.remove(temp_croped)
	os.remove(temp_infos)

go()
