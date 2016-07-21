#!/usr/bin/python

import string
from common import *

def listMissingLetters(sentence):
    if isinstance(sentence, (list, tuple)):
        sentence = sentence[0]
    letters = list(string.ascii_lowercase)
    return "".join([x for x in letters if x not in sentence.lower()])

def main():
    tests = {("A quick brown fox jumps over the lazy dog"): "",
             ("Four score and seven years ago."): "bhijklmpqtwxz",
             ("To be or not to be, that is the question!"): "cdfgjklmpvwxyz",
             ("") : "abcdefghijklmnopqrstuvwxyz"}
    
    def adapter(args):
        return listMissingLetters(args)
    
    run(adapter, tests, """USAGE: %s \"pangram\" or test""", 1)

if __name__ == '__main__':
    main()
