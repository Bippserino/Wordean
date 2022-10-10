def has_all_croatian_alphabet_characters(s):
    alphabet = "abcčćdđefghijklmnoprsštuvzž"
    for letter in s:
        if letter.lower() not in alphabet:
            return False
    return True

file = open("words.txt", mode="r", encoding="utf-8")
data = file.read().split("\n")

filea = open("all-words.txt", mode="w", encoding="utf-8")
file_5 = open("words-5.txt",mode="w", encoding="utf-8")
file_6 = open("words-6.txt",mode="w", encoding="utf-8")
file_7 = open("words-7.txt",mode="w", encoding="utf-8")
file_8 = open("words-8.txt",mode="w", encoding="utf-8")
file_9 = open("words-9.txt",mode="w", encoding="utf-8")
file_10 = open("words-10.txt",mode="w", encoding="utf-8")
file_other = open("words-other.txt",mode="w", encoding="utf-8")

words = []
special_characters = ""

for d in data:
    if (d != ""):
        d = d.split(", ")
        words.append(str(d[1]) + ", " + str(d[2]))
    
words = list(set(words))


for w in words:
    filea.write(w + "\n")
    word = w.split(", ")
    word_length = len(word[0])
    w = w.upper()

    if has_all_croatian_alphabet_characters(word[0]):
        if word_length == 5:
            file_5.write(w + "\n")
        
        elif word_length == 6:
            file_6.write(w + "\n")
            
        elif word_length == 7:
            file_7.write(w + "\n")
            
        elif word_length == 8:
            file_8.write(w + "\n")
            
        elif word_length == 9:        
            file_9.write(w + "\n")

        elif word_length == 10:        
            file_10.write(w + "\n")
            
        else:
            file_other.write(w + "\n")
    else:
        file_other.write(w + "\n")    

file.close()
file_5.close()
file_6.close()
file_7.close()
file_8.close()
file_9.close()
file_10.close()
filea.close()
