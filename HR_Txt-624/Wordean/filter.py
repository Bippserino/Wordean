f = open("nastavak.txt","r", encoding="utf-8")
words = []

line = f.readline()

while line:
    print(line)
    d = input("")

    if d == "":
        words.append(line)
    line = f.readline()
        
f.close()
f = open("words-5.txt","a", encoding="utf-8")
f.write("".join(words))
