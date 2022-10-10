import re
from string import digits
import itertools

file = open("HR_Txt-624.txt", mode="r", encoding="utf-8")
write_file = open("words.txt", mode="a", encoding="utf-8")
lines = file.readlines()

for line in lines:
    remove_digits = str.maketrans('', '', digits)
    edited_line = line.translate(remove_digits)
    edited_line = edited_line.replace("+", "")
    edited_line = edited_line.split()
    
    if (len(edited_line) == 3):
        write_file.write(", ".join(edited_line))
        write_file.write("\n")
    else:
        del(edited_line[2])
        edited_line = ", ".join(edited_line)
        edited_line = edited_line.replace("(čest.)", "čestica")
        print(edited_line)
        write_file.write(edited_line)
        write_file.write("\n")

file.close()
write_file.close()
