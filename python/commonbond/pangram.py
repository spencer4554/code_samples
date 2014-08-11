#!/usr/bin/python

import string
from common import *

def listMissingLetters(sentence):
    letters = list(string.ascii_lowercase)
    return "".join([x for x in letters if x not in sentence.lower()])

def main():
    tests = {"A quick brown fox jumps over the lazy dog": "",
             "Four score and seven years ago.": "bhijklmpqtwxz",
             "To be or not to be, that is the question!": "cdfgjklmpvwxyz",
             "" : "abcdefghijklmnopqrstuvwxyz"}
    
    run(listMissingLetters, tests)

if __name__ == '__main__':
    main()
