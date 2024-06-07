color = input('input color')#abe8d4
r = int(color[0:2], 16)/255.0
g = int(color[2:4], 16)/255.0
b = int(color[4:], 16)/255.0
print(r,g,b)