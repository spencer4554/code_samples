#!/usr/bin/python

import string
import sys

def listMissingLetters(sentence):
    letters = list(string.ascii_lowercase)
    return "".join([x for x in letters if x not in sentence.lower()])

def main():
    if sys.argv[1] == "test":
        test()
    else:
        print listMissingLetters(sys.argv[1])

def test():        
    tests = {"A quick brown fox jumps over the lazy dog": "",
             "Four score and seven years ago.": "bhijklmpqtwxz",
             "To be or not to be, that is the question!": "cdfgjklmpvwxyz",
             "" : "abcdefghijklmnopqrstuvwxyz"}

    passed_tests = 0

    for test, expected in tests.iteritems():
        if listMissingLetters(test) != expected:
            subs = {'test': test,
                    'expected': expected,
                    'response': listMissingLetters(test)}
            print "FAIL test=%(test)s expected= %(expected)s response=%(response)s" % subs
        else:
            passed_tests += 1
            sys.stdout.write('.')

    print "\nTESTS PASSED: %d" % passed_tests
    print "TESTS FAILED: %d" % (len(tests) - passed_tests)

if __name__ == '__main__':
    main()
