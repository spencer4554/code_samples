import sys

def run(func, tests, usage):
    if sys.argv[1] == "test":
        test(func, tests)
    elif len(sys.argv) != 2:
        print usage % sys.argv[0]
    else:
        print func(sys.pop(0))

def test(func, tests):
    passed_tests = 0

    for test, expected in tests.iteritems():
        if func(test) != expected:
            subs = {'test': test,
                    'expected': expected,
                    'response': func(test)}
            print "\nFAIL test=%(test)s expected= %(expected)s response=%(response)s" % subs
        else:
            passed_tests += 1
            sys.stdout.write('.')

    print "\nTESTS PASSED: %d" % passed_tests
    print "TESTS FAILED: %d" % (len(tests) - passed_tests)
